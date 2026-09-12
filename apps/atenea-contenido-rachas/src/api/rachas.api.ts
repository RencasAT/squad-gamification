import { http } from '@gamification/shared-utils/api/http';
import type {
  CampaignRacha,
  FeaturedRacha,
  RachasListFilters,
} from '../model/racha.types';

type ListFeaturedResponse = {
  data: FeaturedRacha[];
};

type ListCampaignsResponse = {
  data: CampaignRacha[];
};

type CampaignResponse = {
  data: CampaignRacha;
};

function toParams(filters: RachasListFilters) {
  return {
    q: filters.q?.trim() || undefined,
    active: filters.active === undefined ? undefined : String(filters.active),
  };
}

export async function fetchFeaturedRachas(
  filters: RachasListFilters = {},
): Promise<FeaturedRacha[]> {
  const { data } = await http.get<ListFeaturedResponse>('/rachas/featured', {
    params: toParams(filters),
  });
  return data.data;
}

export async function fetchCampaignRachas(
  filters: RachasListFilters = {},
): Promise<CampaignRacha[]> {
  const { data } = await http.get<ListCampaignsResponse>('/rachas/campaigns', {
    params: toParams(filters),
  });
  return data.data;
}

export async function setCampaignRachaActiveApi(
  id: number,
  active: boolean,
): Promise<CampaignRacha> {
  const { data } = await http.patch<CampaignResponse>(
    `/rachas/campaigns/${id}/active`,
    { active },
  );
  return data.data;
}
