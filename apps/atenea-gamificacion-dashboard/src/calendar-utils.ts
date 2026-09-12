import type { Dayjs } from 'dayjs';
import { dayjs } from '@gamification/shared-utils/lib/dayjs';
import type { ExperienceEvent } from './dashboard.types';

export const WEEK_DAY_LABELS = [
  'Lun',
  'Mar',
  'Mié',
  'Jue',
  'Vie',
  'Sáb',
  'Dom',
] as const;

export function startOfIsoWeek(date: Dayjs): Dayjs {
  const weekday = date.day();
  const offset = weekday === 0 ? 6 : weekday - 1;
  return date.startOf('day').subtract(offset, 'day');
}

export function formatMonthLabel(date: Dayjs): string {
  const raw = date.format('MMMM YYYY');
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function getMonthWeeks(month: Dayjs): Dayjs[][] {
  const start = startOfIsoWeek(month.startOf('month'));
  const last = startOfIsoWeek(month.endOf('month'));
  const weeks: Dayjs[][] = [];

  for (
    let weekStart = start;
    !weekStart.isAfter(last, 'day');
    weekStart = weekStart.add(7, 'day')
  ) {
    weeks.push(
      Array.from({ length: 7 }, (_, index) => weekStart.add(index, 'day')),
    );
  }

  return weeks;
}

export function eventOverlapsRange(
  event: ExperienceEvent,
  from: Dayjs,
  to: Dayjs,
): boolean {
  const start = dayjs(event.start);
  const end = dayjs(event.end);
  return !end.isBefore(from, 'day') && !start.isAfter(to, 'day');
}

export type WeekEventLayout = {
  event: ExperienceEvent;
  startCol: number;
  span: number;
  lane: number;
};

export function layoutWeekEvents(
  weekDays: Dayjs[],
  events: ExperienceEvent[],
): WeekEventLayout[] {
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  if (!weekStart || !weekEnd) {
    return [];
  }

  const overlapping = events
    .filter((event) => eventOverlapsRange(event, weekStart, weekEnd))
    .map((event) => {
      const start = dayjs(event.start).isBefore(weekStart, 'day')
        ? weekStart
        : dayjs(event.start);
      const end = dayjs(event.end).isAfter(weekEnd, 'day')
        ? weekEnd
        : dayjs(event.end);

      return {
        event,
        startCol: start.diff(weekStart, 'day'),
        span: end.diff(start, 'day') + 1,
      };
    })
    .sort((a, b) => a.startCol - b.startCol || b.span - a.span);

  const laneEnds: number[] = [];

  return overlapping.map((item) => {
    let lane = laneEnds.findIndex((end) => end < item.startCol);

    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(item.startCol + item.span - 1);
    } else {
      laneEnds[lane] = item.startCol + item.span - 1;
    }

    return { ...item, lane };
  });
}
