import type TranslateOptions from 'i18next';
import type { Language, resources } from './resources';
import type { RecursiveKeyOf } from './types';
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import memoize from 'lodash.memoize';
import { useCallback, useEffect, useState } from 'react';
import { I18nManager, NativeModules, Platform } from 'react-native';

import RNRestart from 'react-native-restart';
import { storage } from '../storage';
import { DEFAULT_LANGUAGE, isLanguage } from './resources';

type DefaultLocale = (typeof resources)['zh-CN']['translation'];
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;

export const LOCAL = 'local';

const LEGACY_LANGUAGES: Record<string, Language> = {
  en: 'en-US',
  zh: 'zh-CN',
};

function normalizeLanguage(value: string | undefined): Language | undefined {
  if (!value) {
    return undefined;
  }
  if (isLanguage(value)) {
    return value;
  }
  const normalized = value.trim();
  if (LEGACY_LANGUAGES[normalized]) {
    return LEGACY_LANGUAGES[normalized];
  }
  const lowerValue = normalized.toLowerCase();
  if (lowerValue.includes('hant')
    || lowerValue.includes('zh-tw')
    || lowerValue.includes('zh-hk')
    || lowerValue.includes('zh-mo')) {
    return 'zh-TW';
  }
  if (lowerValue.startsWith('zh')) {
    return 'zh-CN';
  }
  if (lowerValue.startsWith('ja')) {
    return 'ja';
  }
  if (lowerValue.startsWith('en')) {
    return 'en-US';
  }
  return undefined;
}

export function getLanguage(): Language {
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }
  const storedLanguage = normalizeLanguage(storage.getString(LOCAL));
  if (storedLanguage) {
    return storedLanguage;
  }
  const systemLanguage = normalizeLanguage(getLocales()[0]?.languageTag);
  return systemLanguage || DEFAULT_LANGUAGE;
}

export const translate = memoize(
  (key: TxKeyPath, options = undefined) =>
    i18n.t(key, options) as unknown as string,
  (key: TxKeyPath, options: typeof TranslateOptions) =>
    options ? key + JSON.stringify(options) : key,
);

export function changeLanguage(lang: Language) {
  translate.cache.clear?.();
  void i18n.changeLanguage(lang);
  I18nManager.forceRTL(false);
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    if (__DEV__)
      NativeModules.DevSettings.reload();
    else RNRestart.restart();
  }
  else if (Platform.OS === 'web') {
    window.location.reload();
  }
}

export function useSelectedLanguage() {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    const syncLanguage = () => setLanguageState(getLanguage());
    syncLanguage();
    const listener = storage.addOnValueChangedListener((changedKey) => {
      if (changedKey === LOCAL) {
        syncLanguage();
      }
    });
    return () => listener.remove();
  }, []);

  const setLanguage = useCallback(
    (lang: Language) => {
      storage.set(LOCAL, lang);
      setLanguageState(lang);
      changeLanguage(lang);
    },
    [],
  );

  return {
    language,
    setLanguage,
  };
}
