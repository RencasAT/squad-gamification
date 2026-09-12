import { http } from 'msw';
import { emptyRolePermissions } from '@gamification/atenea-administracion-roles/model/role.types';
import type { RoleFormValues } from '@gamification/atenea-administracion-roles/model/role.types';
import { mockPermissionModules } from '../data/permissions.mock';
import { apiPath } from '../api-path';
import {
  createRole,
  deleteRole,
  getRoleById,
  listRoles,
  updateRole,
} from '../db/roles.store';
import { errorJson, okJson, withMockDelay } from '../mock-utils';

type RoleBody = Partial<RoleFormValues>;

export const rolesHandlers = [
  http.get(apiPath('/roles'), async ({ request }) => {
    await withMockDelay();
    const url = new URL(request.url);
    const query = url.searchParams.get('q') ?? undefined;
    return okJson({ data: listRoles(query) });
  }),

  http.get(apiPath('/roles/:id'), async ({ params }) => {
    await withMockDelay();
    const id = Number(params.id);
    const role = getRoleById(id);
    if (!role) {
      return errorJson(404, 'Rol no encontrado');
    }
    return okJson({ data: role });
  }),

  http.post(apiPath('/roles'), async ({ request }) => {
    await withMockDelay();
    const body = (await request.json()) as RoleBody;
    if (!body.name?.trim()) {
      return errorJson(400, 'Nombre es requerido');
    }
    const role = createRole({
      name: body.name,
      permissions:
        body.permissions ?? emptyRolePermissions(mockPermissionModules),
    });
    return okJson({ data: role }, { status: 201 });
  }),

  http.put(apiPath('/roles/:id'), async ({ params, request }) => {
    await withMockDelay();
    const id = Number(params.id);
    const body = (await request.json()) as RoleBody;
    const role = updateRole(id, {
      name: body.name,
      permissions: body.permissions,
    });
    if (!role) {
      return errorJson(404, 'Rol no encontrado');
    }
    return okJson({ data: role });
  }),

  http.delete(apiPath('/roles/:id'), async ({ params }) => {
    await withMockDelay();
    const id = Number(params.id);
    if (!deleteRole(id)) {
      return errorJson(404, 'Rol no encontrado');
    }
    return okJson({ ok: true });
  }),
];
