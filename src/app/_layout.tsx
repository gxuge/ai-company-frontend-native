import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useThemeConfig } from '@/components/ui/use-theme-config';
import { hydrateAuth } from '@/features/auth/use-auth-store';

import { APIProvider } from '@/lib/api';
import { loadSelectedTheme } from '@/lib/hooks/use-selected-theme';
// Import  global CSS file
import '../global.css';

export { ErrorBoundary } from 'expo-router';

// eslint-disable-next-line react-refresh/only-export-components
export const unstable_settings = {
  initialRouteName: 'index',
};

// 过滤 RN Web 迁移期的已知噪音警告（仅隐藏指定文案，不影响其他 warn）
// 1) props.pointerEvents is deprecated. Use style.pointerEvents
// 2) "shadow*" style props are deprecated. Use "boxShadow".
if (!(globalThis as any).__POINTER_EVENTS_WARN_FILTER_INSTALLED__) {
  const originalConsoleWarn = console.warn.bind(console);
  console.warn = (...args: any[]) => {
    const firstArg = args[0];
    if (
      typeof firstArg === 'string'
      && (
        firstArg.includes('props.pointerEvents is deprecated. Use style.pointerEvents')
        || firstArg.includes('"shadow*" style props are deprecated. Use "boxShadow".')
      )
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };
  (globalThis as any).__POINTER_EVENTS_WARN_FILTER_INSTALLED__ = true;
}

// 仅在 SSR 端过滤已知上下文并发渲染告警，避免终端反复刷屏
if (typeof window === 'undefined' && !(globalThis as any).__SSR_ERROR_FILTER_INSTALLED__) {
  const originalConsoleError = console.error.bind(console);
  console.error = (...args: any[]) => {
    const firstArg = args[0];
    if (
      typeof firstArg === 'string'
      && firstArg.includes('Detected multiple renderers concurrently rendering the same context provider')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
  (globalThis as any).__SSR_ERROR_FILTER_INSTALLED__ = true;
}

export default function RootLayout() {
  React.useEffect(() => {
    // 客户端挂载后再执行：避免 SSR 首屏与客户端首帧不一致
    hydrateAuth();
    loadSelectedTheme();
    SplashScreen.preventAutoHideAsync();
    SplashScreen.setOptions({
      duration: 500,
      fade: true,
    });
  }, []);

  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }} />
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  const [mounted, setMounted] = React.useState(false);
  // 首帧先使用稳定默认主题，挂载后切换为真实主题，降低 hydration mismatch 风险
  const effectiveTheme = mounted ? theme : DefaultTheme;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <GestureHandlerRootView
      style={styles.container}
      // eslint-disable-next-line better-tailwindcss/no-unknown-classes
      className={mounted && theme.dark ? `dark` : undefined}
    >
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider value={effectiveTheme}>
            <APIProvider>
              <BottomSheetModalProvider>
                {children}
                <FlashMessage position="top" />
              </BottomSheetModalProvider>
            </APIProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
