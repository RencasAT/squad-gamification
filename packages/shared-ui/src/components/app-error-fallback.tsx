import { AppLogo } from './app-logo';
import { cn } from '@gamification/shared-utils/utils/cn';
import type { AppErrorKind } from '@gamification/shared-utils/utils/chunk-load';

const COPY: Record<
  AppErrorKind,
  { title: string; description: string; retry: string; icon: string }
> = {
  chunk: {
    title: 'Nueva versión disponible',
    description:
      'El backoffice se actualizó. Recargá la página para continuar.',
    retry: 'Recargar',
    icon: 'pi-refresh',
  },
  network: {
    title: 'Sin conexión',
    description:
      'No pudimos cargar este módulo. Revisá tu red e intentá de nuevo.',
    retry: 'Reintentar',
    icon: 'pi-wifi',
  },
  'not-found': {
    title: 'Página no encontrada',
    description: 'Esta ruta no existe o ya no está disponible.',
    retry: 'Ir al inicio',
    icon: 'pi-search',
  },
  unknown: {
    title: 'Algo salió mal',
    description: 'Ocurrió un error al mostrar esta sección.',
    retry: 'Reintentar',
    icon: 'pi-exclamation-circle',
  },
};

const PRIMARY_BUTTON_CLASS =
  'inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover';

const SECONDARY_BUTTON_CLASS =
  'inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50';

type AppErrorFallbackProps = {
  kind: AppErrorKind;
  variant?: 'page' | 'fullscreen';
  onRetry: () => void;
  onGoHome?: () => void;
};

export function AppErrorFallback({
  kind,
  variant = 'page',
  onRetry,
  onGoHome,
}: AppErrorFallbackProps) {
  const copy = COPY[kind];
  const showHome = Boolean(onGoHome) && kind !== 'not-found';

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center px-4 py-10',
        variant === 'fullscreen' && 'min-h-screen',
        variant === 'page' && 'min-h-80',
      )}
    >
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_18px_rgba(148,163,184,0.22)] sm:p-8">
        <AppLogo className="mb-6 h-7" />

        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
          <i className={cn('pi text-xl', copy.icon)} aria-hidden />
        </div>

        <h1 className="font-gobold text-lg tracking-wide text-slate-800 uppercase">
          {copy.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {copy.description}
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            className={PRIMARY_BUTTON_CLASS}
          >
            {copy.retry}
          </button>
          {showHome ? (
            <button
              type="button"
              onClick={onGoHome}
              className={SECONDARY_BUTTON_CLASS}
            >
              Ir al inicio
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
