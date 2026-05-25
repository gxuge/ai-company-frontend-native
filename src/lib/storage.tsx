import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();
const isServer = typeof window === 'undefined';

export function getItem<T>(key: string): T | null {
  if (isServer) {
    return null;
  }
  const value = storage.getString(key);
  return value ? JSON.parse(value) || null : null;
}

export async function setItem<T>(key: string, value: T) {
  if (isServer) {
    return;
  }
  storage.set(key, JSON.stringify(value));
}

export async function removeItem(key: string) {
  if (isServer) {
    return;
  }
  storage.remove(key);
}
