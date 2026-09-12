import type { UsersListFilters } from '../model/user.types';

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: UsersListFilters) =>
    [
      ...usersKeys.lists(),
      filters.q?.trim() ?? '',
      filters.active ?? 'all',
      filters.roleId ?? 'all',
    ] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: number) => [...usersKeys.details(), id] as const,
  roleOptions: () => [...usersKeys.all, 'role-options'] as const,
  assignableRoles: () => [...usersKeys.all, 'assignable-roles'] as const,
};
