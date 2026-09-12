import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isApiNotFound } from '@gamification/shared-utils/utils/get-api-error-message';
import {
  addClientGroupsApi,
  fetchClient,
  fetchClientAchievements,
  fetchClientGroups,
  fetchClientMissions,
  fetchClientSummary,
  fetchClientTournaments,
  fetchGroupsCatalog,
  removeClientGroupApi,
} from './clients.api';
import { clientsKeys } from './clients.keys';

function trimmedId(id: string): string {
  return id.trim();
}

export function useClientQuery(id: string) {
  const trimmed = trimmedId(id);
  return useQuery({
    queryKey: clientsKeys.detail(trimmed),
    queryFn: () => fetchClient(trimmed),
    enabled: Boolean(trimmed),
    retry: (failureCount, error) =>
      isApiNotFound(error) ? false : failureCount < 2,
  });
}

export function useClientSummaryQuery(id: string) {
  const trimmed = trimmedId(id);
  return useQuery({
    queryKey: clientsKeys.summary(trimmed),
    queryFn: () => fetchClientSummary(trimmed),
    enabled: Boolean(trimmed),
  });
}

export function useClientGroupsQuery(id: string) {
  const trimmed = trimmedId(id);
  return useQuery({
    queryKey: clientsKeys.groups(trimmed),
    queryFn: () => fetchClientGroups(trimmed),
    enabled: Boolean(trimmed),
  });
}

export function useClientAchievementsQuery(id: string) {
  const trimmed = trimmedId(id);
  return useQuery({
    queryKey: clientsKeys.achievements(trimmed),
    queryFn: () => fetchClientAchievements(trimmed),
    enabled: Boolean(trimmed),
  });
}

export function useClientTournamentsQuery(id: string) {
  const trimmed = trimmedId(id);
  return useQuery({
    queryKey: clientsKeys.tournaments(trimmed),
    queryFn: () => fetchClientTournaments(trimmed),
    enabled: Boolean(trimmed),
  });
}

export function useClientMissionsQuery(id: string) {
  const trimmed = trimmedId(id);
  return useQuery({
    queryKey: clientsKeys.missions(trimmed),
    queryFn: () => fetchClientMissions(trimmed),
    enabled: Boolean(trimmed),
  });
}

export function useGroupsCatalogQuery(enabled = true) {
  return useQuery({
    queryKey: clientsKeys.catalog(),
    queryFn: fetchGroupsCatalog,
    enabled,
  });
}

export function useAddClientGroupsMutation(clientId: string) {
  const queryClient = useQueryClient();
  const trimmed = trimmedId(clientId);

  return useMutation({
    mutationFn: (groupIds: number[]) => addClientGroupsApi(trimmed, groupIds),
    onSuccess: async (groups) => {
      queryClient.setQueryData(clientsKeys.groups(trimmed), groups);
      await queryClient.invalidateQueries({
        queryKey: clientsKeys.detail(trimmed),
      });
    },
  });
}

export function useRemoveClientGroupMutation(clientId: string) {
  const queryClient = useQueryClient();
  const trimmed = trimmedId(clientId);

  return useMutation({
    mutationFn: (groupId: number) => removeClientGroupApi(trimmed, groupId),
    onSuccess: async (groups) => {
      queryClient.setQueryData(clientsKeys.groups(trimmed), groups);
      await queryClient.invalidateQueries({
        queryKey: clientsKeys.detail(trimmed),
      });
    },
  });
}
