import * as React from 'react';
import { Uniwind, useUniwind } from 'uniwind';

import { getStringAsync, setString } from '../storage';

const SELECTED_THEME = 'SELECTED_THEME';
export type ColorSchemeType = 'light' | 'dark' | 'system';

function toTheme(value: string | null): ColorSchemeType | undefined {
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }
  return undefined;
}

/**
 * this hooks should only be used while selecting the theme
 * This hooks will return the selected theme which is stored in MMKV
 * selectedTheme should be one of the following values 'light', 'dark' or 'system'
 * don't use this hooks if you want to use it to style your component based on the theme use useUniwind from uniwind instead
 *
 */
export function useSelectedTheme() {
  const { theme: _theme } = useUniwind();
  const [theme, setTheme] = React.useState<ColorSchemeType | undefined>(undefined);

  React.useEffect(() => {
    let mounted = true;
    void getStringAsync(SELECTED_THEME).then((value) => {
      if (!mounted) {
        return;
      }
      setTheme(toTheme(value));
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      Uniwind.setTheme(t);
      setTheme(t);
      void setString(SELECTED_THEME, t);
    },
    [],
  );

  const selectedTheme = (theme ?? 'system') as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
}
// to be used in the root file to load the selected theme from MMKV
export async function loadSelectedTheme() {
  const theme = toTheme(await getStringAsync(SELECTED_THEME));
  if (theme !== undefined) {
    console.log('theme', theme);
    Uniwind.setTheme(theme);
  }
}
