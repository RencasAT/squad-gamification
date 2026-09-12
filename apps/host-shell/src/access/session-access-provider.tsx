import type { ReactNode } from 'react';
import { AccessProvider } from '@gamification/shared-ui/access-context';
import { useAuth } from '../auth/auth';

/** Roles de sesión (`/me`.accessRoles) para el shell standalone. */
export function SessionAccessProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return <AccessProvider roles={user?.accessRoles}>{children}</AccessProvider>;
}
