import type { VRM } from '@pixiv/three-vrm';
import type {
  Material,
  Object3D,
  ShaderMaterial,
  SphericalHarmonics3,
} from 'three';

import { LightProbe, Mesh, Vector3 } from 'three';

const VERTEX_DECLARATION = `
#ifndef AIRI_DIFFUSE_VS_DECL
#define AIRI_DIFFUSE_VS_DECL
varying vec3 vWorldNormal;
#endif
`;

const VERTEX_APPLICATION = `
#ifndef AIRI_DIFFUSE_VS_APPLY
#define AIRI_DIFFUSE_VS_APPLY
vWorldNormal = normalize(mat3(modelMatrix) * objectNormal);
#endif
`;

const FRAGMENT_COMMON = `
#ifndef AIRI_DIFFUSE_COMMON
#define AIRI_DIFFUSE_COMMON
uniform int uNprEnvMode;
uniform float uEnvIntensity;
uniform vec3 uSHCoeffs[9];
varying vec3 vWorldNormal;
const float C0=0.2820947918;
const float C1=0.4886025119;
const float C2=1.0925484306;
const float C3=0.3153915653;
const float C4=0.5462742153;
vec3 AIRI_evalIrradianceSH(vec3 n){
  n=normalize(n);
  vec3 r=uSHCoeffs[0]*C0;
  r+=uSHCoeffs[1]*(-C1*n.y);
  r+=uSHCoeffs[2]*(C1*n.z);
  r+=uSHCoeffs[3]*(-C1*n.x);
  r+=uSHCoeffs[4]*(C2*n.x*n.y);
  r+=uSHCoeffs[5]*(-C2*n.y*n.z);
  r+=uSHCoeffs[6]*(C3*(3.0*n.z*n.z-1.0));
  r+=uSHCoeffs[7]*(-C2*n.x*n.z);
  r+=uSHCoeffs[8]*(C4*(n.x*n.x-n.y*n.y));
  return r;
}
#endif
`;

const FRAGMENT_APPLICATION = `
#ifndef AIRI_DIFFUSE_APPLY
#define AIRI_DIFFUSE_APPLY
if(uNprEnvMode==2){
  vec3 I=AIRI_evalIrradianceSH(normalize(vWorldNormal));
  gl_FragColor.rgb+=(gl_FragColor.rgb/PI)*I*uEnvIntensity;
}
#endif
`;

type AiriIblUniforms = {
  uEnvIntensity: { value: number };
  uNprEnvMode: { value: number };
  uSHCoeffs: { value: Vector3[] };
};

type IblMaterial = Material & {
  userData: {
    __airiIbl?: AiriIblUniforms;
  };
};

function injectDiffuseIbl(material: ShaderMaterial) {
  const baseKey = material.customProgramCacheKey?.() ?? '';
  material.customProgramCacheKey = () => `${baseKey}|airi-diffuse-ibl`;
  const previous = material.onBeforeCompile;
  material.onBeforeCompile = (shader, renderer) => {
    previous?.(shader, renderer);
    if (!shader.vertexShader.includes('AIRI_DIFFUSE_VS_DECL')) {
      shader.vertexShader = `${VERTEX_DECLARATION}\n${shader.vertexShader}`;
    }
    if (
      shader.vertexShader.includes('#include <defaultnormal_vertex>')
      && !shader.vertexShader.includes('AIRI_DIFFUSE_VS_APPLY')
    ) {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <defaultnormal_vertex>',
        `#include <defaultnormal_vertex>\n${VERTEX_APPLICATION}`,
      );
    }
    if (!shader.fragmentShader.includes('AIRI_DIFFUSE_COMMON')) {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>\n${FRAGMENT_COMMON}`,
      );
    }
    if (!shader.fragmentShader.includes('AIRI_DIFFUSE_APPLY')) {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `${FRAGMENT_APPLICATION}\n#include <dithering_fragment>`,
      );
    }
    shader.uniforms.uNprEnvMode ??= { value: 0 };
    shader.uniforms.uEnvIntensity ??= { value: 0 };
    shader.uniforms.uSHCoeffs ??= {
      value: Array.from({ length: 9 }, () => new Vector3()),
    };
    material.userData.__airiIbl
      = shader.uniforms as unknown as AiriIblUniforms;
  };
  material.toneMapped = false;
  material.needsUpdate = true;
}

export function prepareVrmIbl(vrm: VRM) {
  vrm.scene.traverse((object) => {
    if (!(object instanceof Mesh)) {
      return;
    }
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    materials.forEach((material) => {
      if (
        'isShaderMaterial' in material
        && (material as ShaderMaterial).isShaderMaterial
      ) {
        injectDiffuseIbl(material as ShaderMaterial);
      }
    });
  });
}

function assignSphericalHarmonics(
  uniforms: AiriIblUniforms,
  sh?: SphericalHarmonics3 | null,
) {
  if (!sh) {
    return;
  }
  for (let index = 0; index < 9; index += 1) {
    uniforms.uSHCoeffs.value[index].copy(sh.coefficients[index]);
  }
}

export function updateVrmIbl(
  root: Object3D,
  values: {
    intensity: number;
    sh?: SphericalHarmonics3 | null;
    skyBoxEnabled: boolean;
  },
) {
  root.traverse((object) => {
    if (!(object instanceof Mesh)) {
      return;
    }
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    materials.forEach((material) => {
      const uniforms = (material as IblMaterial).userData.__airiIbl;
      if (!uniforms) {
        return;
      }
      uniforms.uNprEnvMode.value = values.skyBoxEnabled ? 2 : 0;
      uniforms.uEnvIntensity.value = values.intensity;
      assignSphericalHarmonics(uniforms, values.sh);
    });
  });
}

export function createIblProbeController(scene: Object3D) {
  const probe = new LightProbe();
  probe.name = 'AIRI_IBL_Probe';
  scene.add(probe);
  return {
    dispose() {
      probe.removeFromParent();
    },
    update(
      enabled: boolean,
      intensity: number,
      sh?: SphericalHarmonics3 | null,
    ) {
      probe.intensity = enabled ? intensity : 0;
      if (sh) {
        probe.sh.copy(sh);
      }
    },
  };
}
