import { http } from '@gamification/shared-utils/api/http';
import type {
  RoleFormValues,
  RoleRow,
} from '@gamification/atenea-administracion-roles/model/role.types';

type ListRolesResponse = {
  data: RoleRow[];
};

type RoleResponse = {
  data: RoleRow;
};

export type CreateRoleRequest = RoleFormValues;

export type UpdateRoleRequest = Partial<RoleFormValues>;

export async function fetchRoles(query?: string): Promise<RoleRow[]> {
  const { data } = await http.get<ListRolesResponse>('/roles', {
    params: query ? { q: query } : undefined,
  });
  return data.data;
}

export async function fetchRole(id: number): Promise<RoleRow> {
  const { data } = await http.get<RoleResponse>(`/roles/${id}`);
  return data.data;
}

export async function createRoleApi(
  payload: CreateRoleRequest,
): Promise<RoleRow> {
  const { data } = await http.post<RoleResponse>('/roles', payload);
  return data.data;
}

export async function updateRoleApi(
  id: number,
  payload: UpdateRoleRequest,
): Promise<RoleRow> {
  const { data } = await http.put<RoleResponse>(`/roles/${id}`, payload);
  return data.data;
}

export async function deleteRoleApi(id: number): Promise<void> {
  await http.delete(`/roles/${id}`);
}
