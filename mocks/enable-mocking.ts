import { environment } from '@gamification/shared-utils/environments/environment';

/**
 * El SW tiene que cubir el origen de la página. Con `base: /modulo/` el
 * worker del remote queda bajo ese path; federado en el host la ruta es
 * otra (`/clientes/...`) y hay que usar el worker en la raíz.
 */
function mockServiceWorkerUrl(): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const underRemoteBase =
    base !== '/' && window.location.pathname.startsWith(base);

  if (!underRemoteBase) {
    return '/mockServiceWorker.js';
  }

  return `${base}mockServiceWorker.js`;
}

/** Arranca MSW cuando `VITE_USE_MOCKS=true` (dev / build local). En prod real queda off. */
export async function enableMocking(): Promise<void> {
  if (!environment.useMocks) {
    return;
  }

  const { worker } = await import('./browser');

  await worker.start({
    serviceWorker: {
      url: mockServiceWorkerUrl(),
    },
    onUnhandledRequest: environment.production ? 'bypass' : 'warn',
    quiet: environment.production,
  });
}
