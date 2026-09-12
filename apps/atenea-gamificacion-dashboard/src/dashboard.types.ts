export const EXPERIENCE_CATEGORIES = [
  'torneos',
  'arenas',
  'carreras',
  'misiones',
] as const;

export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number];

export type CalendarView = 'month' | 'week' | 'day';

export type ExperienceEvent = {
  id: string;
  label: string;
  category: ExperienceCategory;
  start: string;
  end: string;
};

export type WeeklyGgrPoint = {
  date: string;
  apuestas: number;
  premios: number;
  total: number;
};

export type DailyLog = {
  id: string;
  client: string;
  date: string;
  eventId: string;
  eventName: string;
};
