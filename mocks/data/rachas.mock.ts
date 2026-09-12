import type {
  CampaignRacha,
  FeaturedRacha,
  RachaMonthlyPoint,
} from '@gamification/atenea-contenido-rachas/model/racha.types';

const MONTHS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
] as const;

function seriesFromValues(
  values: number[],
  labels: Partial<Record<(typeof MONTHS)[number], string>> = {},
): RachaMonthlyPoint[] {
  return MONTHS.map((month, index) => ({
    month,
    value: values[index] ?? 0,
    label: labels[month],
  }));
}

const loginSeries = seriesFromValues(
  [
    4_000, 2_800, 9_500, 11_000, 7_200, 8_000, 10_500, 6_800, 12_000, 14_500,
    17_800, 13_200,
  ],
  { Feb: 'S/2.8K', Nov: 'S/17.8K' },
);

const apuestaSeries = seriesFromValues(
  [
    3_200, 5_100, 6_400, 8_800, 9_200, 7_500, 11_000, 10_200, 13_500, 15_000,
    16_200, 12_800,
  ],
  { Abr: 'S/8.8K', Oct: 'S/15K' },
);

export const featuredRachasSeed: FeaturedRacha[] = [
  {
    id: 1,
    name: 'Racha login',
    tags: ['Diaria'],
    activePlayersLabel: '10 M',
    maxStreakLabel: '100 DÍAS',
    lostToday: 500,
    monthlySeries: loginSeries,
    yearLabel: 'Año 2026',
    pendingClaims: 20,
    active: true,
  },
  {
    id: 2,
    name: 'Apuesta diaria min. S/5.00',
    tags: ['Casino y Deportivas', 'Diaria'],
    activePlayersLabel: '10 M',
    maxStreakLabel: '100 DÍAS',
    lostToday: 500,
    monthlySeries: apuestaSeries,
    yearLabel: 'Año 2026',
    pendingClaims: 12,
    active: true,
  },
];

export const campaignRachasSeed: CampaignRacha[] = [
  {
    id: 1,
    name: 'Casinero Pragmatic',
    activePlayers: 5000,
    tipo: 'casino',
    lostPlayers: 250,
    active: true,
  },
  {
    id: 2,
    name: 'Promo apuesta tambo',
    activePlayers: 5000,
    tipo: 'deportivas',
    lostPlayers: 250,
    active: true,
  },
  {
    id: 3,
    name: 'Racha de misiones',
    activePlayers: 5000,
    tipo: 'misiones',
    lostPlayers: 250,
    active: true,
  },
  {
    id: 4,
    name: 'Apuesta Master - Mensual',
    activePlayers: 5000,
    tipo: 'deportivas',
    lostPlayers: 250,
    active: true,
  },
  {
    id: 5,
    name: 'Escuelita-Rachas-Diarias',
    activePlayers: 5000,
    tipo: 'misiones',
    lostPlayers: 250,
    active: true,
  },
  {
    id: 6,
    name: 'Promo casino off',
    activePlayers: 120,
    tipo: 'casino',
    lostPlayers: 40,
    active: false,
  },
];
