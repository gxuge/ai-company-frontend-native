import type { resources } from './resources';

// react-i18next versions higher than 11.11.0

declare module 'react-i18next' {
  type CustomTypeOptions = {
    defaultNS: 'translation';
    resources: (typeof resources)['zh-CN'];
  };
}
