import type { AuthRoleRef } from '@gamification/host-shell/auth/auth.types';
import type {
  ModulePermissionState,
  RolePermission,
} from '@gamification/atenea-administracion-roles/model/role.types';
import { getRoleById } from '../db/roles.store';

const ADMIN_FEATURE_ROLES: Record<string, string> = {
  usuarios: 'users',
  roles: 'roles',
};

const DEFAULT_SESSION_ROLES = ['dashboard', 'settings', 'ui-kit'];

function rolesFromModuleState(
  moduleId: RolePermission,
  moduleState: ModulePermissionState,
  bucket: Set<string>,
): void {
  if (!moduleState.enabled) {
    return;
  }

  bucket.add(moduleId);

  if (moduleId !== 'administracion') {
    return;
  }

  for (const [featureId, feature] of Object.entries(moduleState.features)) {
    if (!feature.enabled) {
      continue;
    }
    const mapped = ADMIN_FEATURE_ROLES[featureId];
    if (mapped) {
      bucket.add(mapped);
    }
  }
}

/**
 * Convierte los módulos habilitados de los roles asignados a nombres de rol
 * Keycloak (`users`, `clientes`, …).
 */
export function resolveSessionRoles(roles: AuthRoleRef[]): string[] {
  if (roles.length === 0) {
    return [];
  }

  const bucket = new Set<string>();

  for (const roleRef of roles) {
    const role = getRoleById(roleRef.id);
    if (!role) {
      continue;
    }

    for (const [moduleId, moduleState] of Object.entries(role.permissions) as [
      RolePermission,
      ModulePermissionState,
    ][]) {
      rolesFromModuleState(moduleId, moduleState, bucket);
    }
  }

  if (bucket.size === 0) {
    return [];
  }

  for (const extra of DEFAULT_SESSION_ROLES) {
    bucket.add(extra);
  }

  return [...bucket];
}
