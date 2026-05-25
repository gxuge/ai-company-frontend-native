/* eslint-disable react-refresh/only-export-components */
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

export const queryClient = new QueryClient();

function ReactQueryDevToolsBridge() {
  useReactQueryDevTools(queryClient);
  return null;
}

export function APIProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      {children}
      {mounted && __DEV__ ? <ReactQueryDevToolsBridge /> : null}
    </QueryClientProvider>
  );
}
