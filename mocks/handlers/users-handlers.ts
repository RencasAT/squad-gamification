import { http } from 'msw';
import type { UserRoleRef } from '@gamification/atenea-administracion-usuarios/model/user.types';
import { apiPath } from '../api-path';
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  setUserActive,
  updateUser,
} from '../db/users.store';
import { addAuthAccount } from '../data/auth.mock';
import { errorJson, okJson, withMockDelay } from '../mock-utils';

type CreateUserBody = {
  email?: string;
  name?: string;
  roles?: UserRoleRef[];
  externalId?: number;
};

function generateTemporaryPassword(length = 12): string {
  const alphabet =
    'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$';
  const values = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(values, (value) => alphabet[value % alphabet.length]).join(
    '',
  );
}

type UpdateUserBody = {
  email?: string;
  name?: string;
  roles?: UserRoleRef[];
  active?: boolean;
  externalId?: number;
};

export const usersHandlers = [
  http.get(apiPath('/users'), async ({ request }) => {
    await withMockDelay();
    const url = new URL(request.url);
    const query = url.searchParams.get('q') ?? undefined;
    const activeParam = url.searchParams.get('active');
    const roleIdParam = url.searchParams.get('roleId');
    const active =
      activeParam === 'true'
        ? true
        : activeParam === 'false'
          ? false
          : undefined;
    const roleId = roleIdParam ? Number(roleIdParam) : undefined;

    return okJson({
      data: listUsers({
        q: query,
        active,
        roleId:
          typeof roleId === 'number' && Number.isFinite(roleId)
            ? roleId
            : undefined,
      }),
    });
  }),

  http.get(apiPath('/users/:id'), async ({ params }) => {
    await withMockDelay();
    const id = Number(params.id);
    const user = getUserById(id);
    if (!user) {
      return errorJson(404, 'Usuario no encontrado');
    }
    return okJson({ data: user });
  }),

  http.post(apiPath('/users'), async ({ request }) => {
    await withMockDelay();
    const body = (await request.json()) as CreateUserBody;
    if (!body.email) {
      return errorJson(400, 'Correo es requerido');
    }
    const user = createUser({
      email: body.email,
      name: body.name,
      roles: body.roles,
      externalId: body.externalId,
    });
    addAuthAccount({
      id: `user-${user.id}`,
      name: user.name,
      email: user.email,
      password: generateTemporaryPassword(),
      mustChangePassword: true,
    });
    return okJson({ data: user }, { status: 201 });
  }),

  http.put(apiPath('/users/:id'), async ({ params, request }) => {
    await withMockDelay();
    const id = Number(params.id);
    const body = (await request.json()) as UpdateUserBody;
    const user = updateUser(id, {
      email: body.email,
      name: body.name,
      roles: body.roles,
      active: body.active,
      externalId: body.externalId,
    });
    if (!user) {
      return errorJson(404, 'Usuario no encontrado');
    }
    return okJson({ data: user });
  }),

  http.patch(apiPath('/users/:id/active'), async ({ params, request }) => {
    await withMockDelay();
    const id = Number(params.id);
    const body = (await request.json()) as { active?: boolean };
    if (typeof body.active !== 'boolean') {
      return errorJson(400, 'El campo active es requerido');
    }
    const user = setUserActive(id, body.active);
    if (!user) {
      return errorJson(404, 'Usuario no encontrado');
    }
    return okJson({ data: user });
  }),

  http.delete(apiPath('/users/:id'), async ({ params }) => {
    await withMockDelay();
    const id = Number(params.id);
    if (!deleteUser(id)) {
      return errorJson(404, 'Usuario no encontrado');
    }
    return okJson({ ok: true });
  }),
];
