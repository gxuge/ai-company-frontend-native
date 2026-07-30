import type { WebGLRenderer } from 'three';

import type {
  AiriVrmTraceEvent,
  VrmStagePerformance,
} from './airi-vrm-types.web';

const TRACE_LIMIT = 240;
const traceEvents: AiriVrmTraceEvent[] = [];
const listeners = new Set<(event: AiriVrmTraceEvent) => void>();

export function emitAiriVrmTrace(
  type: string,
  payload: Record<string, unknown> = {},
) {
  const event: AiriVrmTraceEvent = {
    payload,
    ts: performance.now(),
    type,
  };
  traceEvents.push(event);
  if (traceEvents.length > TRACE_LIMIT) {
    traceEvents.splice(0, traceEvents.length - TRACE_LIMIT);
  }
  listeners.forEach(listener => listener(event));
}

export function getAiriVrmTraceEvents() {
  return [...traceEvents];
}

export function subscribeAiriVrmTrace(
  listener: (event: AiriVrmTraceEvent) => void,
) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getJsHeapUsedBytes() {
  const memory = (
    performance as Performance & {
      memory?: { usedJSHeapSize?: number };
    }
  ).memory;
  return memory?.usedJSHeapSize;
}

export function createPerformanceSnapshot(
  renderer: WebGLRenderer,
  values: {
    fps: number;
    frameMs: number;
    hitTestMs: number;
    updateMs: number;
  },
): VrmStagePerformance {
  return {
    drawCalls: renderer.info.render.calls,
    fps: values.fps,
    frameMs: values.frameMs,
    geometries: renderer.info.memory.geometries,
    hitTestMs: values.hitTestMs,
    jsHeapUsedBytes: getJsHeapUsedBytes(),
    programs: renderer.info.programs?.length ?? 0,
    textures: renderer.info.memory.textures,
    triangles: renderer.info.render.triangles,
    updateMs: values.updateMs,
  };
}
