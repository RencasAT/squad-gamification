import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createUserApi,
  deleteUserApi,
  fetchAssignableRoles,
  fetchUser,
  fetchUserRoleOptions,
  fetchUsers,
  setUserActiveApi,
  updateUserApi,
  type CreateUserRequest,
  type UpdateUserRequest,
} from './users.api';
import { usersKeys } from './users.keys';
import type { UsersListFilters } from '../model/user.types';

export function useUsersQuery(filters: UsersListFilters = {}) {
  const normalized: UsersListFilters = {
    q: filters.q?.trim() || undefined,
    active: filters.active,
    roleId: filters.roleId,
  };

  return useQuery({
    queryKey: usersKeys.list(normalized),
    queryFn: () => fetchUsers(normalized),
  });
}

export function useUserRoleOptionsQuery() {
  return useQuery({
    queryKey: usersKeys.roleOptions(),
    queryFn: fetchUserRoleOptions,
  });
}

export function useAssignableRolesQuery(enabled = true) {
  return useQuery({
    queryKey: usersKeys.assignableRoles(),
    queryFn: fetchAssignableRoles,
    enabled,
  });
}

export function useUserQuery(id: number | null) {
  return useQuery({
    queryKey: usersKeys.detail(id ?? 0),
    queryFn: () => fetchUser(id!),
    enabled: typeof id === 'number' && id > 0,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: usersKeys.all,
    mutationFn: (payload: CreateUserRequest) => createUserApi(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: usersKeys.all,
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserRequest }) =>
      updateUserApi(id, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: usersKeys.detail(variables.id),
      });
    },
  });
}

export function useSetUserActiveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: usersKeys.all,
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      setUserActiveApi(id, active),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: usersKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: usersKeys.all,
    mutationFn: (id: number) => deleteUserApi(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
}
