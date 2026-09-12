import type {
  DailyLog,
  ExperienceEvent,
  WeeklyGgrPoint,
} from './dashboard.types';

export const EXPERIENCE_EVENTS: ExperienceEvent[] = [
  {
    id: 'torneo-champions',
    label: 'Torneo Champions',
    category: 'torneos',
    start: '2026-06-29',
    end: '2026-07-03',
  },
  {
    id: 'arena-pvp-semanal',
    label: 'Arena PvP Semanal',
    category: 'arenas',
    start: '2026-07-03',
    end: '2026-07-04',
  },
  {
    id: 'carrera-relampago',
    label: 'Carrera Relámpago',
    category: 'carreras',
    start: '2026-07-07',
    end: '2026-07-09',
  },
  {
    id: 'torneo-batalla-final',
    label: 'Torneo Batalla por la Final',
    category: 'torneos',
    start: '2026-07-15',
    end: '2026-07-18',
  },
  {
    id: 'mision-ruta-ajuste',
    label: 'Misión Ruta del Ajuste',
    category: 'misiones',
    start: '2026-07-16',
    end: '2026-07-19',
  },
  {
    id: 'arena-elite-nocturna',
    label: 'Arena Élite Nocturna',
    category: 'arenas',
    start: '2026-07-22',
    end: '2026-07-23',
  },
  {
    id: 'carrera-dominical',
    label: 'Carrera Dominical',
    category: 'carreras',
    start: '2026-07-25',
    end: '2026-07-26',
  },
  {
    id: 'mision-semanal',
    label: 'Misión Semanal',
    category: 'misiones',
    start: '2026-07-20',
    end: '2026-07-22',
  },
  {
    id: 'torneo-relampago',
    label: 'Torneo Relámpago',
    category: 'torneos',
    start: '2026-07-28',
    end: '2026-07-31',
  },
];

export const WEEKLY_GGR_POINTS: WeeklyGgrPoint[] = [
  {
    date: '2026-07-06',
    apuestas: 8_200_000,
    premios: 3_400_000,
    total: 11_600_000,
  },
  {
    date: '2026-07-07',
    apuestas: 19_500_000,
    premios: 7_800_000,
    total: 27_300_000,
  },
  {
    date: '2026-07-08',
    apuestas: 12_400_000,
    premios: 5_100_000,
    total: 17_500_000,
  },
  {
    date: '2026-07-09',
    apuestas: 23_800_000,
    premios: 9_600_000,
    total: 33_400_000,
  },
  {
    date: '2026-07-10',
    apuestas: 16_200_000,
    premios: 6_900_000,
    total: 23_100_000,
  },
  {
    date: '2026-07-11',
    apuestas: 41_500_000,
    premios: 21_800_000,
    total: 63_300_000,
  },
  {
    date: '2026-07-12',
    apuestas: 7_600_000,
    premios: 3_200_000,
    total: 10_800_000,
  },
  {
    date: '2026-07-13',
    apuestas: 21_400_000,
    premios: 9_100_000,
    total: 30_500_000,
  },
];

export const DAILY_LOGS: DailyLog[] = Array.from({ length: 6 }, (_, index) => ({
  id: `log-${index + 1}`,
  client: 'pilar.milla',
  date: '13/07/2026 16:50:39',
  eventId: 'torneo-vibra-con-casino',
  eventName: 'torneo-vibra-con-casino',
}));
