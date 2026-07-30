import type {
  Scene,
  SphericalHarmonics3,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';

import {
  ACESFilmicToneMapping,
  EquirectangularReflectionMapping,
  LinearFilter,
  LinearMipmapLinearFilter,
  LinearSRGBColorSpace,
  PMREMGenerator,
  SRGBColorSpace,
  WebGLCubeRenderTarget,
} from 'three';
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { emitAiriVrmTrace } from './airi-vrm-trace.web';

export type AiriEnvironmentController = {
  dispose: () => void;
  sh: SphericalHarmonics3 | null;
};

export async function loadAiriEnvironment(
  options: {
    backgroundIntensity?: number;
    renderer: WebGLRenderer;
    scene: Scene;
    url: string;
  },
): Promise<AiriEnvironmentController> {
  const {
    backgroundIntensity = 1,
    renderer,
    scene,
    url,
  } = options;
  const startedAt = performance.now();
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;

  const hdrTexture = await new RGBELoader().loadAsync(url);
  hdrTexture.mapping = EquirectangularReflectionMapping;
  hdrTexture.generateMipmaps = true;
  hdrTexture.minFilter = LinearMipmapLinearFilter;
  hdrTexture.magFilter = LinearFilter;
  hdrTexture.colorSpace = LinearSRGBColorSpace;

  const pmrem = new PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromEquirectangular(hdrTexture);
  const cubeTarget = new WebGLCubeRenderTarget(256);
  cubeTarget.fromEquirectangularTexture(renderer, hdrTexture);
  const probe = await LightProbeGenerator.fromCubeRenderTarget(
    renderer,
    cubeTarget,
  );

  scene.environment = environmentTarget.texture;
  scene.background = environmentTarget.texture;
  scene.backgroundBlurriness = 0;
  scene.backgroundIntensity = backgroundIntensity;

  emitAiriVrmTrace('environment:loaded', {
    durationMs: performance.now() - startedAt,
    url,
  });

  return {
    dispose() {
      if (scene.environment === environmentTarget.texture) {
        scene.environment = null;
      }
      if (scene.background === environmentTarget.texture) {
        scene.background = null;
      }
      cubeTarget.dispose();
      environmentTarget.dispose();
      pmrem.dispose();
      hdrTexture.dispose();
    },
    sh: probe.sh,
  };
}

export function clearAiriEnvironment(
  scene: Scene,
  target?: WebGLRenderTarget,
) {
  scene.environment = null;
  scene.background = null;
  target?.dispose();
}
