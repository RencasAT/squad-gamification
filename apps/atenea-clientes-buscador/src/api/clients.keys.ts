export const clientsKeys = {
  all: ['clients'] as const,
  detail: (id: string) => [...clientsKeys.all, 'detail', id] as const,
  summary: (id: string) => [...clientsKeys.all, 'summary', id] as const,
  groups: (id: string) => [...clientsKeys.all, 'groups', id] as const,
  achievements: (id: string) =>
    [...clientsKeys.all, 'achievements', id] as const,
  tournaments: (id: string) => [...clientsKeys.all, 'tournaments', id] as const,
  missions: (id: string) => [...clientsKeys.all, 'missions', id] as const,
  catalog: () => [...clientsKeys.all, 'groups-catalog'] as const,
};
