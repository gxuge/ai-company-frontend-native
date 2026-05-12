import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import { Platform } from 'react-native';

const TOKEN_KEY = 'token';
const memoryStore = new Map<string, string>();

function isSecureKey(key: string) {
  return key === TOKEN_KEY;
}

async function readRaw(key: string) {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.localStorage.getItem(key);
  }
  if (isSecureKey(key)) {
    return SecureStore.getItemAsync(key);
  }
  return AsyncStorage.getItem(key);
}

async function writeRaw(key: string, value: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
    return;
  }
  if (isSecureKey(key)) {
    await SecureStore.setItemAsync(key, value);
    return;
  }
  await AsyncStorage.setItem(key, value);
}

async function removeRaw(key: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
    return;
  }
  if (isSecureKey(key)) {
    await SecureStore.deleteItemAsync(key);
    return;
  }
  await AsyncStorage.removeItem(key);
}

async function ensureLoaded(key: string) {
  if (memoryStore.has(key)) {
    return;
  }
  const value = await readRaw(key);
  if (value == null) {
    return;
  }
  memoryStore.set(key, value);
}

export const storage = {
  getString(key: string) {
    return memoryStore.get(key);
  },
  set(key: string, value: string) {
    void setString(key, value);
  },
  remove(key: string) {
    void removeItem(key);
  },
};

export function getItem<T>(key: string): T | null {
  const value = memoryStore.get(key);
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

export async function getItemAsync<T>(key: string): Promise<T | null> {
  await ensureLoaded(key);
  return getItem<T>(key);
}

export async function setItem<T>(key: string, value: T) {
  const serialized = JSON.stringify(value);
  memoryStore.set(key, serialized);
  await writeRaw(key, serialized);
}

export async function removeItem(key: string) {
  memoryStore.delete(key);
  await removeRaw(key);
}

export function getString(key: string) {
  return memoryStore.get(key);
}

export async function getStringAsync(key: string) {
  await ensureLoaded(key);
  return memoryStore.get(key);
}

export async function setString(key: string, value: string) {
  memoryStore.set(key, value);
  await writeRaw(key, value);
}

export function useStoredString(key: string) {
  const [value, setValue] = React.useState<string | undefined>(() => getString(key));

  React.useEffect(() => {
    let alive = true;
    void getStringAsync(key).then((next) => {
      if (alive) {
        setValue(next);
      }
    });
    return () => {
      alive = false;
    };
  }, [key]);

  const setStoredValue = React.useCallback((next?: string) => {
    setValue(next);
    if (next == null) {
      void removeItem(key);
      return;
    }
    void setString(key, next);
  }, [key]);

  return [value, setStoredValue] as const;
}

export function useStoredBoolean(key: string) {
  const [rawValue, setRawValue] = useStoredString(key);
  const boolValue = rawValue == null ? undefined : rawValue === '1';
  const setBoolValue = React.useCallback((next?: boolean) => {
    if (next == null) {
      setRawValue(undefined);
      return;
    }
    setRawValue(next ? '1' : '0');
  }, [setRawValue]);

  return [boolValue, setBoolValue] as const;
}
