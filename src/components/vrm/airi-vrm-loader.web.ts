import type { VRM } from '@pixiv/three-vrm';
import type { VRMAnimation } from '@pixiv/three-vrm-animation';
import type { AnimationClip, Mesh, Object3D } from 'three';

import {
  MToonMaterialLoaderPlugin,
  VRMLoaderPlugin,
  VRMUtils,
} from '@pixiv/three-vrm';
import {
  createVRMAnimationClip,
  VRMAnimationLoaderPlugin,
  VRMLookAtQuaternionProxy,
} from '@pixiv/three-vrm-animation';
import {
  Box3,
  Group,
  Quaternion,
  Vector3,
  VectorKeyframeTrack,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { prepareVrmOutlineRuntime } from './airi-vrm-outline.web';

let sharedLoader: GLTFLoader | undefined;

export function getAiriVrmLoader() {
  if (sharedLoader) {
    return sharedLoader;
  }
  sharedLoader = new GLTFLoader();
  sharedLoader.crossOrigin = 'anonymous';
  sharedLoader.register((parser) => {
    const mtoonMaterialPlugin = new MToonMaterialLoaderPlugin(parser);
    return new VRMLoaderPlugin(parser, { mtoonMaterialPlugin });
  });
  sharedLoader.register(parser => new VRMAnimationLoaderPlugin(parser));
  return sharedLoader;
}

function computeBoundingBox(root: Object3D) {
  const box = new Box3();
  const childBox = new Box3();
  root.updateMatrixWorld(true);
  root.traverse((object) => {
    if (!object.visible) {
      return;
    }
    const mesh = object as Mesh;
    if (!mesh.isMesh || !mesh.geometry) {
      return;
    }
    if (mesh.name.startsWith('VRMC_springBone_collider')) {
      return;
    }
    mesh.geometry.computeBoundingBox();
    if (!mesh.geometry.boundingBox) {
      return;
    }
    childBox.copy(mesh.geometry.boundingBox);
    childBox.applyMatrix4(mesh.matrixWorld);
    box.union(childBox);
  });
  return box;
}

export async function loadAiriVrm(
  modelUrl: string,
  onProgress?: (progress: number) => void,
) {
  const gltf = await getAiriVrmLoader().loadAsync(modelUrl, (event) => {
    onProgress?.(
      event.total > 0 ? Math.round((event.loaded / event.total) * 100) : 0,
    );
  });
  const vrm = gltf.userData.vrm as VRM | undefined;
  if (!vrm) {
    throw new Error('The selected file does not contain VRM data.');
  }

  VRMUtils.removeUnnecessaryVertices(vrm.scene);
  VRMUtils.combineSkeletons(vrm.scene);
  VRMUtils.rotateVRM0(vrm);
  prepareVrmOutlineRuntime(vrm);
  vrm.scene.traverse((object) => {
    object.frustumCulled = false;
  });

  if (vrm.lookAt) {
    const proxy = new VRMLookAtQuaternionProxy(vrm.lookAt);
    proxy.name = 'lookAtQuaternionProxy';
    vrm.scene.add(proxy);
  }

  const group = new Group();
  group.add(vrm.scene);
  const targetDirection = new Vector3(0, 0, -1);
  if (vrm.lookAt) {
    const rotation = new Quaternion().setFromUnitVectors(
      vrm.lookAt.faceFront.clone().normalize(),
      targetDirection,
    );
    group.quaternion.premultiply(rotation);
  }
  vrm.springBoneManager?.reset();
  group.updateMatrixWorld(true);

  const bounds = computeBoundingBox(group);
  const modelSize = bounds.getSize(new Vector3());
  const modelCenter = bounds.getCenter(new Vector3());
  modelCenter.y += modelSize.y / 5;

  return {
    group,
    modelCenter,
    modelSize,
    vrm,
  };
}

function reAnchorRootPositionTrack(clip: AnimationClip, vrm: VRM) {
  const hips = vrm.humanoid?.getNormalizedBoneNode('hips');
  if (!hips) {
    return;
  }
  hips.updateMatrixWorld(true);
  const defaultPosition = hips.getWorldPosition(new Vector3());
  const hipsTrack = clip.tracks.find(
    track =>
      track instanceof VectorKeyframeTrack
      && track.name === `${hips.name}.position`,
  );
  if (!(hipsTrack instanceof VectorKeyframeTrack)) {
    return;
  }
  const animationPosition = new Vector3(
    hipsTrack.values[0],
    hipsTrack.values[1],
    hipsTrack.values[2],
  );
  const delta = animationPosition.sub(defaultPosition);
  clip.tracks.forEach((track) => {
    if (
      !(track instanceof VectorKeyframeTrack)
      || !track.name.endsWith('.position')
    ) {
      return;
    }
    for (let index = 0; index < track.values.length; index += 3) {
      track.values[index] -= delta.x;
      track.values[index + 1] -= delta.y;
      track.values[index + 2] -= delta.z;
    }
  });
}

export async function loadAiriVrmAnimation(
  animationUrl: string,
  vrm: VRM,
) {
  const gltf = await getAiriVrmLoader().loadAsync(animationUrl);
  const animations = gltf.userData.vrmAnimations as VRMAnimation[] | undefined;
  const animation = animations?.[0];
  if (!animation) {
    throw new Error('The VRMA file does not contain a VRM animation.');
  }
  const clip = createVRMAnimationClip(animation, vrm);
  reAnchorRootPositionTrack(clip, vrm);
  return clip;
}
