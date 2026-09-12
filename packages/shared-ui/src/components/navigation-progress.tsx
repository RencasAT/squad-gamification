import { useEffect, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router';
import {
  completeNavigationProgress,
  getNavigationProgressSnapshot,
  startNavigationProgress,
  subscribeNavigationProgress,
} from '@gamification/shared-utils/lib/navigation-progress';
import { cn } from '@gamification/shared-utils/utils/cn';

/** Pulso mínimo al cambiar de ruta cuando el chunk ya está en caché. */
const CACHED_ROUTE_MS = 360;

/**
 * Barra fina superior (NProgress). Vive fuera del router para cubrir
 * también el Suspense inicial de la app.
 */
export function NavigationProgressBar() {
  const { active, value } = useSyncExternalStore(
    subscribeNavigationProgress,
    getNavigationProgressSnapshot,
    getNavigationProgressSnapshot,
  );

  const percent = Math.round(value * 100);

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-busy={active}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label="Cargando página"
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-9999 h-0.75',
        'transition-opacity duration-200 ease-out',
        active ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div
        className="relative h-full bg-brand shadow-[0_0_8px_#e30613] transition-[width] duration-200 ease-out"
        style={{ width: `${percent}%` }}
      >
        <span
          className="absolute top-0 right-0 block h-full w-24 translate-x-[50%] rotate-3 bg-brand opacity-80 blur-[2px]"
          style={{ boxShadow: '0 0 10px #e30613, 0 0 6px #e30613' }}
        />
      </div>
    </div>
  );
}

/**
 * Arranca la barra en cada cambio de módulo. El ModuleLoader de página
 * la mantiene si el chunk todavía no llegó.
 */
export function NavigationProgressListener() {
  const location = useLocation();

  useEffect(() => {
    startNavigationProgress();
    const timeoutId = window.setTimeout(() => {
      completeNavigationProgress();
    }, CACHED_ROUTE_MS);

    return () => {
      window.clearTimeout(timeoutId);
      completeNavigationProgress();
    };
  }, [location.key]);

  return null;
}
