export type RachaStatusFilter = 'active' | 'inactive';

export type CampaignRachaTipo = 'casino' | 'deportivas' | 'misiones';

export type RachaMonthlyPoint = {
  month: string;
  value: number;
  label?: string;
};

export type FeaturedRacha = {
  id: number;
  name: string;
  tags: string[];
  activePlayersLabel: string;
  maxStreakLabel: string;
  lostToday: number;
  monthlySeries: RachaMonthlyPoint[];
  yearLabel: string;
  pendingClaims: number;
  active: boolean;
};

export type CampaignRacha = {
  id: number;
  name: string;
  activePlayers: number;
  tipo: CampaignRachaTipo;
  lostPlayers: number;
  active: boolean;
};

export type RachasListFilters = {
  q?: string;
  active?: boolean;
};

export const CAMPAIGN_TIPO_LABEL: Record<CampaignRachaTipo, string> = {
  casino: 'Casino',
  deportivas: 'Deportivas',
  misiones: 'Misiones',
};
