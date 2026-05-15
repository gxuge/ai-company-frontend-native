import AsyncStorage from '@react-native-async-storage/async-storage';

const cache = new Map<string, string | null>();

function parseJSON<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as T;
  }
  catch {
    return null;
  }
}

function serialize(value: unknown) {
  return JSON.stringify(value);
}

export function getItem<T>(key: string): T | null {
  return parseJSON<T>(cache.get(key) ?? null);
}

export async function getItemAsync<T>(key: string): Promise<T | null> {
  if (cache.has(key)) {
    return parseJSON<T>(cache.get(key) ?? null);
  }
  const value = await AsyncStorage.getItem(key);
  cache.set(key, value);
  return parseJSON<T>(value);
}

export async function setItem<T>(key: string, value: T) {
  const serialized = serialize(value);
  cache.set(key, serialized);
  await AsyncStorage.setItem(key, serialized);
}

export async function removeItem(key: string) {
  cache.delete(key);
  await AsyncStorage.removeItem(key);
}

export function getString(key: string): string | null {
  return cache.get(key) ?? null;
}

export async function getStringAsync(key: string): Promise<string | null> {
  if (cache.has(key)) {
    return cache.get(key) ?? null;
  }
  const value = await AsyncStorage.getItem(key);
  cache.set(key, value);
  return value;
}

export async function setString(key: string, value: string) {
  cache.set(key, value);
  await AsyncStorage.setItem(key, value);
}
