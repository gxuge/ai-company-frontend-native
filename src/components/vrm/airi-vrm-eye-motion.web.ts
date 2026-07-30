import type { VRM } from '@pixiv/three-vrm';

import type { PerspectiveCamera } from 'three';
import type { TrackingMode, Vec3 } from './airi-vrm-types.web';

import {
  Euler,
  Object3D,
  Quaternion,
  Raycaster,
  Vector2,
  Vector3,
} from 'three';

type BonePoseState = {
  base: Quaternion;
  inverseOffset: Quaternion;
  lastOffset: Quaternion;
  lastOutput: Quaternion;
  node?: Object3D;
};

function applyBoneOffset(
  node: Object3D | null,
  offset: Quaternion,
  state: BonePoseState,
) {
  if (!node) {
    state.node = undefined;
    return;
  }
  if (state.node !== node) {
    state.node = node;
    state.lastOffset.identity();
    state.lastOutput.copy(node.quaternion);
  }

  state.base.copy(node.quaternion);
  if (state.base.angleTo(state.lastOutput) < 1e-4) {
    state.base.multiply(state.inverseOffset.copy(state.lastOffset).invert());
  }
  node.quaternion.copy(state.base).multiply(offset);
  state.lastOffset.copy(offset);
  state.lastOutput.copy(node.quaternion);
}

// The eye target, idle saccades, and head/neck pose share one frame lifecycle.
// eslint-disable-next-line max-lines-per-function
export function createVrmEyeMotionController() {
  const targetObject = new Object3D();
  const fixationTarget = new Vector3();
  const desiredTarget = new Vector3();
  const raycaster = new Raycaster();
  let initialized = false;
  let mode: TrackingMode = 'none';
  let desiredHeadPitch = 0;
  let desiredHeadYaw = 0;
  let headPitch = 0;
  let headYaw = 0;
  let nextSaccadeAfter = 0.35;
  let timeSinceSaccade = 0;
  const headPose: BonePoseState = {
    base: new Quaternion(),
    inverseOffset: new Quaternion(),
    lastOffset: new Quaternion(),
    lastOutput: new Quaternion(),
  };
  const neckPose: BonePoseState = {
    base: new Quaternion(),
    inverseOffset: new Quaternion(),
    lastOffset: new Quaternion(),
    lastOutput: new Quaternion(),
  };
  const headOffset = new Quaternion();
  const headRotation = new Euler(0, 0, 0, 'YXZ');
  const neckOffset = new Quaternion();
  const neckRotation = new Euler(0, 0, 0, 'YXZ');

  function setIdleTarget(base: Vec3) {
    desiredTarget.set(
      base.x + (Math.random() - 0.5) * 0.5,
      base.y + (Math.random() - 0.5) * 0.5,
      base.z,
    );
    nextSaccadeAfter = 0.15 + Math.random() * 1.15;
    timeSinceSaccade = 0;
  }

  function setScreenTarget(
    context: {
      camera: PerspectiveCamera;
      canvas: HTMLCanvasElement;
      clientX: number;
      clientY: number;
    },
  ) {
    const { camera, canvas, clientX, clientY } = context;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }
    const point = new Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    desiredHeadYaw = point.x * 0.42;
    desiredHeadPitch = point.y * -0.22;
    raycaster.setFromCamera(point, camera);
    desiredTarget
      .copy(raycaster.ray.origin)
      .add(raycaster.ray.direction.clone().normalize().multiplyScalar(8));
  }

  return {
    setCameraTarget(cameraPosition: Vec3) {
      mode = 'camera';
      desiredTarget.set(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z,
      );
      desiredHeadPitch = 0;
      desiredHeadYaw = 0;
      initialized = true;
    },
    setIdle(base: Vec3) {
      mode = 'none';
      desiredHeadPitch = 0;
      desiredHeadYaw = 0;
      if (!initialized) {
        setIdleTarget(base);
        fixationTarget.copy(desiredTarget);
        initialized = true;
      }
    },
    setMouseTarget(
      context: {
        camera: PerspectiveCamera;
        canvas: HTMLCanvasElement;
        clientX: number;
        clientY: number;
      },
    ) {
      mode = 'mouse';
      setScreenTarget(context);
      initialized = true;
    },
    update(vrm: VRM | undefined, delta: number, idleBase: Vec3) {
      if (!vrm) {
        return;
      }

      if (mode === 'none') {
        timeSinceSaccade += delta;
        if (!initialized || timeSinceSaccade >= nextSaccadeAfter) {
          setIdleTarget(idleBase);
          initialized = true;
        }
      }

      const smoothing = 1 - Math.exp(-18 * delta);
      fixationTarget.lerp(desiredTarget, smoothing);
      headYaw += (desiredHeadYaw - headYaw) * (1 - Math.exp(-8 * delta));
      headPitch += (desiredHeadPitch - headPitch) * (1 - Math.exp(-8 * delta));

      headRotation.set(headPitch * 0.68, headYaw * 0.68, 0);
      neckRotation.set(headPitch * 0.32, headYaw * 0.32, 0);
      headOffset.setFromEuler(headRotation);
      neckOffset.setFromEuler(neckRotation);
      applyBoneOffset(
        vrm.humanoid?.getNormalizedBoneNode('head') ?? null,
        headOffset,
        headPose,
      );
      applyBoneOffset(
        vrm.humanoid?.getNormalizedBoneNode('neck') ?? null,
        neckOffset,
        neckPose,
      );

      if (vrm.lookAt) {
        if (!vrm.lookAt.target) {
          vrm.lookAt.target = targetObject;
        }
        targetObject.position.copy(fixationTarget);
        targetObject.updateMatrixWorld();
        vrm.lookAt.update(delta);
      }
    },
  };
}
