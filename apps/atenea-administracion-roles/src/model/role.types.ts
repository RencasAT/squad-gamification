export type PermissionAccess = 'lectura' | 'edicion' | 'ambas';

export type RolePermission =
  | 'contenido-gamification'
  | 'premios'
  | 'analisis-modelado'
  | 'clientes'
  | 'simulaciones'
  | 'media'
  | 'administracion'
  | 'logs-monitoreo';

export const PERMISSION_ACCESS_OPTIONS: {
  value: PermissionAccess;
  label: string;
}[] = [
  { value: 'lectura', label: 'Lectura' },
  { value: 'edicion', label: 'Edición' },
  { value: 'ambas', label: 'Combinado' },
];

export const FEATURE_ACCESS_OPTIONS: {
  value: Exclude<PermissionAccess, 'ambas'>;
  label: string;
}[] = [
  { value: 'lectura', label: 'Lectura' },
  { value: 'edicion', label: 'Edición' },
];

export const PERMISSION_ACCESS_LABELS: Record<PermissionAccess, string> = {
  lectura: 'Lectura',
  edicion: 'Edición',
  ambas: 'Combinado',
};

export const PERMISSION_ACCESS_ICONS: Record<PermissionAccess, string> = {
  lectura: 'pi-eye',
  edicion: 'pi-pencil',
  ambas: 'pi-minus',
};

export type RolePermissionFeatureDef = {
  id: string;
  label: string;
  detailLabel?: string;
};

export type RolePermissionModuleDef = {
  id: RolePermission;
  label: string;
  badgeLabel?: string;
  features: RolePermissionFeatureDef[];
};

export type FeaturePermissionState = {
  enabled: boolean;
  access: PermissionAccess;
};

export type ModulePermissionState = {
  enabled: boolean;
  features: Record<string, FeaturePermissionState>;
};

export type RolePermissionsState = Record<
  RolePermission,
  ModulePermissionState
>;

export type RoleRow = {
  id: number;
  name: string;
  permissions: RolePermissionsState;
};

export type RoleFormValues = {
  name: string;
  permissions: RolePermissionsState;
};

export type PermissionDetailItem = {
  id: string;
  label: string;
  access: PermissionAccess;
};

function buildEmptyModule(
  module: RolePermissionModuleDef,
): ModulePermissionState {
  return {
    enabled: false,
    features: Object.fromEntries(
      module.features.map((feature) => [
        feature.id,
        { enabled: false, access: 'edicion' as PermissionAccess },
      ]),
    ),
  };
}

export function emptyRolePermissions(
  catalog: RolePermissionModuleDef[],
): RolePermissionsState {
  return Object.fromEntries(
    catalog.map((module) => [module.id, buildEmptyModule(module)]),
  ) as RolePermissionsState;
}

function withModuleEnabled(
  module: RolePermissionModuleDef,
  access: PermissionAccess = 'edicion',
): ModulePermissionState {
  return {
    enabled: true,
    features: Object.fromEntries(
      module.features.map((feature) => [feature.id, { enabled: true, access }]),
    ),
  };
}

export function permissionsFromModules(
  catalog: RolePermissionModuleDef[],
  modules: RolePermission[],
  access: PermissionAccess = 'edicion',
): RolePermissionsState {
  const permissions = emptyRolePermissions(catalog);
  const enabled = new Set(modules);

  for (const module of catalog) {
    if (enabled.has(module.id)) {
      permissions[module.id] = withModuleEnabled(module, access);
    }
  }

  return permissions;
}

export function getRoleModuleDetails(
  module: RolePermissionModuleDef,
  moduleState?: ModulePermissionState,
): PermissionDetailItem[] {
  return module.features.map((feature) => ({
    id: feature.id,
    label: feature.detailLabel ?? feature.label,
    access: moduleState?.features[feature.id]?.access ?? 'edicion',
  }));
}

export function moduleAccessFromState(
  moduleState: ModulePermissionState | undefined,
): PermissionAccess {
  const accesses = Object.values(moduleState?.features ?? {})
    .filter((feature) => feature.enabled)
    .map((feature) => feature.access);

  if (accesses.length === 0) {
    return 'edicion';
  }

  const [first] = accesses;
  if (first && accesses.every((access) => access === first)) {
    return first;
  }

  return 'ambas';
}

function humanizeKebab(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Módulos activos de un rol para badges del listado (sin GET /permissions). */
export function enabledModulesFromRole(
  permissions: RolePermissionsState,
): RolePermissionModuleDef[] {
  return (
    Object.entries(permissions) as [RolePermission, ModulePermissionState][]
  )
    .filter(([, moduleState]) => moduleState.enabled)
    .map(([id, moduleState]) => ({
      id,
      label: humanizeKebab(id),
      features: Object.keys(moduleState.features).map((featureId) => ({
        id: featureId,
        label: humanizeKebab(featureId),
      })),
    }));
}
