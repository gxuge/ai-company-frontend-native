import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from 'expo-router';
import { useUniwind } from 'uniwind';

import colors from '@/components/ui/colors';

const DarkTheme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: colors.brand[500],
    background: '#0d0d11',
    text: colors.white,
    border: colors.charcoal[600],
    card: colors.charcoal[900],
  },
};

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.brand[500],
    background: colors.white,
    text: colors.black,
    border: colors.neutral[200],
    card: colors.white,
  },
};

export function useThemeConfig() {
  const { theme } = useUniwind();

  if (theme === 'dark')
    return DarkTheme;

  return LightTheme;
}
