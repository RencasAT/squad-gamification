import { StrictMode, useEffect, useState, type ReactNode } from 'react';
import { AppProviders } from './providers/app-providers';
import { AccessProvider } from './access-context';
import '@gamification/shared-ui/index.css';
import { enableMocking } from '@mocks/enable-mocking';
import type {} from '@atbo/mf-kit/contract';
import { adoptHostSession } from '@atbo/mf-kit/dev-session';
import { DashboardLayout } from 'host/layout';

let mockingPromise: Promise<void> | null = null;

function ensureMocking(): Promise<void> {
  mockingPromise ??= enableMocking();
  return mockingPromise;
}
await adoptHostSession({
  hostEntry:
    import.meta.env.VITE_HOST_ENTRY || 'http://localhost:5174/remoteEntry.js',
  enabled: import.meta.env.DEV,
});

/** Bootstrap de un feature federado: providers + CSS, sin shell ni router propio. */
export function RemoteFeature({ children }: { children: ReactNode }) {
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
      <DashboardLayout breadcrumb={{ current: 'Crear versión', items: [] }}>
        <AppProviders>
          <AccessProvider roles={['admin']}>
            <div className="gm-remote min-h-full p-3 md:p-5">{children}</div>
          </AccessProvider>
        </AppProviders>
      </DashboardLayout>
    </StrictMode>
  );
}
