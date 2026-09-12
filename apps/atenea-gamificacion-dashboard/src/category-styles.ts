import type { ExperienceCategory } from './dashboard.types';

export const CATEGORY_STYLES: Record<
  ExperienceCategory,
  { label: string; bg: string; text: string }
> = {
  torneos: { label: 'Torneos', bg: '#111827', text: '#ffffff' },
  arenas: { label: 'Arenas', bg: '#2563eb', text: '#ffffff' },
  carreras: { label: 'Carreras', bg: '#eab308', text: '#1c1917' },
  misiones: { label: 'Misiones', bg: '#94a3b8', text: '#ffffff' },
};
