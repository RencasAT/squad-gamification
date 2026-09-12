import { http } from '@gamification/shared-utils/api/http';
import type { RolePermissionModuleDef } from '@gamification/atenea-administracion-roles/model/role.types';

type ListPermissionsResponse = {
  data: RolePermissionModuleDef[];
};

export async function fetchPermissions(): Promise<RolePermissionModuleDef[]> {
  const { data } = await http.get<ListPermissionsResponse>('/permissions');
  return data.data;
}
