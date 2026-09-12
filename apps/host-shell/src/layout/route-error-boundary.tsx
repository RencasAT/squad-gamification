import { useEffect } from 'react';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router';
import { AppErrorFallback } from '@gamification/shared-ui/components/app-error-fallback';
import {
  classifyAppError,
  hasAttemptedStaleChunkReload,
  markStaleChunkReload,
  type AppErrorKind,
} from '@gamification/shared-utils/utils/chunk-load';

type RouteErrorBoundaryProps = {
  variant?: 'page' | 'fullscreen';
};

function kindFromRouteError(error: unknown): AppErrorKind {
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return 'not-found';
    }
    return 'unknown';
  }
  return classifyAppError(error);
}

function UpdatingNotice({ variant }: { variant: 'page' | 'fullscreen' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Actualizando"
      className={
        variant === 'fullscreen'
          ? 'flex min-h-screen items-center justify-center'
          : 'flex min-h-80 items-center justify-center'
      }
    >
      <p className="font-gobold text-sm tracking-wide text-slate-500 uppercase">
        Actualizando
      </p>
    </div>
  );
}

/** Fallback de ruta: clasifica chunk/red/404 y recarga una vez si el JS es stale. */
export function RouteErrorBoundary({
  variant = 'page',
}: RouteErrorBoundaryProps) {
  const error = useRouteError();
  const navigate = useNavigate();
  const kind = kindFromRouteError(error);
  const shouldReload = kind === 'chunk' && !hasAttemptedStaleChunkReload();

  useEffect(() => {
    if (shouldReload && markStaleChunkReload()) {
      window.location.reload();
    }
  }, [shouldReload]);

  if (shouldReload) {
    return <UpdatingNotice variant={variant} />;
  }

  const goHome = () => {
    void navigate('/dashboard');
  };

  const onRetry = () => {
    if (kind === 'not-found') {
      goHome();
      return;
    }
    window.location.reload();
  };

  return (
    <AppErrorFallback
      kind={kind}
      variant={variant}
      onRetry={onRetry}
      onGoHome={variant === 'page' ? goHome : undefined}
    />
  );
}
