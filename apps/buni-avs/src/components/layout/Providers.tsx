'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BuniGoogleProvider } from "@buni/auth";
import { ToastProvider } from '@buni/ui';
import { ThemeProvider } from '@buni/theme';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <BuniGoogleProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!} >
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}

          {/* ✅ Important: avoid SSR mismatch */}
          {mounted && process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-left"
            />
          )}
        </ToastProvider>
      </QueryClientProvider>
      </BuniGoogleProvider>
    </ThemeProvider>
  );
}