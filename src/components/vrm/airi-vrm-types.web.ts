import type { VRM } from '@pixiv/three-vrm';
import type {
  AnimationMixer,
  Group,
  Mesh,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

export type Vec3 = { x: number; y: number; z: number };
export type TrackingMode = 'camera' | 'mouse' | 'none';
export type EnvironmentMode = 'hemisphere' | 'skyBox';
export type ScenePhase
  = | 'binding'
    | 'error'
    | 'loading'
    | 'mounted'
    | 'no-model'
    | 'pending';
export type VrmLifecycleReason
  = | 'component-unmount'
    | 'initial-load'
    | 'manual-reload'
    | 'model-reload'
    | 'model-switch';
export type VrmExpression
  = | 'angry'
    | 'happy'
    | 'neutral'
    | 'relaxed'
    | 'sad'
    | 'surprised'
    | 'think';
export type VrmInteractionTarget
  = | 'head'
    | 'leftFoot'
    | 'leftHand'
    | 'leftLowerArm'
    | 'leftUpperArm'
    | 'rightFoot'
    | 'rightHand'
    | 'rightLowerArm'
    | 'rightUpperArm';

export type VrmStagePerformance = {
  drawCalls: number;
  fps: number;
  frameMs: number;
  geometries: number;
  hitTestMs: number;
  jsHeapUsedBytes?: number;
  programs: number;
  textures: number;
  triangles: number;
  updateMs: number;
};

export type VrmStageSnapshot = {
  animation: 'idle' | 'loading' | 'playing' | 'unavailable';
  cacheHit?: boolean;
  error?: string;
  interaction?: VrmInteractionTarget;
  modelSize?: Vec3;
  performance?: VrmStagePerformance;
  phase: 'error' | 'idle' | 'loading' | 'ready';
  progress: number;
  scenePhase: ScenePhase;
};

export type RenderTargetRegionRead = {
  centerX: number;
  centerY: number;
  data: Uint8Array;
  readHeight: number;
  readWidth: number;
  scaleX: number;
  scaleY: number;
  startX: number;
  startY: number;
};

export type VrmInteractionColliderSet = {
  colliders: readonly Mesh[];
  dispose: () => void;
};

export type ManagedVrmInstance = {
  colliders: VrmInteractionColliderSet;
  emote: VrmEmoteController;
  group: Group;
  mixer: AnimationMixer;
  modelUrl: string;
  scopeKey: string;
  vrm: VRM;
};

export type VrmEmoteController = {
  dispose: () => void;
  setExpression: (
    expression: VrmExpression,
    intensity?: number,
    resetAfterMs?: number,
  ) => void;
  update: (delta: number) => void;
};

export type AiriVrmRuntimeContext = {
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  scene: Scene;
};

export type AiriVrmTraceEvent = {
  payload: Record<string, unknown>;
  ts: number;
  type: string;
};
