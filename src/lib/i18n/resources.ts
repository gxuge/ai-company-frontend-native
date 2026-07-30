import enUS from '@/locales/en-US';
import ja from '@/locales/ja';
import zhCN from '@/locales/zh-CN';
import zhTW from '@/locales/zh-TW';

export const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  'en-US': {
    translation: enUS,
  },
  'zh-TW': {
    translation: zhTW,
  },
  'ja': {
    translation: ja,
  },
} as const;

export type Language = keyof typeof resources;

export const DEFAULT_LANGUAGE: Language = 'zh-CN';
export const SUPPORTED_LANGUAGES = Object.keys(resources) as Language[];

export function isLanguage(value: string | undefined): value is Language {
  return Boolean(value && SUPPORTED_LANGUAGES.includes(value as Language));
}
