import type { Material } from 'three';

import type { AiriEnvironmentController } from './airi-vrm-environment.web';

import type {
  ManagedVrmInstance,
  RenderTargetRegionRead,
  TrackingMode,
  VrmExpression,
  VrmInteractionTarget,
  VrmLifecycleReason,
  VrmStageSnapshot,
} from './airi-vrm-types.web';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  AnimationMixer,
  Box3,
  Clock,
  Color,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  MathUtils,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  clearManagedVrmInstance,
  disposeManagedVrmInstance,
  stashManagedVrmInstance,
  takeManagedVrmInstance,
} from './airi-vrm-cache.web';
import {

  loadAiriEnvironment,
} from './airi-vrm-environment.web';
import {
  createBlinkController,
  createVrmEmoteController,
} from './airi-vrm-expression.web';
import { createVrmEyeMotionController } from './airi-vrm-eye-motion.web';
import {
  createIblProbeController,
  prepareVrmIbl,
  updateVrmIbl,
} from './airi-vrm-ibl.web';
import {
  createVrmInteractionColliders,
  getVrmInteractionTarget,
  isClickLikePointerGesture,
} from './airi-vrm-interaction.web';
import { createVrmLipSyncController } from './airi-vrm-lip-sync.web';
import {
  loadAiriVrm,
  loadAiriVrmAnimation,
} from './airi-vrm-loader.web';
import { createRenderTargetReader } from './airi-vrm-render-target.web';
import {
  isAiriVrmSceneMutationLocked,
  useAiriVrmStageStore,
} from './airi-vrm-store.web';
import {
  createPerformanceSnapshot,
  emitAiriVrmTrace,
} from './airi-vrm-trace.web';

type RuntimeOptions = {
  animationUrl?: string;
  hdrUrl: string;
  host: HTMLDivElement;
  modelUrl: string;
  onInteract?: (target: VrmInteractionTarget) => void;
  onSnapshotChange?: (snapshot: VrmStageSnapshot) => void;
  paused?: boolean;
  scopeKey: string;
  showGrid?: boolean;
};

type UpdatableMaterial = Material & {
  update?: (delta: number) => void;
};

