import type { VRM } from '@pixiv/three-vrm';
import type { Profile } from 'wlipsync';

import { Asset } from 'expo-asset';

import profile from '../../assets/vrm/lip-sync-profile.json';

const WLIPSYNC_WASM_ASSET = Asset.fromModule(
  require('../../assets/vrm/wlipsync.wasm'),
);

const WLIPSYNC_WASM_URL
  = WLIPSYNC_WASM_ASSET.localUri ?? WLIPSYNC_WASM_ASSET.uri;

type LipKey = 'A' | 'E' | 'I' | 'O' | 'U';
type WlipsyncNode = AudioNode & {
  volume?: number;
  weights: Record<string, number | undefined>;
};

const LIP_KEYS: LipKey[] = ['A', 'E', 'I', 'O', 'U'];
const BLENDSHAPE_MAP: Record<LipKey, string> = {
  A: 'aa',
  E: 'ee',
  I: 'ih',
  O: 'oh',
  U: 'ou',
};

// The WebAudio graph and smoothing state intentionally share one lifecycle owner.
// eslint-disable-next-line max-lines-per-function
export function createVrmLipSyncController() {
  const smoothState: Record<LipKey, number> = {
    A: 0,
    E: 0,
    I: 0,
    O: 0,
    U: 0,
  };
  let audioContext: AudioContext | undefined;
  let lipSyncNode: WlipsyncNode | undefined;
  let sourceNode: MediaElementAudioSourceNode | undefined;
  let activeElement: HTMLAudioElement | undefined;
  let lastActiveAt = 0;

  async function attachAudioElement(element: HTMLAudioElement) {
    if (activeElement === element && sourceNode && lipSyncNode) {
      await audioContext?.resume();
      return;
    }
    sourceNode?.disconnect();
    lipSyncNode?.disconnect();
    audioContext ??= new AudioContext();
    await audioContext.resume();
    const {
      configuration,
      createWLipSyncNode,
    } = await import('wlipsync/wlipsync.js');
    if (!configuration.wasmModule) {
      const response = await fetch(WLIPSYNC_WASM_URL);
      if (!response.ok) {
        throw new Error(`Failed to load wLipSync WASM: ${response.status}`);
      }
      configuration.wasmModule = await WebAssembly.compile(
        await response.arrayBuffer(),
      );
    }
    lipSyncNode = (await createWLipSyncNode(
      audioContext,
      profile as Profile,
    )) as WlipsyncNode;
    sourceNode = audioContext.createMediaElementSource(element);
    sourceNode.connect(audioContext.destination);
    sourceNode.connect(lipSyncNode);
    activeElement = element;
  }

  return {
    attachAudioElement,
    async dispose() {
      sourceNode?.disconnect();
      lipSyncNode?.disconnect();
      sourceNode = undefined;
      lipSyncNode = undefined;
      activeElement = undefined;
      if (audioContext) {
        await audioContext.close();
        audioContext = undefined;
      }
    },
    update(vrm: VRM | undefined, delta = 0.016) {
      if (!vrm?.expressionManager || !lipSyncNode) {
        return;
      }

      const volume = lipSyncNode.volume ?? 0;
      const amplitude = Math.min(volume * 0.9, 1) ** 0.7;
      const projected: Record<LipKey, number> = {
        A: 0,
        E: 0,
        I: 0,
        O: 0,
        U: 0,
      };
      const rawToLip: Record<string, LipKey> = {
        A: 'A',
        E: 'E',
        I: 'I',
        O: 'O',
        S: 'I',
        U: 'U',
      };
      Object.entries(rawToLip).forEach(([raw, lip]) => {
        projected[lip] = Math.max(
          projected[lip],
          (lipSyncNode?.weights[raw] ?? 0) * amplitude,
        );
      });

      const ranked = [...LIP_KEYS].sort(
        (left, right) => projected[right] - projected[left],
      );
      const winner = ranked[0];
      const runner = ranked[1];
      const winnerValue = projected[winner];
      const silent
        = amplitude < 0.04
          || winnerValue < 0.05
          || performance.now() - lastActiveAt > 160;
      if (amplitude >= 0.04 && winnerValue >= 0.05) {
        lastActiveAt = performance.now();
      }

      const target: Record<LipKey, number> = {
        A: 0,
        E: 0,
        I: 0,
        O: 0,
        U: 0,
      };
      if (!silent) {
        target[winner] = Math.min(0.7, winnerValue);
        target[runner] = Math.min(0.35, projected[runner] * 0.6);
      }

      LIP_KEYS.forEach((key) => {
        const from = smoothState[key];
        const to = target[key];
        const rate = 1 - Math.exp(-(to > from ? 50 : 30) * delta);
        smoothState[key] = from + (to - from) * rate;
        const weight
          = (smoothState[key] <= 0.01 ? 0 : smoothState[key]) * 0.7;
        vrm.expressionManager?.setValue(BLENDSHAPE_MAP[key], weight);
      });
    },
  };
}
