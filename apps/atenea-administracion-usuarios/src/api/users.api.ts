import { http } from '@gamification/shared-utils/api/http';
import type {
  AssignableRole,
  AssignableRoleModule,
  BackofficeUser,
  PermissionAccess,
  UserRoleRef,
  UsersListFilters,
} from '../model/user.types';

type ListUsersResponse = {
  data: BackofficeUser[];
};

type UserResponse = {
  data: BackofficeUser;
};

type ListRolesLiteResponse = {
  data: Array<{ id: number; name: string }>;
};

type PermissionCatalogModule = {
  id: string;
  label: string;
  features: Array<{ id: string; label: string; detailLabel?: string }>;
};

type RolePermissionsPayload = Record<
  string,
  {
    enabled: boolean;
    features: Record<string, { enabled: boolean; access: PermissionAccess }>;
  }
>;

type ListRolesFullResponse = {
  data: Array<{
    id: number;
    name: string;
    permissions: RolePermissionsPayload;
  }>;
};

type ListPermissionsResponse = {
  data: PermissionCatalogModule[];
};

export type CreateUserRequest = {
  email: string;
  name?: string;
  roles?: UserRoleRef[];
};

export type UpdateUserRequest = {
  email?: string;
  name?: string;
  roles?: UserRoleRef[];
  active?: boolean;
};

function moduleAccessFromFeatures(
  features: Record<string, { enabled: boolean; access: PermissionAccess }>,
): PermissionAccess {
  const accesses = Object.values(features)
    .filter((feature) => feature.enabled)
    .map((feature) => feature.access);

  if (accesses.length === 0) {
    return 'lectura';
  }

  const [first] = accesses;
  if (first && accesses.every((access) => access === first)) {
    return first;
  }

  return 'ambas';
}

function mapRoleModules(
  catalog: PermissionCatalogModule[],
  permissions: RolePermissionsPayload,
): AssignableRoleModule[] {
  return catalog
    .filter((module) => permissions[module.id]?.enabled)
    .map((module) => {
      const moduleState = permissions[module.id]!;
      const features = module.features
        .filter((feature) => moduleState.features[feature.id]?.enabled)
        .map((feature) => ({
          id: feature.id,
          label: feature.detailLabel ?? feature.label,
          access: moduleState.features[feature.id]?.access ?? 'edicion',
        }));

      return {
        id: module.id,
        label: module.label,
        access: moduleAccessFromFeatures(moduleState.features),
        features,
      };
    });
}

export async function fetchUsers(
  filters: UsersListFilters = {},
): Promise<BackofficeUser[]> {
  const { data } = await http.get<ListUsersResponse>('/users', {
    params: {
      ...(filters.q ? { q: filters.q } : {}),
      ...(typeof filters.active === 'boolean'
        ? { active: String(filters.active) }
        : {}),
      ...(typeof filters.roleId === 'number' && filters.roleId > 0
        ? { roleId: filters.roleId }
        : {}),
    },
  });
  return data.data;
}

export async function fetchUser(id: number): Promise<BackofficeUser> {
  const { data } = await http.get<UserResponse>(`/users/${id}`);
  return data.data;
}

/** Opciones de rol para el filtro del listado (GET /roles, shape mínimo). */
export async function fetchUserRoleOptions(): Promise<UserRoleRef[]> {
  const { data } = await http.get<ListRolesLiteResponse>('/roles');
  return data.data.map((role) => ({ id: role.id, name: role.name }));
}

/** Roles con módulos para el drawer crear/editar usuario. */
export async function fetchAssignableRoles(): Promise<AssignableRole[]> {
  const [rolesResponse, permissionsResponse] = await Promise.all([
    http.get<ListRolesFullResponse>('/roles'),
    http.get<ListPermissionsResponse>('/permissions'),
  ]);

  const catalog = permissionsResponse.data.data;
  return rolesResponse.data.data.map((role) => ({
    id: role.id,
    name: role.name,
    modules: mapRoleModules(catalog, role.permissions),
  }));
}

export async function createUserApi(
  payload: CreateUserRequest,
): Promise<BackofficeUser> {
  const { data } = await http.post<UserResponse>('/users', payload);
  return data.data;
}

export async function updateUserApi(
  id: number,
  payload: UpdateUserRequest,
): Promise<BackofficeUser> {
  const { data } = await http.put<UserResponse>(`/users/${id}`, payload);
  return data.data;
}

export async function setUserActiveApi(
  id: number,
  active: boolean,
): Promise<BackofficeUser> {
  const { data } = await http.patch<UserResponse>(`/users/${id}/active`, {
    active,
  });
  return data.data;
}

export async function deleteUserApi(id: number): Promise<void> {
  await http.delete(`/users/${id}`);
}
