import { useQuery } from '@tanstack/react-query';
import { fetchPermissions } from './permissions.api';
import { permissionsKeys } from './permissions.keys';

type UsePermissionsQueryOptions = {
  enabled?: boolean;
};

export function usePermissionsQuery(options: UsePermissionsQueryOptions = {}) {
  return useQuery({
    queryKey: permissionsKeys.list(),
    queryFn: fetchPermissions,
    staleTime: 5 * 60 * 1000,
    enabled: options.enabled ?? true,
  });
}
