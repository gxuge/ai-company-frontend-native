import * as React from 'react';

import { getItemAsync, setItem } from '../storage';

const IS_FIRST_TIME = 'IS_FIRST_TIME';

export function useIsFirstTime() {
  const [isFirstTime, setIsFirstTime] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    let mounted = true;
    void getItemAsync<boolean>(IS_FIRST_TIME).then((value) => {
      if (!mounted) {
        return;
      }
      setIsFirstTime(value ?? undefined);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setPersistedFirstTime = React.useCallback((value: boolean) => {
    setIsFirstTime(value);
    void setItem<boolean>(IS_FIRST_TIME, value);
  }, []);

  if (isFirstTime === undefined) {
    return [true, setPersistedFirstTime] as const;
  }
  return [isFirstTime, setPersistedFirstTime] as const;
}
