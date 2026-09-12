import { Navigate, Outlet } from 'react-router';
import { useAccess } from '@gamification/shared-ui/access-context';

type RoleGuardProps = {
  role?: string;
  anyOf?: readonly string[];
  redirectTo?: string;
};

/** Guard de ruta según roles de Keycloak (o accessRoles de `/me` en local). */
export function RoleGuard({
  role,
  anyOf,
  redirectTo = '/dashboard',
}: RoleGuardProps) {
  const { hasRole } = useAccess();
  const allowed = anyOf?.length
    ? anyOf.some((item) => hasRole(item))
    : role
      ? hasRole(role)
      : false;

  if (!allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
