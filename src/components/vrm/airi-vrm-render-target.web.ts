import type { Camera, Scene, WebGLRenderer } from 'three';

import type { RenderTargetRegionRead } from './airi-vrm-types.web';

import { Vector2, WebGLRenderTarget } from 'three';

import { emitAiriVrmTrace } from './airi-vrm-trace.web';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// Offscreen allocation and pixel reads intentionally share one lifecycle owner.
// eslint-disable-next-line max-lines-per-function
export function createRenderTargetReader(context: {
  getCamera: () => Camera | undefined;
  getCanvas: () => HTMLCanvasElement | undefined;
  getRenderer: () => WebGLRenderer | undefined;
  getScene: () => Scene | undefined;
}) {
  const size = new Vector2();
  let target: WebGLRenderTarget | undefined;
  let lastDurationMs = 0;

  function ensureTarget(renderer: WebGLRenderer) {
    renderer.getDrawingBufferSize(size);
    const width = Math.max(1, Math.floor(size.x));
    const height = Math.max(1, Math.floor(size.y));
    if (!target || target.width !== width || target.height !== height) {
      target?.dispose();
      target = new WebGLRenderTarget(width, height, { depthBuffer: false });
    }
    return target;
  }

  function read(
    clientX: number,
    clientY: number,
    radius: number,
  ): RenderTargetRegionRead | null {
    const startedAt = performance.now();
    const renderer = context.getRenderer();
    const scene = context.getScene();
    const camera = context.getCamera();
    const canvas = context.getCanvas();
    if (!renderer || !scene || !camera || !canvas) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();
    const xIn = clientX - rect.left;
    const yIn = clientY - rect.top;
    if (
      xIn < 0
      || yIn < 0
      || xIn >= rect.width
      || yIn >= rect.height
    ) {
      return null;
    }

    const renderTarget = ensureTarget(renderer);
    const scaleX = renderTarget.width / rect.width;
    const scaleY = renderTarget.height / rect.height;
    const centerX = Math.floor(xIn * scaleX);
    const centerY = Math.floor(renderTarget.height - 1 - yIn * scaleY);
    const radiusX = Math.ceil(radius * scaleX);
    const radiusY = Math.ceil(radius * scaleY);
    const startX = clamp(centerX - radiusX, 0, renderTarget.width - 1);
    const endX = clamp(centerX + radiusX, 0, renderTarget.width - 1);
    const startY = clamp(centerY - radiusY, 0, renderTarget.height - 1);
    const endY = clamp(centerY + radiusY, 0, renderTarget.height - 1);
    const readWidth = endX - startX + 1;
    const readHeight = endY - startY + 1;
    const data = new Uint8Array(readWidth * readHeight * 4);
    const previousTarget = renderer.getRenderTarget();

    renderer.setRenderTarget(renderTarget);
    renderer.clear();
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(
      renderTarget,
      startX,
      startY,
      readWidth,
      readHeight,
      data,
    );
    renderer.setRenderTarget(previousTarget);

    lastDurationMs = performance.now() - startedAt;
    emitAiriVrmTrace('hit-test:read', {
      durationMs: lastDurationMs,
      radius,
      readHeight,
      readWidth,
    });

    return {
      centerX,
      centerY,
      data,
      readHeight,
      readWidth,
      scaleX,
      scaleY,
      startX,
      startY,
    };
  }

  return {
    dispose() {
      target?.dispose();
      target = undefined;
    },
    getLastDurationMs: () => lastDurationMs,
    isTransparent(
      point: { clientX: number; clientY: number },
      radius = 2,
      threshold = 10,
    ) {
      const result = read(point.clientX, point.clientY, radius);
      if (!result) {
        return true;
      }
      for (let index = 3; index < result.data.length; index += 4) {
        if (result.data[index] >= threshold) {
          return false;
        }
      }
      return true;
    },
    read,
  };
}
