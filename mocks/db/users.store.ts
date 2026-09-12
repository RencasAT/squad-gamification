import { mockUsers } from '../data/users.mock';
import type {
  BackofficeUser,
  UserRoleRef,
  UsersListFilters,
} from '@gamification/atenea-administracion-usuarios/model/user.types';

function cloneUser(user: BackofficeUser): BackofficeUser {
  return {
    ...user,
    roles: user.roles.map((role) => ({ ...role })),
  };
}

let users: BackofficeUser[] = mockUsers.map(cloneUser);

export function resetUsersStore(): void {
  users = mockUsers.map(cloneUser);
}

export function listUsers(filters: UsersListFilters = {}): BackofficeUser[] {
  const term = filters.q?.trim().toLowerCase();
  const { active, roleId } = filters;

  return users
    .filter((user) => {
      if (typeof active === 'boolean' && user.active !== active) {
        return false;
      }

      if (typeof roleId === 'number' && roleId > 0) {
        if (!user.roles.some((role) => role.id === roleId)) {
          return false;
        }
      }

      if (!term) {
        return true;
      }

      return (
        user.email.toLowerCase().includes(term) ||
        user.name.toLowerCase().includes(term) ||
        String(user.externalId).includes(term) ||
        String(user.id).includes(term)
      );
    })
    .map(cloneUser);
}

export function getUserById(id: number): BackofficeUser | null {
  const user = users.find((item) => item.id === id);
  return user ? cloneUser(user) : null;
}

export function getUserByEmail(email: string): BackofficeUser | null {
  const normalized = email.trim().toLowerCase();
  const user = users.find((item) => item.email.toLowerCase() === normalized);
  return user ? cloneUser(user) : null;
}

export type CreateUserPayload = {
  email: string;
  roles?: UserRoleRef[];
  name?: string;
  externalId?: number;
};

export function createUser(payload: CreateUserPayload): BackofficeUser {
  const nextId = Math.max(0, ...users.map((user) => user.id)) + 1;
  const emailName = payload.email.split('@')[0] ?? payload.email;
  const externalId =
    payload.externalId ??
    Math.max(0, ...users.map((user) => user.externalId)) + 1;
  const user: BackofficeUser = {
    id: nextId,
    externalId,
    name: payload.name?.trim() || emailName,
    email: payload.email,
    active: true,
    roles: payload.roles?.map((role) => ({ ...role })) ?? [],
  };
  users = [user, ...users];
  return getUserById(user.id)!;
}

export type UpdateUserPayload = {
  email?: string;
  roles?: UserRoleRef[];
  name?: string;
  active?: boolean;
  externalId?: number;
};

export function updateUser(
  id: number,
  payload: UpdateUserPayload,
): BackofficeUser | null {
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) {
    return null;
  }

  const current = users[index]!;
  users[index] = {
    ...current,
    email: payload.email ?? current.email,
    name: payload.name ?? current.name,
    externalId: payload.externalId ?? current.externalId,
    active:
      typeof payload.active === 'boolean' ? payload.active : current.active,
    roles: payload.roles
      ? payload.roles.map((role) => ({ ...role }))
      : current.roles.map((role) => ({ ...role })),
  };
  return getUserById(id);
}

export function setUserActive(
  id: number,
  active: boolean,
): BackofficeUser | null {
  return updateUser(id, { active });
}

export function deleteUser(id: number): boolean {
  const before = users.length;
  users = users.filter((user) => user.id !== id);
  return users.length < before;
}
