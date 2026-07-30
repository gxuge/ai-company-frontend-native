import type {
  EnvironmentMode,
  ScenePhase,
  TrackingMode,
  Vec3,
} from './airi-vrm-types.web';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const DEFAULT_CAMERA_POSITION: Vec3 = { x: 0, y: 1.25, z: 2.8 };
const DEFAULT_LOOK_AT_TARGET: Vec3 = { x: 0, y: 1.2, z: 0 };

type AiriVrmStageState = {
  ambientLightColor: string;
  ambientLightIntensity: number;
  beginSceneTransaction: () => void;
  cameraDistance: number;
  cameraFov: number;
  cameraPosition: Vec3;
  directionalLightColor: string;
  directionalLightIntensity: number;
  directionalLightPosition: Vec3;
  endSceneTransaction: () => void;
  environmentMode: EnvironmentMode;
  hemisphereGroundColor: string;
  hemisphereLightIntensity: number;
  hemisphereSkyColor: string;
  lastCommittedModelUrl: string;
  lookAtTarget: Vec3;
  modelOffset: Vec3;
  modelOrigin: Vec3;
  modelRotationY: number;
  modelSize: Vec3;
  renderScale: number;
  resetSettings: () => void;
  scenePhase: ScenePhase;
  sceneTransactionDepth: number;
  setStateValues: (values: Partial<AiriVrmStageState>) => void;
  skyBoxIntensity: number;
  trackingMode: TrackingMode;
};

const persistedStorage
  = typeof window === 'undefined'
    ? undefined
    : createJSONStorage(() => window.localStorage);

export const useAiriVrmStageStore = create<AiriVrmStageState>()(
  persist(
    set => ({
      ambientLightColor: '#FFFFFF',
      ambientLightIntensity: 0.6,
      beginSceneTransaction: () => {
        set(state => ({
          sceneTransactionDepth: state.sceneTransactionDepth + 1,
        }));
      },
      cameraDistance: 2.8,
      cameraFov: 40,
      cameraPosition: DEFAULT_CAMERA_POSITION,
      directionalLightColor: '#fffbf5',
      directionalLightIntensity: 2.02,
      directionalLightPosition: { x: 0, y: 1.8, z: 2.4 },
      endSceneTransaction: () => {
        set(state => ({
          sceneTransactionDepth: Math.max(0, state.sceneTransactionDepth - 1),
        }));
      },
      environmentMode: 'hemisphere',
      hemisphereGroundColor: '#222222',
      hemisphereLightIntensity: 0.4,
      hemisphereSkyColor: '#FFFFFF',
      lastCommittedModelUrl: '',
      lookAtTarget: DEFAULT_LOOK_AT_TARGET,
      modelOffset: { x: 0, y: 0, z: 0 },
      modelOrigin: { x: 0, y: 1.2, z: 0 },
      modelRotationY: 0,
      modelSize: { x: 0, y: 0, z: 0 },
      renderScale:
        typeof window === 'undefined' ? 1 : Math.min(window.devicePixelRatio, 2),
      resetSettings: () => {
        set({
          ambientLightColor: '#FFFFFF',
          ambientLightIntensity: 0.6,
          cameraDistance: 2.8,
          cameraFov: 40,
          cameraPosition: DEFAULT_CAMERA_POSITION,
          directionalLightColor: '#fffbf5',
          directionalLightIntensity: 2.02,
          directionalLightPosition: { x: 0, y: 1.8, z: 2.4 },
          environmentMode: 'hemisphere',
          hemisphereGroundColor: '#222222',
          hemisphereLightIntensity: 0.4,
          hemisphereSkyColor: '#FFFFFF',
          lastCommittedModelUrl: '',
          lookAtTarget: DEFAULT_LOOK_AT_TARGET,
          modelOffset: { x: 0, y: 0, z: 0 },
          modelOrigin: { x: 0, y: 1.2, z: 0 },
          modelRotationY: 0,
          modelSize: { x: 0, y: 0, z: 0 },
          scenePhase: 'pending',
          sceneTransactionDepth: 0,
          skyBoxIntensity: 0.1,
          trackingMode: 'mouse',
        });
      },
      scenePhase: 'pending',
      sceneTransactionDepth: 0,
      setStateValues: values => set(values),
      skyBoxIntensity: 0.1,
      trackingMode: 'mouse',
    }),
    {
      name: 'airi-vrm-stage-settings',
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<AiriVrmStageState>;
        if (version < 1 && state.trackingMode === 'none') {
          return { ...state, trackingMode: 'mouse' };
        }
        return state;
      },
      partialize: state => ({
        ambientLightColor: state.ambientLightColor,
        ambientLightIntensity: state.ambientLightIntensity,
        cameraDistance: state.cameraDistance,
        cameraFov: state.cameraFov,
        cameraPosition: state.cameraPosition,
        directionalLightColor: state.directionalLightColor,
        directionalLightIntensity: state.directionalLightIntensity,
        directionalLightPosition: state.directionalLightPosition,
        environmentMode: state.environmentMode,
        hemisphereGroundColor: state.hemisphereGroundColor,
        hemisphereLightIntensity: state.hemisphereLightIntensity,
        hemisphereSkyColor: state.hemisphereSkyColor,
        lastCommittedModelUrl: state.lastCommittedModelUrl,
        lookAtTarget: state.lookAtTarget,
        modelOffset: state.modelOffset,
        modelOrigin: state.modelOrigin,
        modelRotationY: state.modelRotationY,
        modelSize: state.modelSize,
        renderScale: state.renderScale,
        skyBoxIntensity: state.skyBoxIntensity,
        trackingMode: state.trackingMode,
      }),
      storage: persistedStorage,
      version: 1,
    },
  ),
);

export function isAiriVrmSceneMutationLocked() {
  const state = useAiriVrmStageStore.getState();
  return state.scenePhase !== 'mounted' || state.sceneTransactionDepth > 0;
}
