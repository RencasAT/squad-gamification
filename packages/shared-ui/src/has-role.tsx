import type { ReactNode } from 'react';
import { useAccess } from './access-context';

/** Muestra hijos solo si el token/sesión tiene el rol de Keycloak. */
export function HasRole({
  role,
  children,
}: {
  role: string;
  children: ReactNode;
}) {
  const { hasRole } = useAccess();
  if (!hasRole(role)) {
    return null;
  }
  return children;
}
