import type { ReactNode } from 'react';
import { useAccess } from './access-context';

/** Muestra hijos solo si el token tiene el permiso fino (string Keycloak). */
export function HasPermission({
  permission,
  children,
}: {
  permission: string;
  children: ReactNode;
}) {
  const { hasPermission } = useAccess();
  if (!hasPermission(permission)) {
    return null;
  }
  return children;
}
