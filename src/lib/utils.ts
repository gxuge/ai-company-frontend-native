import type { StoreApi, UseBoundStore } from 'zustand';
import { Linking } from 'react-native';
import { twMerge } from 'tailwind-merge';

type ClassDictionary = Record<string, any>;
type ClassArray = ClassValue[];
type ClassValue = string | number | null | boolean | undefined | ClassDictionary | ClassArray;

function toClassName(value: ClassValue): string {
  if (!value) {
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(toClassName).filter(Boolean).join(' ');
  }

  if (typeof value === 'object') {
    return Object.keys(value)
      .filter(key => Boolean((value as ClassDictionary)[key]))
      .join(' ');
  }

  return '';
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(inputs.map(toClassName).filter(Boolean).join(' '));
}

export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then(canOpen => canOpen && Linking.openURL(url));
}

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(_store: S) {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store(s => s[k as keyof typeof s]);
  }

  return store;
}
