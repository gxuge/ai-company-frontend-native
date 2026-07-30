import type {
  RenderTargetRegionRead,
  VrmExpression,
  VrmInteractionTarget,
  VrmStageSnapshot,
} from './airi-vrm-types.web';

import * as React from 'react';

import { AiriVrmRuntime } from './airi-vrm-runtime.web';

export type {
  RenderTargetRegionRead,
  VrmExpression,
  VrmInteractionTarget,
  VrmStageSnapshot,
} from './airi-vrm-types.web';

export type VrmStageHandle = {
  attachAudioElement: (element: HTMLAudioElement) => Promise<void>;
  captureFrame: () => Promise<Blob | null>;
  clearCache: () => void;
  isTransparentAtPoint: (
    clientX: number,
    clientY: number,
    radius?: number,
  ) => boolean;
  readRenderTargetRegion: (
    clientX: number,
    clientY: number,
    radius?: number,
  ) => RenderTargetRegionRead | null;
  resetCamera: () => void;
  setExpression: (expression: VrmExpression, intensity?: number) => void;
};

type VrmStageProps = {
  animationUrl?: string;
  hdrUrl: string;
  modelUrl: string;
  onInteract?: (target: VrmInteractionTarget) => void;
  onSnapshotChange?: (snapshot: VrmStageSnapshot) => void;
  paused?: boolean;
  ref?: React.Ref<VrmStageHandle>;
  showGrid?: boolean;
};

export function VrmStage({
  animationUrl,
  hdrUrl,
  modelUrl,
  onInteract,
  onSnapshotChange,
  paused = false,
  ref,
  showGrid = true,
}: VrmStageProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const runtimeRef = React.useRef<AiriVrmRuntime>();
  const onInteractRef = React.useRef(onInteract);
  const onSnapshotChangeRef = React.useRef(onSnapshotChange);

  React.useEffect(() => {
    onInteractRef.current = onInteract;
  }, [onInteract]);

  React.useEffect(() => {
    onSnapshotChangeRef.current = onSnapshotChange;
  }, [onSnapshotChange]);

  React.useImperativeHandle(
    ref,
    () => ({
      attachAudioElement: element =>
        runtimeRef.current?.attachAudioElement(element) ?? Promise.resolve(),
      captureFrame: () =>
        runtimeRef.current?.captureFrame() ?? Promise.resolve(null),
      clearCache: () => runtimeRef.current?.clearCache(),
      isTransparentAtPoint: (clientX, clientY, radius) =>
        runtimeRef.current?.isTransparentAtPoint(
          clientX,
          clientY,
          radius,
        ) ?? true,
      readRenderTargetRegion: (clientX, clientY, radius) =>
        runtimeRef.current?.readRenderTargetRegion(
          clientX,
          clientY,
          radius,
        ) ?? null,
      resetCamera: () => runtimeRef.current?.resetCamera(),
      setExpression: (expression, intensity) =>
        runtimeRef.current?.setExpression(expression, intensity),
    }),
    [],
  );

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }
    const runtime = new AiriVrmRuntime({
      hdrUrl,
      host,
      modelUrl: '',
      onInteract: target => onInteractRef.current?.(target),
      onSnapshotChange: snapshot => onSnapshotChangeRef.current?.(snapshot),
      paused: false,
      scopeKey: window.location.pathname,
      showGrid: true,
    });
    runtimeRef.current = runtime;
    void runtime.start();
    return () => {
      runtimeRef.current = undefined;
      void runtime.dispose();
    };
  }, [hdrUrl]);

  React.useEffect(() => {
    if (runtimeRef.current) {
      void runtimeRef.current.loadModel(modelUrl, animationUrl);
    }
  }, [animationUrl, modelUrl]);

  React.useEffect(() => {
    runtimeRef.current?.setPaused(paused);
  }, [paused]);

  React.useEffect(() => {
    runtimeRef.current?.setShowGrid(showGrid);
  }, [showGrid]);

  return <div ref={hostRef} style={styles.host} />;
}

const styles: Record<string, React.CSSProperties> = {
  host: {
    width: '100%',
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: '#11151d',
  },
};
