import type { AppRole } from '@gamification/shared-utils/access';

export type NavItem = {
  label: string;
  path: string;
  icon: string;
  role: AppRole;
  children?: NavItem[];
};

export const navModules: NavItem[] = [
  {
    label: 'Inicio',
    path: '/dashboard',
    icon: 'pi pi-home',
    role: 'dashboard',
  },
  {
    label: 'Contenido Gamification',
    path: '/contenido-gamification',
    icon: 'pi pi-th-large',
    role: 'contenido-gamification',
    children: [
      {
        label: 'Torneos',
        path: '/contenido-gamification/torneos',
        icon: 'pi pi-flag',
        role: 'contenido-gamification',
      },
      {
        label: 'Misiones',
        path: '/contenido-gamification/misiones',
        icon: 'pi pi-bolt',
        role: 'contenido-gamification',
      },
      {
        label: 'Rachas',
        path: '/contenido-gamification/rachas',
        icon: 'pi pi-chart-line',
        role: 'contenido-gamification',
      },
    ],
  },
  {
    label: 'Premios',
    path: '/premios',
    icon: 'pi pi-trophy',
    role: 'premios',
  },
  {
    label: 'Análisis y Modelado',
    path: '/analisis-modelado',
    icon: 'pi pi-file',
    role: 'analisis-modelado',
  },
  {
    label: 'Clientes',
    path: '/clientes',
    icon: 'pi pi-users',
    role: 'clientes',
    children: [
      {
        label: 'Búsqueda de clientes',
        path: '/clientes/busqueda',
        icon: 'pi pi-search',
        role: 'clientes',
      },
    ],
  },
  {
    label: 'Simulaciones',
    path: '/simulaciones',
    icon: 'pi pi-sync',
    role: 'simulaciones',
  },
  {
    label: 'Media',
    path: '/media',
    icon: 'pi pi-image',
    role: 'media',
  },
  {
    label: 'Administración',
    path: '/administracion',
    icon: 'pi pi-user-edit',
    role: 'administracion',
    children: [
      {
        label: 'Gestión de usuarios',
        path: '/administracion/usuarios',
        icon: 'pi pi-users',
        role: 'users',
      },
      {
        label: 'Gestión de roles',
        path: '/administracion/roles',
        icon: 'pi pi-shield',
        role: 'roles',
      },
    ],
  },
  {
    label: 'Logs y Monitoreo',
    path: '/logs-monitoreo',
    icon: 'pi pi-list',
    role: 'logs-monitoreo',
  },
  {
    label: 'Catálogo de componentes',
    path: '/componentes',
    icon: 'pi pi-palette',
    role: 'ui-kit',
  },
];

export function findNavItemByPath(pathname: string): NavItem | undefined {
  for (const item of navModules) {
    if (item.children?.length) {
      const child = item.children.find(
        (sub) => pathname === sub.path || pathname.startsWith(`${sub.path}/`),
      );
      if (child) {
        return child;
      }

      if (pathname === item.path) {
        return item;
      }

      continue;
    }

    if (pathname === item.path || pathname.startsWith(`${item.path}/`)) {
      return item;
    }
  }

  return undefined;
}
