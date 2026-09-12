import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchCampaignRachas,
  fetchFeaturedRachas,
  setCampaignRachaActiveApi,
} from './rachas.api';
import { rachasKeys } from './rachas.keys';
import type { RachasListFilters } from '../model/racha.types';

function normalize(filters: RachasListFilters): RachasListFilters {
  return {
    q: filters.q?.trim() || undefined,
    active: filters.active,
  };
}

export function useFeaturedRachasQuery(filters: RachasListFilters = {}) {
  const normalized = normalize(filters);
  return useQuery({
    queryKey: rachasKeys.featured(normalized),
    queryFn: () => fetchFeaturedRachas(normalized),
  });
}

export function useCampaignRachasQuery(filters: RachasListFilters = {}) {
  const normalized = normalize(filters);
  return useQuery({
    queryKey: rachasKeys.campaigns(normalized),
    queryFn: () => fetchCampaignRachas(normalized),
  });
}

export function useSetCampaignRachaActiveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: rachasKeys.all,
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      setCampaignRachaActiveApi(id, active),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: rachasKeys.all });
    },
  });
}
