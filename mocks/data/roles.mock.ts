import {
  emptyRolePermissions,
  permissionsFromModules,
  type ModulePermissionState,
  type PermissionAccess,
  type RolePermission,
  type RolePermissionsState,
  type RoleRow,
} from '@gamification/atenea-administracion-roles/model/role.types';
import { mockPermissionModules } from './permissions.mock';

const ALL_MODULES: RolePermission[] = mockPermissionModules.map(
  (module) => module.id,
);

const WITHOUT_ADMIN: RolePermission[] = ALL_MODULES.filter(
  (module) => module !== 'administracion',
);

function featureAccess(
  enabled: boolean,
  access: PermissionAccess,
): { enabled: boolean; access: PermissionAccess } {
  return { enabled, access };
}

function moduleWithFeatures(
  moduleId: RolePermission,
  features: Record<string, { enabled: boolean; access: PermissionAccess }>,
): ModulePermissionState {
  const catalogModule = mockPermissionModules.find(
    (module) => module.id === moduleId,
  );
  const baseFeatures = Object.fromEntries(
    (catalogModule?.features ?? []).map((feature) => [
      feature.id,
      featureAccess(false, 'edicion'),
    ]),
  );

  return {
    enabled: true,
    features: { ...baseFeatures, ...features },
  };
}

/** Permisos del rol Admin según el diseño de detalle expandido. */
function buildAdminPermissions(): RolePermissionsState {
  const permissions = emptyRolePermissions(mockPermissionModules);

  permissions['contenido-gamification'] = moduleWithFeatures(
    'contenido-gamification',
    {
      torneos: featureAccess(true, 'edicion'),
      misiones: featureAccess(true, 'edicion'),
      rachas: featureAccess(true, 'edicion'),
      terminos: featureAccess(true, 'edicion'),
    },
  );

  permissions.premios = moduleWithFeatures('premios', {
    catalogo: featureAccess(true, 'edicion'),
    canjes: featureAccess(true, 'lectura'),
    inventario: featureAccess(true, 'edicion'),
  });

  permissions['analisis-modelado'] = moduleWithFeatures('analisis-modelado', {
    reportes: featureAccess(true, 'lectura'),
    tracking: featureAccess(true, 'lectura'),
  });

  permissions.clientes = moduleWithFeatures('clientes', {
    tracking: featureAccess(true, 'lectura'),
  });

  permissions.simulaciones = moduleWithFeatures('simulaciones', {
    'ab-testing': featureAccess(true, 'lectura'),
    'ab-testing-b': featureAccess(true, 'lectura'),
  });

  permissions.media = { enabled: true, features: {} };

  permissions.administracion = moduleWithFeatures('administracion', {
    usuarios: featureAccess(true, 'edicion'),
    roles: featureAccess(true, 'edicion'),
  });

  permissions['logs-monitoreo'] = { enabled: true, features: {} };

  return permissions;
}

export const mockRoles: RoleRow[] = [
  {
    id: 1,
    name: 'Admin',
    permissions: buildAdminPermissions(),
  },
  {
    id: 2,
    name: 'Gamification',
    permissions: permissionsFromModules(
      mockPermissionModules,
      ALL_MODULES.filter(
        (id) => id !== 'administracion' && id !== 'logs-monitoreo',
      ),
      'edicion',
    ),
  },
  {
    id: 3,
    name: 'Producto',
    permissions: permissionsFromModules(
      mockPermissionModules,
      WITHOUT_ADMIN,
      'lectura',
    ),
  },
  {
    id: 4,
    name: 'Legal',
    permissions: permissionsFromModules(mockPermissionModules, WITHOUT_ADMIN),
  },
  {
    id: 5,
    name: 'CRM',
    permissions: permissionsFromModules(mockPermissionModules, WITHOUT_ADMIN),
  },
  {
    id: 6,
    name: 'AAC',
    permissions: permissionsFromModules(mockPermissionModules, WITHOUT_ADMIN),
  },
];
