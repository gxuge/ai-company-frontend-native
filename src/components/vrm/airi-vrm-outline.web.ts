/* eslint-disable max-params */
import type { MToonMaterial, VRM } from '@pixiv/three-vrm';
import type {
  BufferGeometry,
  InterleavedBufferAttribute,
  Material,
} from 'three';

import { Float32BufferAttribute, Mesh } from 'three';

export const AIRI_OUTLINE_NORMAL_ATTRIBUTE_NAME = 'outlineNormal';

const PREPROCESS_KEY = '__airiOutlinePreprocess';
const SHADER_PATCH_KEY = '__airiOutlineShaderPatch';
const PATCH_CACHE_KEY = 'airiOutline:viewspace-v1';
const POSITION_WELD_EPSILON = 1e-4;
const ZERO_VECTOR_EPSILON = 1e-10;
const COMMON_ANCHOR = '#include <common>';
const BEGIN_NORMAL_ANCHOR = '#include <beginnormal_vertex>';
const OUTLINE_BLOCK_ANCHOR = `  #ifdef OUTLINE
    float worldNormalLength = length( transformedNormal );
    vec3 outlineOffset = outlineWidthFactor * worldNormalLength * objectNormal;

    #ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE
      vec2 outlineWidthMultiplyTextureUv = ( outlineWidthMultiplyTextureUvTransform * vec3( vUv, 1 ) ).xy;
      float outlineTex = texture2D( outlineWidthMultiplyTexture, outlineWidthMultiplyTextureUv ).g;
      outlineOffset *= outlineTex;
    #endif

    #ifdef OUTLINE_WIDTH_SCREEN
      outlineOffset *= vViewPosition.z / projectionMatrix[ 1 ].y;
    #endif

    gl_Position = projectionMatrix * modelViewMatrix * vec4( outlineOffset + transformed, 1.0 );

    gl_Position.z += 1E-6 * gl_Position.w; // anti-artifact magic
  #endif`;

type NumericAttribute
  = BufferGeometry['attributes'][string] | InterleavedBufferAttribute;

function quantize(value: number) {
  return Math.round(value / POSITION_WELD_EPSILON);
}

function writeNormalized(
  target: Float32Array,
  index: number,
  x: number,
  y: number,
  z: number,
) {
  const base = index * 3;
  const lengthSquared = x * x + y * y + z * z;
  if (lengthSquared <= ZERO_VECTOR_EPSILON) {
    target[base] = 0;
    target[base + 1] = 1;
    target[base + 2] = 0;
    return;
  }
  const inverseLength = 1 / Math.sqrt(lengthSquared);
  target[base] = x * inverseLength;
  target[base + 1] = y * inverseLength;
  target[base + 2] = z * inverseLength;
}

function buildWeldedGroups(geometry: BufferGeometry) {
  const groups = new Map<string, number[]>();
  const position = geometry.getAttribute('position');
  for (let index = 0; index < position.count; index += 1) {
    const key = [
      quantize(position.getX(index)),
      quantize(position.getY(index)),
      quantize(position.getZ(index)),
    ].join(':');
    const group = groups.get(key) ?? [];
    group.push(index);
    groups.set(key, group);
  }
  return groups;
}

function accumulateFaceNormals(geometry: BufferGeometry) {
  const position = geometry.getAttribute('position');
  const indices = geometry.getIndex();
  const normals = new Float32Array(position.count * 3);
  const vertexCount = indices?.count ?? position.count;
  const add = (index: number, x: number, y: number, z: number) => {
    normals[index * 3] += x;
    normals[index * 3 + 1] += y;
    normals[index * 3 + 2] += z;
  };

  for (let offset = 0; offset + 2 < vertexCount; offset += 3) {
    const a = indices ? indices.getX(offset) : offset;
    const b = indices ? indices.getX(offset + 1) : offset + 1;
    const c = indices ? indices.getX(offset + 2) : offset + 2;
    const abx = position.getX(b) - position.getX(a);
    const aby = position.getY(b) - position.getY(a);
    const abz = position.getZ(b) - position.getZ(a);
    const acx = position.getX(c) - position.getX(a);
    const acy = position.getY(c) - position.getY(a);
    const acz = position.getZ(c) - position.getZ(a);
    const x = aby * acz - abz * acy;
    const y = abz * acx - abx * acz;
    const z = abx * acy - aby * acx;
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      continue;
    }
    add(a, x, y, z);
    add(b, x, y, z);
    add(c, x, y, z);
  }
  return normals;
}

function writeFallbackNormals(
  output: Float32Array,
  group: number[],
  normal?: NumericAttribute,
) {
  let x = 0;
  let y = 0;
  let z = 0;
  if (normal && normal.itemSize >= 3) {
    group.forEach((index) => {
      x += normal.getX(index);
      y += normal.getY(index);
      z += normal.getZ(index);
    });
  }
  group.forEach(index => writeNormalized(output, index, x, y, z));
}

