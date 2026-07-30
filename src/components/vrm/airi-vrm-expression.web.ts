import type { VRM } from '@pixiv/three-vrm';

import type {
  VrmEmoteController,
  VrmExpression,
} from './airi-vrm-types.web';

type EmotionState = {
  blendDuration: number;
  expressions: Array<{ name: string; value: number }>;
};

const EMOTION_STATES: Record<VrmExpression, EmotionState> = {
  angry: {
    blendDuration: 0.3,
    expressions: [
      { name: 'angry', value: 0.7 },
      { name: 'ee', value: 0.3 },
    ],
  },
  happy: {
    blendDuration: 0.4,
    expressions: [
      { name: 'happy', value: 0.7 },
      { name: 'aa', value: 0.2 },
    ],
  },
  neutral: {
    blendDuration: 0.6,
    expressions: [{ name: 'neutral', value: 1 }],
  },
  relaxed: {
    blendDuration: 0.4,
    expressions: [{ name: 'relaxed', value: 0.7 }],
  },
  sad: {
    blendDuration: 0.4,
    expressions: [
      { name: 'sad', value: 0.7 },
      { name: 'oh', value: 0.15 },
    ],
  },
  surprised: {
    blendDuration: 0.15,
    expressions: [
      { name: 'surprised', value: 0.8 },
      { name: 'oh', value: 0.4 },
    ],
  },
  think: {
    blendDuration: 0.5,
    expressions: [{ name: 'think', value: 0.7 }],
  },
};

export function createVrmEmoteController(vrm: VRM): VrmEmoteController {
  let currentExpression: VrmExpression | undefined;
  let progress = 0;
  let transitioning = false;
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  const currentValues = new Map<string, number>();
  const targetValues = new Map<string, number>();

  const setExpression: VrmEmoteController['setExpression'] = (
    expression,
    intensity = 1,
    resetAfterMs = 3000,
  ) => {
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = undefined;
    }

    currentExpression = expression;
    progress = 0;
    transitioning = true;
    currentValues.clear();
    targetValues.clear();

    const manager = vrm.expressionManager;
    const expressionNames = Object.keys(manager?.expressionMap ?? {});
    expressionNames.forEach((name) => {
      currentValues.set(name, manager?.getValue(name) ?? 0);
      targetValues.set(name, 0);
    });

    const normalizedIntensity = Math.min(1, Math.max(0, intensity));
    EMOTION_STATES[expression].expressions.forEach(({ name, value }) => {
      const actualName
        = expressionNames.find(
          candidate => candidate.toLowerCase() === name.toLowerCase(),
        ) ?? name;
      targetValues.set(actualName, value * normalizedIntensity);
    });

    if (expression !== 'neutral' && resetAfterMs > 0) {
      resetTimer = setTimeout(
        () => setExpression('neutral', 1, 0),
        resetAfterMs,
      );
    }
  };

  return {
    dispose() {
      if (resetTimer) {
        clearTimeout(resetTimer);
      }
    },
    setExpression,
    update(delta) {
      if (!transitioning || !currentExpression) {
        return;
      }
      const duration = EMOTION_STATES[currentExpression].blendDuration;
      progress = Math.min(progress + delta / duration, 1);
      const eased
        = progress < 0.5
          ? 4 * progress ** 3
          : 1 - (-2 * progress + 2) ** 3 / 2;

      targetValues.forEach((target, name) => {
        const start = currentValues.get(name) ?? 0;
        vrm.expressionManager?.setValue(
          name,
          start + (target - start) * eased,
        );
      });
      transitioning = progress < 1;
    },
  };
}

export function createBlinkController() {
  const duration = 0.2;
  let blinking = false;
  let elapsed = 0;
  let progress = 0;
  let nextBlink = 1 + Math.random() * 5;

  return {
    update(vrm: VRM | undefined, delta: number) {
      if (!vrm?.expressionManager) {
        return;
      }
      elapsed += delta;
      if (!blinking && elapsed >= nextBlink) {
        blinking = true;
        progress = 0;
      }
      if (!blinking) {
        return;
      }

      progress += delta / duration;
      vrm.expressionManager.setValue(
        'blink',
        Math.sin(Math.PI * Math.min(progress, 1)),
      );
      if (progress >= 1) {
        blinking = false;
        elapsed = 0;
        nextBlink = 1 + Math.random() * 5;
        vrm.expressionManager.setValue('blink', 0);
      }
    },
  };
}
