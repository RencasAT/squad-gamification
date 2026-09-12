import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRoleApi,
  deleteRoleApi,
  fetchRole,
  fetchRoles,
  updateRoleApi,
  type CreateRoleRequest,
  type UpdateRoleRequest,
} from './roles.api';
import { rolesKeys } from './roles.keys';

export function useRolesQuery(query = '') {
  return useQuery({
    queryKey: rolesKeys.list(query.trim()),
    queryFn: () => fetchRoles(query.trim() || undefined),
  });
}

export function useRoleQuery(id: number | null) {
  return useQuery({
    queryKey: rolesKeys.detail(id ?? 0),
    queryFn: () => fetchRole(id!),
    enabled: typeof id === 'number' && id > 0,
  });
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: rolesKeys.all,
    mutationFn: (payload: CreateRoleRequest) => createRoleApi(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
    },
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: rolesKeys.all,
    mutationFn: ({ id, payload }: { id: number; payload: UpdateRoleRequest }) =>
      updateRoleApi(id, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      await queryClient.invalidateQueries({
        queryKey: rolesKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: rolesKeys.all,
    mutationFn: (id: number) => deleteRoleApi(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
    },
  });
}