const INITIAL_SNAPSHOT: VrmStageSnapshot = {
  animation: 'idle',
  phase: 'idle',
  progress: 0,
  scenePhase: 'pending',
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function measure(fn: () => void) {
  const startedAt = performance.now();
  fn();
  return performance.now() - startedAt;
}

export class AiriVrmRuntime {
  private active?: ManagedVrmInstance;
  private animationFrame = 0;
  private camera: PerspectiveCamera;
  private clock = new Clock();
  private controls: OrbitControls;
  private directionalLight: DirectionalLight;
  private disposed = false;
  private environment?: AiriEnvironmentController;
  private environmentLoading = false;
  private environmentSequence = 0;
  private eyeMotion = createVrmEyeMotionController();
  private fillLight: HemisphereLight;
  private frameCount = 0;
  private frameDurationSum = 0;
  private grid: GridHelper;
  private iblProbe;
  private lastMetricsAt = performance.now();
  private lastUpdateMs = 0;
  private lipSync = createVrmLipSyncController();
  private loadSequence = 0;
  private options: RuntimeOptions;
  private pointerStart?: { id: number; x: number; y: number };
  private raycaster = new Raycaster();
  private renderer: WebGLRenderer;
  private renderTargetReader;
  private scene = new Scene();
  private snapshot = INITIAL_SNAPSHOT;
  private storeUnsubscribe?: () => void;
  private pointer = new Vector2();
  private ambientLight: AmbientLight;
  private resizeObserver: ResizeObserver;

  constructor(options: RuntimeOptions) {
    this.options = options;
    const state = useAiriVrmStageStore.getState();
    this.camera = new PerspectiveCamera(state.cameraFov, 1, 0.01, 100);
    this.camera.position.set(
      state.cameraPosition.x,
      state.cameraPosition.y,
      state.cameraPosition.z,
    );
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.setPixelRatio(state.renderScale);
    Object.assign(this.renderer.domElement.style, {
      display: 'block',
      height: '100%',
      width: '100%',
    });
    options.host.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.enablePan = true;
    this.controls.minDistance = 0.2;
    this.controls.maxDistance = 15;
    this.controls.target.set(
      state.lookAtTarget.x,
      state.lookAtTarget.y,
      state.lookAtTarget.z,
    );

    this.ambientLight = new AmbientLight(
      state.ambientLightColor,
      state.ambientLightIntensity,
    );
    this.fillLight = new HemisphereLight(
      state.hemisphereSkyColor,
      state.hemisphereGroundColor,
      state.hemisphereLightIntensity,
    );
    this.directionalLight = new DirectionalLight(
      state.directionalLightColor,
      state.directionalLightIntensity,
    );
    this.grid = new GridHelper(10, 20, '#3c4657', '#252d3a');
    this.scene.add(
      this.ambientLight,
      this.fillLight,
      this.directionalLight,
      this.grid,
    );
    this.iblProbe = createIblProbeController(this.scene);
    this.renderTargetReader = createRenderTargetReader({
      getCamera: () => this.camera,
      getCanvas: () => this.renderer.domElement,
      getRenderer: () => this.renderer,
      getScene: () => this.scene,
    });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(options.host);
    this.bindEvents();
    this.applySettings();
    this.storeUnsubscribe = useAiriVrmStageStore.subscribe(() => {
      this.applySettings();
    });
  }

  async start() {
    this.resize();
    this.render();
  }

  setPaused(paused: boolean) {
    this.options.paused = paused;
  }

  setShowGrid(showGrid: boolean) {
    this.options.showGrid = showGrid;
    this.grid.visible = showGrid;
  }

  // Loading is transaction-oriented so stale async work cannot replace a newer model.
  // eslint-disable-next-line max-lines-per-function
  async loadModel(modelUrl: string, animationUrl?: string) {
    this.options.modelUrl = modelUrl;
    this.options.animationUrl = animationUrl;
    const requestId = ++this.loadSequence;
    const state = useAiriVrmStageStore.getState();
    const reason: VrmLifecycleReason = !state.lastCommittedModelUrl
      ? 'initial-load'
      : state.lastCommittedModelUrl === modelUrl
        ? 'model-reload'
        : 'model-switch';

    state.beginSceneTransaction();
    state.setStateValues({ scenePhase: modelUrl ? 'loading' : 'no-model' });
    this.updateSnapshot({
      animation: animationUrl ? 'loading' : 'idle',
      phase: modelUrl ? 'loading' : 'idle',
      progress: 0,
      scenePhase: modelUrl ? 'loading' : 'no-model',
    });
    emitAiriVrmTrace('model:load:start', { modelUrl, reason });

    if (this.active) {
      this.active.group.removeFromParent();
      stashManagedVrmInstance(this.active);
      this.active = undefined;
    }
    if (!modelUrl) {
      state.endSceneTransaction();
      return;
    }

    const cached = takeManagedVrmInstance(this.options.scopeKey, modelUrl);
    if (cached) {
      if (requestId !== this.loadSequence || this.disposed) {
        stashManagedVrmInstance(cached);
        state.endSceneTransaction();
        return;
      }
      this.commitInstance(cached, {
        animation: animationUrl ? 'playing' : 'idle',
        cacheHit: true,
        reason,
      });
      return;
    }

    const startedAt = performance.now();
    try {
      const loaded = await loadAiriVrm(modelUrl, (progress) => {
        if (requestId === this.loadSequence) {
          this.updateSnapshot({ progress });
        }
      });
      if (requestId !== this.loadSequence || this.disposed) {
        disposeManagedVrmInstance({
          colliders: createVrmInteractionColliders(loaded.vrm),
          emote: createVrmEmoteController(loaded.vrm),
          group: loaded.group,
          mixer: new AnimationMixer(loaded.vrm.scene),
          modelUrl,
          scopeKey: this.options.scopeKey,
          vrm: loaded.vrm,
        });
        state.endSceneTransaction();
        return;
      }

      prepareVrmIbl(loaded.vrm);
      const mixer = new AnimationMixer(loaded.vrm.scene);
      let animation: VrmStageSnapshot['animation'] = 'idle';
      if (animationUrl) {
        try {
          const clip = await loadAiriVrmAnimation(animationUrl, loaded.vrm);
          mixer.clipAction(clip).play();
          animation = 'playing';
        }
        catch (error) {
          console.warn('Failed to load AIRI idle animation:', error);
          animation = 'unavailable';
        }
      }

      const instance: ManagedVrmInstance = {
        colliders: createVrmInteractionColliders(loaded.vrm),
        emote: createVrmEmoteController(loaded.vrm),
        group: loaded.group,
        mixer,
        modelUrl,
        scopeKey: this.options.scopeKey,
        vrm: loaded.vrm,
      };
      this.commitInstance(instance, {
        animation,
        cacheHit: false,
        reason,
      });
      emitAiriVrmTrace('model:load:end', {
        durationMs: performance.now() - startedAt,
        modelUrl,
        reason,
      });
    }
    catch (error) {
      if (requestId !== this.loadSequence || this.disposed) {
        state.endSceneTransaction();
        return;
      }
      state.setStateValues({ scenePhase: 'error' });
      state.endSceneTransaction();
      this.updateSnapshot({
        animation: 'unavailable',
        error: getErrorMessage(error),
        phase: 'error',
        progress: 0,
        scenePhase: 'error',
      });
      emitAiriVrmTrace('model:load:error', {
        error: getErrorMessage(error),
        modelUrl,
        reason,
      });
    }
  }

  private commitInstance(
    instance: ManagedVrmInstance,
    options: {
      animation?: VrmStageSnapshot['animation'];
      cacheHit: boolean;
      reason: VrmLifecycleReason;
    },
  ) {
    const { animation = 'playing', cacheHit, reason } = options;
    this.active = instance;
    this.scene.add(instance.group);
    instance.group.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(instance.group);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    center.y += size.y / 5;
    const state = useAiriVrmStageStore.getState();

    if (reason === 'initial-load' || reason === 'model-switch') {
      this.frameModel(size, center);
    }
    else {
      this.restoreCameraFromStore();
    }
    this.grid.position.y = bounds.min.y;
    state.setStateValues({
      lastCommittedModelUrl: instance.modelUrl,
      modelOrigin: { x: center.x, y: center.y, z: center.z },
      modelSize: { x: size.x, y: size.y, z: size.z },
      scenePhase: 'mounted',
    });
    state.endSceneTransaction();
    this.applySettings();
    void this.renderer.compileAsync(this.scene, this.camera).then(() => {
      if (!this.disposed && this.active === instance) {
        this.applySettings();
      }
    });
    this.updateSnapshot({
      animation,
      cacheHit,
      error: undefined,
      modelSize: { x: size.x, y: size.y, z: size.z },
      phase: 'ready',
      progress: 100,
      scenePhase: 'mounted',
    });
  }

  private frameModel(size: Vector3, center: Vector3) {
    const halfHeight = Math.max(size.y * 0.55, size.x * 0.8, 0.5);
    const distance
      = halfHeight / Math.tan(MathUtils.degToRad(this.camera.fov / 2));
    this.camera.position.set(
      center.x + size.x * 0.08,
      center.y + size.y * 0.03,
      center.z + distance * 1.15,
    );
    this.camera.near = Math.max(distance / 100, 0.01);
    this.camera.far = Math.max(distance * 100, 100);
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(center);
    this.controls.update();
    this.persistCamera();
  }

  private restoreCameraFromStore() {
    const state = useAiriVrmStageStore.getState();
    this.camera.position.set(
      state.cameraPosition.x,
      state.cameraPosition.y,
      state.cameraPosition.z,
    );
    this.controls.target.set(
      state.lookAtTarget.x,
      state.lookAtTarget.y,
      state.lookAtTarget.z,
    );
    this.controls.update();
  }

  resetCamera() {
    if (!this.active) {
      return;
    }
    const bounds = new Box3().setFromObject(this.active.group);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    center.y += size.y / 5;
    this.frameModel(size, center);
  }

  setExpression(expression: VrmExpression, intensity = 1) {
    this.active?.emote.setExpression(expression, intensity);
  }

  async attachAudioElement(element: HTMLAudioElement) {
    await this.lipSync.attachAudioElement(element);
  }

  readRenderTargetRegion(
    clientX: number,
    clientY: number,
    radius = 2,
  ): RenderTargetRegionRead | null {
    return this.renderTargetReader.read(clientX, clientY, radius);
  }

  isTransparentAtPoint(clientX: number, clientY: number, radius = 2) {
    return this.renderTargetReader.isTransparent(
      { clientX, clientY },
      radius,
    );
  }

  captureFrame() {
    this.renderer.render(this.scene, this.camera);
    return new Promise<Blob | null>((resolve) => {
      this.renderer.domElement.toBlob(resolve);
    });
  }

  clearCache() {
    clearManagedVrmInstance(this.options.scopeKey);
  }

  private applySettings() {
    const state = useAiriVrmStageStore.getState();
    this.camera.fov = state.cameraFov;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(state.renderScale);
    this.resize();
    this.ambientLight.color.set(state.ambientLightColor);
    this.ambientLight.intensity = state.ambientLightIntensity;
    this.fillLight.color.set(state.hemisphereSkyColor);
    this.fillLight.groundColor.set(state.hemisphereGroundColor);
    this.fillLight.intensity
      = state.environmentMode === 'hemisphere'
        ? state.hemisphereLightIntensity
        : 0;
    this.directionalLight.color.set(state.directionalLightColor);
    this.directionalLight.intensity = state.directionalLightIntensity;
    this.directionalLight.position.set(
      state.directionalLightPosition.x,
      state.directionalLightPosition.y,
      state.directionalLightPosition.z,
    );
    this.active?.group.position.set(
      state.modelOffset.x,
      state.modelOffset.y,
      state.modelOffset.z,
    );
    if (this.active) {
      this.active.group.rotation.y = MathUtils.degToRad(state.modelRotationY);
    }
    this.grid.visible = this.options.showGrid ?? true;
    void this.syncEnvironment();
  }

  private async syncEnvironment() {
    const state = useAiriVrmStageStore.getState();
    if (state.environmentMode !== 'skyBox') {
      this.environmentSequence += 1;
      this.environment?.dispose();
      this.environment = undefined;
      this.scene.background = new Color('#11151d');
      this.scene.environment = null;
      this.iblProbe.update(false, 0);
      if (this.active) {
        updateVrmIbl(this.active.vrm.scene, {
          intensity: 0,
          skyBoxEnabled: false,
        });
      }
      return;
    }
    if (this.environment) {
      this.scene.backgroundIntensity = state.skyBoxIntensity;
      this.iblProbe.update(
        true,
        state.skyBoxIntensity,
        this.environment.sh,
      );
      if (this.active) {
        updateVrmIbl(this.active.vrm.scene, {
          intensity: state.skyBoxIntensity,
          sh: this.environment.sh,
          skyBoxEnabled: true,
        });
      }
      return;
    }
    if (this.environmentLoading) {
      return;
    }
    this.environmentLoading = true;
    const sequence = ++this.environmentSequence;
    try {
      const environment = await loadAiriEnvironment(
        {
          backgroundIntensity: state.skyBoxIntensity,
          renderer: this.renderer,
          scene: this.scene,
          url: this.options.hdrUrl,
        },
      );
      if (sequence !== this.environmentSequence || this.disposed) {
        environment.dispose();
        return;
      }
      this.environment = environment;
      this.iblProbe.update(true, state.skyBoxIntensity, environment.sh);
      if (this.active) {
        updateVrmIbl(this.active.vrm.scene, {
          intensity: state.skyBoxIntensity,
          sh: environment.sh,
          skyBoxEnabled: true,
        });
      }
    }
    catch (error) {
      emitAiriVrmTrace('environment:error', {
        error: getErrorMessage(error),
      });
    }
    finally {
      this.environmentLoading = false;
      if (
        !this.disposed
        && !this.environment
        && useAiriVrmStageStore.getState().environmentMode === 'skyBox'
      ) {
        void this.syncEnvironment();
      }
    }
  }

  private bindEvents() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointercancel', this.handlePointerCancel);
    this.controls.addEventListener('change', this.persistCamera);
  }

  private handlePointerMove = (event: PointerEvent) => {
    const state = useAiriVrmStageStore.getState();
    if (state.trackingMode === 'mouse') {
      this.eyeMotion.setMouseTarget(
        {
          camera: this.camera,
          canvas: this.renderer.domElement,
          clientX: event.clientX,
          clientY: event.clientY,
        },
      );
    }
  };

  private handlePointerDown = (event: PointerEvent) => {
    if (!event.isPrimary || event.button !== 0) {
      return;
    }
    this.pointerStart = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  };

  private handlePointerCancel = (event: PointerEvent) => {
    if (this.pointerStart?.id === event.pointerId) {
      this.pointerStart = undefined;
    }
  };

  private handlePointerUp = (event: PointerEvent) => {
    const start = this.pointerStart;
    this.pointerStart = undefined;
    if (
      !start
      || start.id !== event.pointerId
      || !event.isPrimary
      || !isClickLikePointerGesture(start, {
        x: event.clientX,
        y: event.clientY,
      })
      || !this.active
      || isAiriVrmSceneMutationLocked()
    ) {
      return;
    }

    const canvas = this.renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersections = this.raycaster.intersectObjects([
      ...this.active.colliders.colliders,
    ]);
    const target = getVrmInteractionTarget(
      intersections[0]?.object.name ?? '',
    );
    if (target) {
      this.options.onInteract?.(target);
      this.updateSnapshot({ interaction: target });
      emitAiriVrmTrace('interaction:vrm', { target });
    }
  };

  private persistCamera = () => {
    const target = this.controls.target;
    useAiriVrmStageStore.getState().setStateValues({
      cameraDistance: this.camera.position.distanceTo(target),
      cameraPosition: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z,
      },
      lookAtTarget: { x: target.x, y: target.y, z: target.z },
    });
  };

  private updateEyeTracking(delta: number) {
    const state = useAiriVrmStageStore.getState();
    const mode: TrackingMode = state.trackingMode;
    if (mode === 'camera') {
      this.eyeMotion.setCameraTarget({
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z,
      });
    }
    else if (mode === 'none') {
      this.eyeMotion.setIdle(state.lookAtTarget);
    }
    this.eyeMotion.update(this.active?.vrm, delta, state.lookAtTarget);
  }

  private updateVrm(delta: number) {
    if (!this.active) {
      return 0;
    }
    return measure(() => {
      this.active?.mixer.update(delta);
      this.active?.vrm.materials?.forEach((material) => {
        (material as UpdatableMaterial).update?.(delta);
      });
      this.active?.vrm.humanoid.update();
      this.updateEyeTracking(delta);
      this.active?.vrm.humanoid.update();
      this.blink.update(this.active?.vrm, delta);
      this.active?.emote.update(delta);
      this.lipSync.update(this.active?.vrm, delta);
      this.active?.vrm.expressionManager?.update();
      this.active?.vrm.nodeConstraintManager?.update();
      this.active?.vrm.springBoneManager?.update(delta);
    });
  }

  private blink = createBlinkController();

  private render = () => {
    if (this.disposed) {
      return;
    }
    this.animationFrame = window.requestAnimationFrame(this.render);
    const frameStartedAt = performance.now();
    const delta = Math.min(this.clock.getDelta(), 0.05);
    if (!this.options.paused) {
      this.lastUpdateMs = this.updateVrm(delta);
    }
    this.controls.enabled = !isAiriVrmSceneMutationLocked();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    const frameMs = performance.now() - frameStartedAt;
    this.frameCount += 1;
    this.frameDurationSum += frameMs;
    const now = performance.now();
    if (now - this.lastMetricsAt >= 500) {
      const elapsedSeconds = (now - this.lastMetricsAt) / 1000;
      const performanceSnapshot = createPerformanceSnapshot(this.renderer, {
        fps: Math.round(this.frameCount / elapsedSeconds),
        frameMs: this.frameDurationSum / this.frameCount,
        hitTestMs: this.renderTargetReader.getLastDurationMs(),
        updateMs: this.lastUpdateMs,
      });
      this.updateSnapshot({ performance: performanceSnapshot });
      emitAiriVrmTrace('render:info', performanceSnapshot);
      this.frameCount = 0;
      this.frameDurationSum = 0;
      this.lastMetricsAt = now;
    }
  };

  private resize() {
    const width = Math.max(1, this.options.host.clientWidth);
    const height = Math.max(1, this.options.host.clientHeight);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  private updateSnapshot(patch: Partial<VrmStageSnapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    this.options.onSnapshotChange?.(this.snapshot);
  }

  async dispose() {
    this.disposed = true;
    this.loadSequence += 1;
    window.cancelAnimationFrame(this.animationFrame);
    this.resizeObserver.disconnect();
    this.storeUnsubscribe?.();
    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointermove', this.handlePointerMove);
    canvas.removeEventListener('pointerdown', this.handlePointerDown);
    canvas.removeEventListener('pointerup', this.handlePointerUp);
    canvas.removeEventListener('pointercancel', this.handlePointerCancel);
    this.controls.removeEventListener('change', this.persistCamera);
    this.controls.dispose();
    this.renderTargetReader.dispose();
    this.environment?.dispose();
    this.iblProbe.dispose();
    await this.lipSync.dispose();
    if (this.active) {
      this.active.group.removeFromParent();
      stashManagedVrmInstance(this.active);
      this.active = undefined;
    }
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    canvas.remove();
    const state = useAiriVrmStageStore.getState();
    state.setStateValues({
      scenePhase: 'pending',
      sceneTransactionDepth: 0,
    });
    emitAiriVrmTrace('runtime:dispose', {
      scopeKey: this.options.scopeKey,
    });
  }
}
