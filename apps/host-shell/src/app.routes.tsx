import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import type { ReactNode } from 'react';
import { AuthGuard } from './guards/auth.guard';
import { PasswordChangeGuard } from './guards/password-change.guard';
import { RoleGuard } from './access/role-guard';
import { AppRoot } from './layout/app-root';
import { RouteErrorBoundary } from './layout/route-error-boundary';
import { ShellLayout } from './layout/shell-layout';
import { lazyRoute } from '@gamification/shared-utils/utils/lazy-route';

const LoginPage = lazyRoute(() =>
  import('./auth/login-page').then((m) => ({ default: m.LoginPage })),
);
const ChangePasswordPage = lazyRoute(() =>
  import('./auth/change-password-page').then((m) => ({
    default: m.ChangePasswordPage,
  })),
);
const DashboardPage = lazyRoute(() =>
  import('@gamification/atenea-gamificacion-dashboard/dashboard-page').then(
    (m) => ({
      default: m.DashboardPage,
    }),
  ),
);
const TorneosPage = lazyRoute(() =>
  import('@gamification/atenea-gamificacion-contenido/torneos-page').then(
    (m) => ({ default: m.TorneosPage }),
  ),
);
const MisionesPage = lazyRoute(() =>
  import('@gamification/atenea-gamificacion-contenido/misiones-page').then(
    (m) => ({ default: m.MisionesPage }),
  ),
);
const RachasPage = lazyRoute(() =>
  import('@gamification/atenea-contenido-rachas/rachas-page').then((m) => ({
    default: m.RachasPage,
  })),
);
const PremiosPage = lazyRoute(() =>
  import('@gamification/atenea-gamificacion-premios/premios-page').then(
    (m) => ({
      default: m.PremiosPage,
    }),
  ),
);
const AnalisisModeladoPage = lazyRoute(() =>
  import('@gamification/atenea-gamificacion-analisis-modelado/analisis-modelado-page').then(
    (m) => ({
      default: m.AnalisisModeladoPage,
    }),
  ),
);
const BusquedaClientesPage = lazyRoute(() =>
  import('@gamification/atenea-clientes-buscador/busqueda-clientes-page').then(
    (m) => ({
      default: m.BusquedaClientesPage,
    }),
  ),
);
const SimulacionesPage = lazyRoute(() =>
  import('@gamification/atenea-gamificacion-simulaciones/simulaciones-page').then(
    (m) => ({
      default: m.SimulacionesPage,
    }),
  ),
);
const MediaPage = lazyRoute(() =>
  import('@gamification/atenea-gamificacion-media/media-page').then((m) => ({
    default: m.MediaPage,
  })),
);
const LogsMonitoreoPage = lazyRoute(() =>
  import('@gamification/atenea-admin-logs/logs-monitoreo-page').then((m) => ({
    default: m.LogsMonitoreoPage,
  })),
);
const SettingsPage = lazyRoute(() =>
  import('./settings/settings-page').then((m) => ({
    default: m.SettingsPage,
  })),
);
const NotificationsPage = lazyRoute(() =>
  import('@gamification/atenea-admin-notificaciones/notifications-page').then(
    (m) => ({
      default: m.NotificationsPage,
    }),
  ),
);
const UiKitPage = lazyRoute(() =>
  import('@gamification/atenea-ui-kit/ui-kit-page').then((m) => ({
    default: m.UiKitPage,
  })),
);
const UsersListPage = lazyRoute(() =>
  import('@gamification/atenea-administracion-usuarios/users-list-page').then(
    (m) => ({
      default: m.UsersListPage,
    }),
  ),
);
const RolesListPage = lazyRoute(() =>
  import('@gamification/atenea-administracion-roles/roles-list-page').then(
    (m) => ({
      default: m.RolesListPage,
    }),
  ),
);

function moduleRoute(path: string, role: string, element: ReactNode) {
  return {
    path,
    element: <RoleGuard role={role} />,
    children: [{ index: true, element }],
  };
}

export const appRoutes = createBrowserRouter([
  {
    element: <AppRoot />,
    errorElement: <RouteErrorBoundary variant="fullscreen" />,
    children: [
      {
        path: '/auth/login',
        element: <LoginPage />,
        errorElement: <RouteErrorBoundary variant="fullscreen" />,
      },
      {
        path: '/auth/change-password',
        element: <PasswordChangeGuard />,
        errorElement: <RouteErrorBoundary variant="fullscreen" />,
        children: [{ index: true, element: <ChangePasswordPage /> }],
      },
      {
        path: '/',
        element: <AuthGuard />,
        errorElement: <RouteErrorBoundary variant="fullscreen" />,
        children: [
          {
            element: <ShellLayout />,
            children: [
              {
                element: <Outlet />,
                errorElement: <RouteErrorBoundary variant="page" />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="/dashboard" replace />,
                  },
                  moduleRoute('dashboard', 'dashboard', <DashboardPage />),
                  {
                    path: 'contenido-gamification',
                    element: <RoleGuard role="contenido-gamification" />,
                    children: [
                      {
                        index: true,
                        element: <Navigate to="torneos" replace />,
                      },
                      moduleRoute(
                        'torneos',
                        'contenido-gamification',
                        <TorneosPage />,
                      ),
                      moduleRoute(
                        'misiones',
                        'contenido-gamification',
                        <MisionesPage />,
                      ),
                      moduleRoute(
                        'rachas',
                        'contenido-gamification',
                        <RachasPage />,
                      ),
                    ],
                  },
                  moduleRoute('premios', 'premios', <PremiosPage />),
                  moduleRoute(
                    'analisis-modelado',
                    'analisis-modelado',
                    <AnalisisModeladoPage />,
                  ),
                  {
                    path: 'clientes',
                    element: <RoleGuard role="clientes" />,
                    children: [
                      {
                        index: true,
                        element: <Navigate to="busqueda" replace />,
                      },
                      moduleRoute(
                        'busqueda',
                        'clientes',
                        <BusquedaClientesPage />,
                      ),
                    ],
                  },
                  moduleRoute(
                    'simulaciones',
                    'simulaciones',
                    <SimulacionesPage />,
                  ),
                  moduleRoute('media', 'media', <MediaPage />),
                  {
                    path: 'administracion',
                    element: (
                      <RoleGuard anyOf={['administracion', 'users', 'roles']} />
                    ),
                    children: [
                      {
                        index: true,
                        element: <Navigate to="usuarios" replace />,
                      },
                      moduleRoute('usuarios', 'users', <UsersListPage />),
                      moduleRoute('roles', 'roles', <RolesListPage />),
                    ],
                  },
                  moduleRoute(
                    'logs-monitoreo',
                    'logs-monitoreo',
                    <LogsMonitoreoPage />,
                  ),
                  moduleRoute('componentes', 'ui-kit', <UiKitPage />),
                  moduleRoute('settings', 'settings', <SettingsPage />),
                  {
                    path: 'notificaciones',
                    element: <NotificationsPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
