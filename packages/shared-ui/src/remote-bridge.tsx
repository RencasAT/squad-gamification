import { useEffect, type ReactNode } from 'react';
import {
  setAccessToken,
  setUnauthorizedHandler,
} from '@gamification/shared-utils/api/http';
import type { FederatedRemoteProps } from '@gamification/shared-utils/access';
import { AccessProvider } from './access-context';

type RemoteBridgeProps = FederatedRemoteProps & { children: ReactNode };

/** Sesión que inyecta el host: Bearer en memoria + roles de Keycloak. */
export function RemoteBridge({
  token = null,
  roles = null,
  onUnauthorized,
  children,
}: RemoteBridgeProps) {
  useEffect(() => {
    setAccessToken(token);
    setUnauthorizedHandler(onUnauthorized ?? null);

    return () => {
      setAccessToken(null);
      setUnauthorizedHandler(null);
    };
  }, [token, onUnauthorized]);

  return <AccessProvider roles={roles}>{children}</AccessProvider>;
}
