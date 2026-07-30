import type { VRM } from '@pixiv/three-vrm';

import type {
  VrmInteractionColliderSet,
  VrmInteractionTarget,
} from './airi-vrm-types.web';

import { Box3, BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';

const COLLIDER_PREFIX = 'vrm_interaction_';
const DEFINITIONS: ReadonlyArray<{
  bone: VrmInteractionTarget;
  offset: readonly [number, number, number];
  size: readonly [number, number, number];
  target: VrmInteractionTarget;
}> = [
  { bone: 'head', offset: [0, 0.05, 0], size: [0.22, 0.25, 0.25], target: 'head' },
  {
    bone: 'leftUpperArm',
    offset: [0, -0.17, 0],
    size: [0.2, 0.34, 0.2],
    target: 'leftUpperArm',
  },
  {
    bone: 'leftLowerArm',
    offset: [0, -0.15, 0],
    size: [0.17, 0.3, 0.17],
    target: 'leftLowerArm',
  },
  {
    bone: 'leftHand',
    offset: [0.06, 0, 0],
    size: [0.2, 0.2, 0.2],
    target: 'leftHand',
  },
  {
    bone: 'rightUpperArm',
    offset: [0, -0.17, 0],
    size: [0.2, 0.34, 0.2],
    target: 'rightUpperArm',
  },
  {
    bone: 'rightLowerArm',
    offset: [0, -0.15, 0],
    size: [0.17, 0.3, 0.17],
    target: 'rightLowerArm',
  },
  {
    bone: 'rightHand',
    offset: [-0.06, 0, 0],
    size: [0.2, 0.2, 0.2],
    target: 'rightHand',
  },
  {
    bone: 'leftFoot',
    offset: [0, -0.05, -0.08],
    size: [0.15, 0.15, 0.25],
    target: 'leftFoot',
  },
  {
    bone: 'rightFoot',
    offset: [0, -0.05, -0.08],
    size: [0.15, 0.15, 0.25],
    target: 'rightFoot',
  },
];

export function createVrmInteractionColliders(
  vrm: VRM,
): VrmInteractionColliderSet {
  const material = new MeshBasicMaterial({ visible: false });
  const size = new Box3().setFromObject(vrm.scene).getSize(new Vector3());
  const scale = Math.min(1.5, Math.max(0.65, size.y / 1.6));
  const colliders: Mesh[] = [];

  DEFINITIONS.forEach((definition) => {
    const bone = vrm.humanoid?.getNormalizedBoneNode(definition.bone);
    if (!bone) {
      return;
    }
    const geometry = new BoxGeometry(
      definition.size[0] * scale,
      definition.size[1] * scale,
      definition.size[2] * scale,
    );
    const collider = new Mesh(geometry, material);
    collider.name = `${COLLIDER_PREFIX}${definition.target}`;
    collider.position.set(
      definition.offset[0] * scale,
      definition.offset[1] * scale,
      definition.offset[2] * scale,
    );
    bone.add(collider);
    colliders.push(collider);
  });

  return {
    colliders,
    dispose() {
      colliders.forEach((collider) => {
        collider.removeFromParent();
        collider.geometry.dispose();
      });
      colliders.length = 0;
      material.dispose();
    },
  };
}

export function getVrmInteractionTarget(name: string) {
  if (!name.startsWith(COLLIDER_PREFIX)) {
    return null;
  }
  const target = name.slice(COLLIDER_PREFIX.length) as VrmInteractionTarget;
  return DEFINITIONS.some(definition => definition.target === target)
    ? target
    : null;
}

export function isClickLikePointerGesture(
  start: { x: number; y: number },
  end: { x: number; y: number },
  maxDistance = 8,
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return dx * dx + dy * dy <= maxDistance * maxDistance;
}
