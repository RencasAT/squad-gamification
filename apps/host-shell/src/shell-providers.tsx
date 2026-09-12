import type { ReactNode } from 'react';
import { AppProviders } from '@gamification/shared-ui/providers/app-providers';
import { SessionAccessProvider } from './access/session-access-provider';
import { useSyncSessionOnAdminChanges } from './auth/use-sync-session';

function SessionSync() {
  useSyncSessionOnAdminChanges();
  return null;
}

/** Providers del standalone: UI compartida + roles de sesión. */
export function ShellProviders({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <SessionAccessProvider>
        <SessionSync />
        {children}
      </SessionAccessProvider>
    </AppProviders>
  );
}
