import { createContext, useContext, useMemo, type ReactNode } from 'react';
import {
  hasAppRole,
  hasPermission as checkPermission,
} from '@gamification/shared-utils/access';

type AccessApi = {
  roles: readonly string[];
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
};

const AccessContext = createContext<AccessApi | null>(null);

export function AccessProvider({
  roles,
  children,
}: {
  roles?: readonly string[] | null;
  children: ReactNode;
}) {
  const value = useMemo<AccessApi>(() => {
    const list = roles ?? [];
    return {
      roles: list,
      hasRole: (role: string) => hasAppRole(list, role),
      hasPermission: (permission: string) => checkPermission(list, permission),
    };
  }, [roles]);

  return (
    <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
  );
}

export function useAccess(): AccessApi {
  const access = useContext(AccessContext);
  if (!access) {
    throw new Error('useAccess debe usarse dentro de AccessProvider');
  }
  return access;
}
