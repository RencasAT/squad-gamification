import type {
  CampaignRacha,
  FeaturedRacha,
  RachasListFilters,
} from '@gamification/atenea-contenido-rachas/model/racha.types';
import { campaignRachasSeed, featuredRachasSeed } from '../data/rachas.mock';

let featured = structuredClone(featuredRachasSeed);
let campaigns = structuredClone(campaignRachasSeed);

function matchesQuery(name: string, q?: string) {
  const term = q?.trim().toLowerCase();
  if (!term) {
    return true;
  }
  return name.toLowerCase().includes(term);
}

function matchesActive(active: boolean, filter?: boolean) {
  if (filter === undefined) {
    return true;
  }
  return active === filter;
}

export function listFeaturedRachas(
  filters: RachasListFilters = {},
): FeaturedRacha[] {
  return featured.filter(
    (item) =>
      matchesActive(item.active, filters.active) &&
      matchesQuery(item.name, filters.q),
  );
}

export function listCampaignRachas(
  filters: RachasListFilters = {},
): CampaignRacha[] {
  return campaigns.filter(
    (item) =>
      matchesActive(item.active, filters.active) &&
      matchesQuery(item.name, filters.q),
  );
}

export function setCampaignRachaActive(
  id: number,
  active: boolean,
): CampaignRacha | null {
  const index = campaigns.findIndex((item) => item.id === id);
  if (index < 0) {
    return null;
  }
  campaigns[index] = { ...campaigns[index], active };
  return campaigns[index];
}

export function resetRachasStore() {
  featured = structuredClone(featuredRachasSeed);
  campaigns = structuredClone(campaignRachasSeed);
}
