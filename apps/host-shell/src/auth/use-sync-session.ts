import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_USER_KEY } from './auth.constants';

/**
 * Si el admin asigna roles a un usuario, refetch `/me`.
 * Mutar el catálogo de roles no cambia el token: la sesión se mantiene.
 */
export function useSyncSessionOnAdminChanges() {
  const queryClient = useQueryClient();

  useEffect(() => {
    return queryClient.getMutationCache().subscribe((event) => {
      if (event.type !== 'updated') {
        return;
      }
      if (event.action.type !== 'success') {
        return;
      }

      const root = event.mutation.options.mutationKey?.[0];
      if (root !== 'users') {
        return;
      }

      void queryClient.invalidateQueries({ queryKey: AUTH_USER_KEY });
    });
  }, [queryClient]);
}
