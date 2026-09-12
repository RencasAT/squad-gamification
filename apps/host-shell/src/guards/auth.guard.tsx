import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../auth/auth';
import { ModuleLoader } from '@gamification/shared-ui/components/module-loader';

/** Guard de rutas autenticadas. */
export function AuthGuard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <ModuleLoader variant="fullscreen" label="Cargando sesión" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (user?.mustChangePassword) {
    return <Navigate to="/auth/change-password" replace />;
  }

  return <Outlet />;
}
