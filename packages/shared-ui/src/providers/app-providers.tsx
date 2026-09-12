import type { ReactNode } from 'react';
import { lazy, Suspense } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { QueryClientProvider } from '@tanstack/react-query';
import { PrimeReactProvider } from '@primereact/core';
import { queryClient } from '@gamification/shared-utils/api/query-client';
import { primeReactConfig } from '../app.config';
import { environment } from '@gamification/shared-utils/environments/environment';
import { AppErrorFallback } from '@gamification/shared-ui/components/app-error-fallback';
import { NavigationProgressBar } from '@gamification/shared-ui/components/navigation-progress';
import {
  classifyAppError,
  isChunkLoadError,
} from '@gamification/shared-utils/utils/chunk-load';
import { AppToaster } from './app-toaster';

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({
    default: m.ReactQueryDevtools,
  })),
);

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const kind = classifyAppError(error);

  return (
    <AppErrorFallback
      kind={kind}
      variant="fullscreen"
      onRetry={() => {
        if (isChunkLoadError(error) || kind === 'network') {
          window.location.reload();
          return;
        }
        resetErrorBoundary();
      }}
    />
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <PrimeReactProvider {...primeReactConfig}>
          <NavigationProgressBar />
          <AppToaster />
          {children}
        </PrimeReactProvider>
        {!environment.production && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
