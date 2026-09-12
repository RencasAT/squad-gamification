import { emptyRolePermissions } from '@gamification/atenea-administracion-roles/model/role.types';
import { mockPermissionModules } from '../data/permissions.mock';
import { mockRoles } from '../data/roles.mock';
import type {
  RoleFormValues,
  RoleRow,
} from '@gamification/atenea-administracion-roles/model/role.types';

let roles: RoleRow[] = seedRoles();

function seedRoles(): RoleRow[] {
  return mockRoles.map(cloneRole);
}

function cloneRole(role: RoleRow): RoleRow {
  return structuredClone(role);
}

export function resetRolesStore(): void {
  roles = seedRoles();
}

export function listRoles(query?: string): RoleRow[] {
  const term = query?.trim().toLowerCase();
  const items = roles.map(cloneRole);

  if (!term) {
    return items;
  }

  return items.filter((role) => role.name.toLowerCase().includes(term));
}

export function getRoleById(id: number): RoleRow | null {
  const role = roles.find((item) => item.id === id);
  return role ? cloneRole(role) : null;
}

export type CreateRolePayload = RoleFormValues;

export function createRole(payload: CreateRolePayload): RoleRow {
  const nextId = Math.max(0, ...roles.map((role) => role.id)) + 1;
  const role: RoleRow = {
    id: nextId,
    name: payload.name.trim(),
    permissions: structuredClone(
      payload.permissions ?? emptyRolePermissions(mockPermissionModules),
    ),
  };
  roles = [role, ...roles];
  return cloneRole(role);
}

export type UpdateRolePayload = Partial<RoleFormValues>;

export function updateRole(
  id: number,
  payload: UpdateRolePayload,
): RoleRow | null {
  const index = roles.findIndex((role) => role.id === id);
  if (index < 0) {
    return null;
  }

  const current = roles[index]!;
  roles[index] = {
    ...current,
    name: payload.name?.trim() ?? current.name,
    permissions: payload.permissions
      ? structuredClone(payload.permissions)
      : structuredClone(current.permissions),
  };
  return getRoleById(id);
}

export function deleteRole(id: number): boolean {
  const before = roles.length;
  roles = roles.filter((role) => role.id !== id);
  return roles.length < before;
}
