import { useState } from 'react';
import type { Dayjs } from 'dayjs';
import { dayjs } from '@gamification/shared-utils/lib/dayjs';
import { cn } from '@gamification/shared-utils/utils/cn';
import {
  formatMonthLabel,
  getMonthWeeks,
  layoutWeekEvents,
  startOfIsoWeek,
  WEEK_DAY_LABELS,
  type WeekEventLayout,
} from './calendar-utils';
import { CATEGORY_STYLES } from './category-styles';
import { DashboardCard } from './dashboard-card';
import { EXPERIENCE_EVENTS } from './dashboard.mock';
import {
  EXPERIENCE_CATEGORIES,
  type CalendarView,
  type ExperienceCategory,
} from './dashboard.types';

const VIEW_OPTIONS: { id: CalendarView; label: string }[] = [
  { id: 'month', label: 'Mes' },
  { id: 'week', label: 'Semana' },
  { id: 'day', label: 'Día' },
];

function EventBar({
  item,
  compact = false,
}: {
  item: WeekEventLayout;
  compact?: boolean;
}) {
  const style = CATEGORY_STYLES[item.event.category];
  const laneOffset = compact ? 26 : 22;
  const laneHeight = compact ? 22 : 20;

  return (
    <div
      title={item.event.label}
      className="pointer-events-auto absolute truncate rounded-md px-2 text-[11px] leading-5 font-medium"
      style={{
        top: laneOffset + item.lane * laneHeight,
        left: `calc(${(item.startCol / 7) * 100}% + 4px)`,
        width: `calc(${(item.span / 7) * 100}% - 8px)`,
        backgroundColor: style.bg,
        color: style.text,
      }}
    >
      {item.event.label}
    </div>
  );
}