function ensureOutlineNormals(geometry: BufferGeometry) {
  if (
    geometry.userData[PREPROCESS_KEY]
    && geometry.getAttribute(AIRI_OUTLINE_NORMAL_ATTRIBUTE_NAME)
  ) {
    return;
  }
  const position = geometry.getAttribute('position');
  if (!position || position.itemSize < 3) {
    return;
  }
  const accumulated = accumulateFaceNormals(geometry);
  const original = geometry.getAttribute('normal');
  const output = new Float32Array(position.count * 3);
  buildWeldedGroups(geometry).forEach((group) => {
    let x = 0;
    let y = 0;
    let z = 0;
    group.forEach((index) => {
      x += accumulated[index * 3];
      y += accumulated[index * 3 + 1];
      z += accumulated[index * 3 + 2];
    });
    if (x * x + y * y + z * z <= ZERO_VECTOR_EPSILON) {
      writeFallbackNormals(output, group, original);
      return;
    }
    group.forEach(index => writeNormalized(output, index, x, y, z));
  });
  geometry.setAttribute(
    AIRI_OUTLINE_NORMAL_ATTRIBUTE_NAME,
    new Float32BufferAttribute(output, 3),
  );
  geometry.userData[PREPROCESS_KEY] = { version: 1 };
}

function isMToonMaterial(material: Material): material is MToonMaterial {
  return (material as MToonMaterial).isMToonMaterial === true;
}

function patchOutlineMaterial(material: MToonMaterial) {
  if (!material.isOutline || material.userData[SHADER_PATCH_KEY]) {
    return;
  }
  if (
    !material.vertexShader.includes(COMMON_ANCHOR)
    || !material.vertexShader.includes(BEGIN_NORMAL_ANCHOR)
    || !material.vertexShader.includes(OUTLINE_BLOCK_ANCHOR)
  ) {
    console.warn('[AIRI] MToon outline shader anchors were not found.');
    return;
  }
  const originalKey = material.customProgramCacheKey.bind(material);
  material.customProgramCacheKey = () => {
    const base = originalKey();
    return base ? `${base},${PATCH_CACHE_KEY}` : PATCH_CACHE_KEY;
  };
  material.vertexShader = material.vertexShader
    .replace(
      COMMON_ANCHOR,
      `${COMMON_ANCHOR}
attribute vec3 ${AIRI_OUTLINE_NORMAL_ATTRIBUTE_NAME};`,
    )
    .replace(
      BEGIN_NORMAL_ANCHOR,
      `${BEGIN_NORMAL_ANCHOR}
  objectNormal = ${AIRI_OUTLINE_NORMAL_ATTRIBUTE_NAME};`,
    )
    .replace(
      OUTLINE_BLOCK_ANCHOR,
      `  #ifdef OUTLINE
    float worldNormalLength = length( transformedNormal );
    float outlineWidth = outlineWidthFactor * worldNormalLength;

    #ifdef USE_OUTLINEWIDTHMULTIPLYTEXTURE
      vec2 outlineWidthMultiplyTextureUv = ( outlineWidthMultiplyTextureUvTransform * vec3( vUv, 1 ) ).xy;
      float outlineTex = texture2D( outlineWidthMultiplyTexture, outlineWidthMultiplyTextureUv ).g;
      outlineWidth *= outlineTex;
    #endif

    #ifdef OUTLINE_WIDTH_SCREEN
      outlineWidth *= vViewPosition.z / projectionMatrix[ 1 ].y;
    #endif

    vec3 outlineDirectionVS = normalize( normalMatrix * objectNormal );
    outlineDirectionVS.z = -0.1;
    outlineDirectionVS = normalize( outlineDirectionVS );

    vec4 outlinePositionVS = mvPosition;
    outlinePositionVS.xyz += outlineDirectionVS * outlineWidth;
    outlinePositionVS.z += -0.001;
    gl_Position = projectionMatrix * outlinePositionVS;
    gl_Position.z += 1E-6 * gl_Position.w;
  #endif`,
    );
  material.userData[SHADER_PATCH_KEY] = { version: 1 };
  material.needsUpdate = true;
}

export function prepareVrmOutlineRuntime(vrm: VRM) {
  vrm.scene.traverse((object) => {
    if (!(object instanceof Mesh)) {
      return;
    }
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    const hasOutline = materials.some(
      material => isMToonMaterial(material) && material.isOutline,
    );
    if (!hasOutline) {
      return;
    }
    ensureOutlineNormals(object.geometry);
    materials.forEach((material) => {
      if (isMToonMaterial(material)) {
        patchOutlineMaterial(material);
      }
    });
  });
}
