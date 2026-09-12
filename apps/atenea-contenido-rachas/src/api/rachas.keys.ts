import type { RachasListFilters } from '../model/racha.types';

export const rachasKeys = {
  all: ['rachas'] as const,
  featured: (filters: RachasListFilters) =>
    [
      ...rachasKeys.all,
      'featured',
      filters.q?.trim() ?? '',
      filters.active ?? 'all',
    ] as const,
  campaigns: (filters: RachasListFilters) =>
    [
      ...rachasKeys.all,
      'campaigns',
      filters.q?.trim() ?? '',
      filters.active ?? 'all',
    ] as const,
};
