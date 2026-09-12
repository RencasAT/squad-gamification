import { describe, expect, it } from 'vitest';
import { dayjs } from '@gamification/shared-utils/lib/dayjs';
import {
  formatMonthLabel,
  getMonthWeeks,
  layoutWeekEvents,
  startOfIsoWeek,
} from '@gamification/atenea-gamificacion-dashboard/calendar-utils';
import type { ExperienceEvent } from '@gamification/atenea-gamificacion-dashboard/dashboard.types';

describe('calendar-utils', () => {
  it('alinea el inicio de semana al lunes', () => {
    const sunday = dayjs('2026-07-05');
    expect(startOfIsoWeek(sunday).format('YYYY-MM-DD')).toBe('2026-06-29');
  });

  it('arma julio 2026 empezando el lunes 29 de junio', () => {
    const weeks = getMonthWeeks(dayjs('2026-07-01'));
    expect(weeks[0]?.[0]?.format('YYYY-MM-DD')).toBe('2026-06-29');
    expect(weeks.at(-1)?.[6]?.format('YYYY-MM-DD')).toBe('2026-08-02');
  });

  it('formatea el mes en español con mayúscula inicial', () => {
    expect(formatMonthLabel(dayjs('2026-07-01'))).toBe('Julio 2026');
  });

  it('coloca eventos superpuestos en carriles distintos', () => {
    const week = Array.from({ length: 7 }, (_, index) =>
      dayjs('2026-06-29').add(index, 'day'),
    );
    const events: ExperienceEvent[] = [
      {
        id: 'a',
        label: 'Torneo Champions',
        category: 'torneos',
        start: '2026-06-29',
        end: '2026-07-03',
      },
      {
        id: 'b',
        label: 'Arena PvP Semanal',
        category: 'arenas',
        start: '2026-07-03',
        end: '2026-07-04',
      },
    ];

    const layout = layoutWeekEvents(week, events);
    const champions = layout.find((item) => item.event.id === 'a');
    const arena = layout.find((item) => item.event.id === 'b');

    expect(champions).toMatchObject({ startCol: 0, span: 5, lane: 0 });
    expect(arena).toMatchObject({ startCol: 4, span: 2, lane: 1 });
  });
});
