import { StrictMode, useEffect, useState, type ReactNode } from 'react';
import { AppProviders } from './providers/app-providers';
import { AccessProvider } from './access-context';
import '@gamification/shared-ui/index.css';
import { enableMocking } from '@mocks/enable-mocking';
import { adoptHostSession } from '@atbo/mf-kit/dev-session';

let mockingPromise: Promise<void> | null = null;

function ensureMocking(): Promise<void> {
  mockingPromise ??= enableMocking();
  return mockingPromise;
}
await adoptHostSession({
  hostEntry:
    import.meta.env.VITE_HOST_ENTRY || 'http://localhost:5173/remoteEntry.js',
  enabled: import.meta.env.DEV,
});

/**
 * Bootstrap de un feature federado: providers + CSS, sin shell ni router propio.
 *
 * NO monta el chrome del host: lo envuelve `module.tsx`, la entrada federada,
 * con `host/layout`. Aquí rompería el modo standalone (`src/main.tsx`), que
 * comparte este bootstrap y no tiene por qué depender del host ATBO.
 */
export function RemoteFeature({ children }: Readonly<{ children: ReactNode }>) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void ensureMocking()
      .catch((error: unknown) => {
        console.error('No se pudo iniciar MSW', error);
      })
      .then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <p
        style={{
          margin: 0,
          padding: 24,
          fontFamily: 'sans-serif',
          color: '#222',
        }}
      >
        Cargando módulo…
      </p>
    );
  }

  return (
    <StrictMode>
      <AppProviders>
        <AccessProvider roles={['admin']}>
          <div className="gm-remote min-h-full p-3 md:p-5">{children}</div>
        </AccessProvider>
      </AppProviders>
    </StrictMode>
  );
}
