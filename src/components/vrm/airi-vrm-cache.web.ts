import type { ManagedVrmInstance } from './airi-vrm-types.web';

import { VRMUtils } from '@pixiv/three-vrm';

import { emitAiriVrmTrace } from './airi-vrm-trace.web';

const detachedByScope = new Map<string, ManagedVrmInstance>();

export function disposeManagedVrmInstance(instance?: ManagedVrmInstance) {
  if (!instance) {
    return;
  }
  instance.emote.dispose();
  instance.mixer.stopAllAction();
  instance.colliders.dispose();
  instance.group.removeFromParent();
  VRMUtils.deepDispose(instance.vrm.scene);
}

export function takeManagedVrmInstance(scopeKey: string, modelUrl: string) {
  const instance = detachedByScope.get(scopeKey);
  if (!instance || instance.modelUrl !== modelUrl) {
    emitAiriVrmTrace('cache:take', {
      modelUrl,
      result: 'miss',
      scopeKey,
    });
    return undefined;
  }
  detachedByScope.delete(scopeKey);
  emitAiriVrmTrace('cache:take', {
    modelUrl,
    result: 'hit',
    scopeKey,
  });
  return instance;
}

export function stashManagedVrmInstance(instance: ManagedVrmInstance) {
  const previous = detachedByScope.get(instance.scopeKey);
  detachedByScope.set(instance.scopeKey, instance);
  emitAiriVrmTrace('cache:stash', {
    modelUrl: instance.modelUrl,
    result: previous ? 'evicted' : 'stored',
    scopeKey: instance.scopeKey,
  });
  if (previous && previous !== instance) {
    disposeManagedVrmInstance(previous);
  }
}

export function clearManagedVrmInstance(scopeKey: string) {
  const instance = detachedByScope.get(scopeKey);
  detachedByScope.delete(scopeKey);
  emitAiriVrmTrace('cache:clear', {
    result: instance ? 'hit' : 'empty',
    scopeKey,
  });
  disposeManagedVrmInstance(instance);
}
