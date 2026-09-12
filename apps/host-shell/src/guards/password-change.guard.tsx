import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../auth/auth';
import { ModuleLoader } from '@gamification/shared-ui/components/module-loader';

/** Solo usuarios autenticados que deben actualizar la contraseña temporal. */
export function PasswordChangeGuard() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <ModuleLoader variant="fullscreen" label="Cargando sesión" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!user?.mustChangePassword) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