function MonthGrid({
  weeks,
  cursor,
  events,
}: {
  weeks: Dayjs[][];
  cursor: Dayjs;
  events: typeof EXPERIENCE_EVENTS;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="grid grid-cols-7 bg-slate-50">
        {WEEK_DAY_LABELS.map((label) => (
          <div
            key={label}
            className="border-b border-slate-200 px-2 py-2 text-center text-xs font-semibold text-slate-500"
          >
            {label}
          </div>
        ))}
      </div>

      {weeks.map((week) => {
        const placed = layoutWeekEvents(week, events);
        const lanes = placed.reduce(
          (max, item) => Math.max(max, item.lane + 1),
          1,
        );

        return (
          <div
            key={week[0]?.format('YYYY-MM-DD')}
            className="relative"
            style={{ minHeight: Math.max(80, 28 + lanes * 20) }}
          >
            <div className="grid grid-cols-7">
              {week.map((day, index) => {
                const inMonth = day.month() === cursor.month();
                return (
                  <div
                    key={day.format('YYYY-MM-DD')}
                    className={cn(
                      'min-h-20 border-t border-slate-200 p-1',
                      index < 6 && 'border-r',
                    )}
                  >
                    <span
                      className={cn(
                        'text-xs',
                        inMonth ? 'text-slate-500' : 'text-slate-300',
                      )}
                    >
                      {day.date()}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute inset-0">
              {placed.map((item) => (
                <EventBar key={item.event.id} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WeekGrid({
  week,
  events,
}: {
  week: Dayjs[];
  events: typeof EXPERIENCE_EVENTS;
}) {
  const placed = layoutWeekEvents(week, events);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="grid grid-cols-7 bg-slate-50">
        {week.map((day, index) => (
          <div
            key={day.format('YYYY-MM-DD')}
            className="border-b border-slate-200 px-2 py-2 text-center text-xs font-semibold text-slate-500"
          >
            {WEEK_DAY_LABELS[index]} {day.date()}
          </div>
        ))}
      </div>
      <div className="relative min-h-40">
        <div className="grid h-full min-h-40 grid-cols-7">
          {week.map((day, index) => (
            <div
              key={day.format('YYYY-MM-DD')}
              className={cn(index < 6 && 'border-r border-slate-200')}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 pt-1">
          {placed.map((item) => (
            <EventBar key={item.event.id} item={item} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

function DayAgenda({
  day,
  events,
}: {
  day: Dayjs;
  events: typeof EXPERIENCE_EVENTS;
}) {
  const dayEvents = events.filter(
    (event) =>
      !dayjs(event.end).isBefore(day, 'day') &&
      !dayjs(event.start).isAfter(day, 'day'),
  );

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="mb-3 text-sm font-semibold text-slate-700">
        {day.format('dddd D [de] MMMM YYYY')}
      </p>
      {dayEvents.length === 0 ? (
        <p className="text-sm text-slate-400">No hay experiencias este día.</p>
      ) : (
        <ul className="space-y-2">
          {dayEvents.map((event) => {
            const style = CATEGORY_STYLES[event.category];
            return (
              <li
                key={event.id}
                className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2"
              >
                <span
                  className="h-8 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: style.bg }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {event.label}
                  </p>
                  <p className="text-xs text-slate-500">
                    {dayjs(event.start).format('DD/MM/YYYY')} —{' '}
                    {dayjs(event.end).format('DD/MM/YYYY')}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function ExperiencesCalendar() {
  const [cursor, setCursor] = useState(() => dayjs('2026-07-01'));
  const [view, setView] = useState<CalendarView>('month');
  const [activeCategories, setActiveCategories] = useState<
    ExperienceCategory[]
  >([...EXPERIENCE_CATEGORIES]);

  const visibleEvents = EXPERIENCE_EVENTS.filter((event) =>
    activeCategories.includes(event.category),
  );

  const weeks = getMonthWeeks(cursor);
  const week = Array.from({ length: 7 }, (_, index) =>
    startOfIsoWeek(cursor).add(index, 'day'),
  );

  const shift = (direction: -1 | 1) => {
    const unit = view === 'month' ? 'month' : view === 'week' ? 'week' : 'day';
    setCursor((current) => current.add(direction, unit));
  };

  const toggleCategory = (category: ExperienceCategory) => {
    setActiveCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const periodLabel =
    view === 'month'
      ? formatMonthLabel(cursor)
      : view === 'week'
        ? `${week[0]?.format('DD/MM')} — ${week[6]?.format('DD/MM/YYYY')}`
        : cursor.format('DD [de] MMMM YYYY');

  return (
    <DashboardCard>
      <h2 className="font-gobold mb-4 text-lg tracking-wide text-slate-800">
        Calendario de experiencias
      </h2>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <button
              type="button"
              aria-label="Periodo anterior"
              onClick={() => shift(-1)}
              className="rounded-md p-1.5 hover:bg-slate-100"
            >
              <i className="pi pi-chevron-left text-xs" />
            </button>
            <span className="min-w-32 text-center font-medium capitalize">
              {periodLabel}
            </span>
            <button
              type="button"
              aria-label="Periodo siguiente"
              onClick={() => shift(1)}
              className="rounded-md p-1.5 hover:bg-slate-100"
            >
              <i className="pi pi-chevron-right text-xs" />
            </button>
          </div>

          <div
            className="flex overflow-hidden rounded-lg border border-slate-200 text-xs"
            role="tablist"
            aria-label="Vista del calendario"
          >
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={view === option.id}
                onClick={() => setView(option.id)}
                className={cn(
                  'px-3 py-1.5 font-medium transition-colors',
                  view === option.id
                    ? 'bg-slate-100 text-slate-800'
                    : 'text-slate-500 hover:bg-slate-50',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_CATEGORIES.map((category) => {
            const style = CATEGORY_STYLES[category];
            const active = activeCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCategory(category)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold transition-opacity',
                  active ? 'opacity-100' : 'opacity-40',
                )}
                style={{
                  backgroundColor: style.bg,
                  color: style.text,
                }}
              >
                {style.label}
              </button>
            );
          })}
        </div>
      </div>

      {view === 'month' && (
        <MonthGrid weeks={weeks} cursor={cursor} events={visibleEvents} />
      )}
      {view === 'week' && <WeekGrid week={week} events={visibleEvents} />}
      {view === 'day' && <DayAgenda day={cursor} events={visibleEvents} />}
    </DashboardCard>
  );
}
