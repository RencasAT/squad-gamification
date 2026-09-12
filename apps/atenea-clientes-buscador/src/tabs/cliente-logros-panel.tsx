import { useEffect, useRef, useState } from 'react';
import { Button } from '@primereact/ui/button';
import { cn } from '@gamification/shared-utils/utils/cn';
import medallaImg from '@gamification/shared-ui/assets/img/medalla.png';
import { useClientAchievementsQuery } from '../api/use-clients';
import { ClienteCard } from '../components/cliente-card';
import { FilterChip } from '../components/filter-chip';
import { ModuleLoader } from '@gamification/shared-ui/components/module-loader';
import type { ClienteLogro } from '../model/cliente.types';

type ClienteLogrosPanelProps = {
  clientSearchId: string;
};

type LogroEstadoFilter = 'completado' | 'pendiente';

const PERIOD_OPTIONS = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: 'all', label: 'Todo el historial' },
] as const;

const ESTADO_OPTIONS: { id: LogroEstadoFilter; label: string }[] = [
  { id: 'completado', label: 'Completado' },
  { id: 'pendiente', label: 'Pendiente' },
];

const periodSelectClass =
  ' h-10 appearance-none rounded-full border border-slate-300 bg-white bg-size-[12px] bg-position-[right_0.9rem_center] bg-no-repeat px-4 pr-9 text-sm leading-none font-medium text-slate-600 outline-none focus:border-slate-400';

const periodSelectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%2364748b' d='M1 1.2 5 5.2 9 1.2'/%3E%3C/svg%3E")`,
};

type LogroMedalProps = {
  acquired: boolean;
  progress?: number;
};

function LogroMedal({ acquired, progress }: LogroMedalProps) {
  const size = 72;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, progress ?? 0));
  const showProgress = !acquired && pct > 0 && pct < 100;
  const offset = circumference * (1 - pct / 100);

  return (
    <div className="relative h-18 w-18 shrink-0">
      {showProgress ? (
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e8eef4"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e30613"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
      ) : null}
      <img
        src={medallaImg}
        alt=""
        aria-hidden
        className={cn(
          'h-full w-full object-contain p-1',
          !acquired && 'filter-[grayscale(1)_brightness(0.55)_contrast(1.05)]',
        )}
      />
      {showProgress ? (
        <span className="absolute -right-0.5 -bottom-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
          {pct}%
        </span>
      ) : null}
    </div>
  );
}

type LogroCardProps = {
  logro: ClienteLogro;
};

function LogroCard({ logro }: LogroCardProps) {
  return (
    <ClienteCard as="article" className="flex items-center gap-4 p-4!">
      <LogroMedal acquired={logro.acquired} progress={logro.progress} />
      <div className="min-w-0">
        <h4 className="text-base font-bold text-slate-900">{logro.title}</h4>
        <p className="mt-1 text-sm leading-snug text-slate-400">
          {logro.description}
        </p>
      </div>
    </ClienteCard>
  );
}

export function ClienteLogrosPanel({
  clientSearchId,
}: ClienteLogrosPanelProps) {
  const achievementsQuery = useClientAchievementsQuery(clientSearchId);
  const logros = achievementsQuery.data ?? [];
  const [period, setPeriod] =
    useState<(typeof PERIOD_OPTIONS)[number]['value']>('7d');
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftEstadoEnabled, setDraftEstadoEnabled] = useState(false);
  const [draftEstado, setDraftEstado] =
    useState<LogroEstadoFilter>('completado');
  const [appliedEstado, setAppliedEstado] = useState<LogroEstadoFilter | null>(
    null,
  );
  const filterRef = useRef<HTMLDivElement>(null);
  const hasFilter = appliedEstado !== null;

  useEffect(() => {
    if (!filterOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
        setDraftEstadoEnabled(appliedEstado !== null);
        setDraftEstado(appliedEstado ?? 'completado');
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [filterOpen, appliedEstado]);

  const onClearFilter = () => {
    setDraftEstadoEnabled(false);
    setDraftEstado('completado');
    setAppliedEstado(null);
    setFilterOpen(false);
  };

  const onApplyFilter = () => {
    setAppliedEstado(draftEstadoEnabled ? draftEstado : null);
    setFilterOpen(false);
  };

  const openFilter = () => {
    setDraftEstadoEnabled(appliedEstado !== null);
    setDraftEstado(appliedEstado ?? 'completado');
    setFilterOpen((open) => !open);
  };

  const visibleLogros = logros.filter((logro) => {
    if (!appliedEstado) {
      return true;
    }
    if (appliedEstado === 'completado') {
      return logro.acquired;
    }
    return !logro.acquired;
  });

  if (achievementsQuery.isLoading) {
    return <ModuleLoader variant="section" label="Cargando logros" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h3 className="font-gobold text-sm tracking-wide text-slate-800 uppercase">
            Logros del cliente
          </h3>
          {appliedEstado ? (
            <div className="flex flex-wrap gap-2">
              <FilterChip
                label={
                  ESTADO_OPTIONS.find((item) => item.id === appliedEstado)
                    ?.label ?? appliedEstado
                }
                onRemove={onClearFilter}
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={period}
            onChange={(event) =>
              setPeriod(
                event.target.value as (typeof PERIOD_OPTIONS)[number]['value'],
              )
            }
            className={periodSelectClass}
            style={periodSelectStyle}
            aria-label="Periodo de logros"
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={openFilter}
              className={cn(
                ' inline-flex h-10 items-center gap-2 rounded-full border bg-white px-4 text-sm leading-none transition-colors',
                hasFilter
                  ? 'border-brand font-semibold text-brand'
                  : 'border-slate-300 font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50',
              )}
              aria-expanded={filterOpen}
              aria-haspopup="dialog"
            >
              <i className="pi pi-filter text-sm" />
              Filtrar
              {hasFilter ? (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Quitar filtro"
                  className="inline-flex"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClearFilter();
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      event.stopPropagation();
                      onClearFilter();
                    }
                  }}
                >
                  <i className="pi pi-times text-xs" />
                </span>
              ) : null}
            </button>

            {filterOpen && (
              <div
                role="dialog"
                aria-label="Filtrar logros por estado"
                className="absolute top-[calc(100%+0.5rem)] right-0 z-20 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_28px_rgba(15,23,42,0.14)]"
              >
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={draftEstadoEnabled}
                    onChange={(event) =>
                      setDraftEstadoEnabled(event.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden
                    className={cn(
                      'flex h-4.5 w-4.5 items-center justify-center rounded-sm border',
                      draftEstadoEnabled
                        ? 'border-brand bg-brand text-white'
                        : 'border-slate-300 bg-white',
                    )}
                  >
                    {draftEstadoEnabled ? (
                      <i className="pi pi-check text-[10px] leading-none" />
                    ) : null}
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    Estado
                  </span>
                </label>

                <select
                  value={draftEstado}
                  disabled={!draftEstadoEnabled}
                  onChange={(event) =>
                    setDraftEstado(event.target.value as LogroEstadoFilter)
                  }
                  className="mt-3  h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white bg-size-[12px] bg-position-[right_0.9rem_center] bg-no-repeat px-3 pr-9 text-sm font-medium text-slate-700 outline-none disabled:text-slate-400"
                  style={periodSelectStyle}
                  aria-label="Estado del logro"
                >
                  {ESTADO_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={onClearFilter}
                    className="text-sm font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Borrar
                  </button>
                  <Button
                    type="button"
                    onClick={onApplyFilter}
                    className="rounded-xl! border-0! bg-brand! px-4! text-sm! font-semibold! text-white! hover:bg-brand-hover!"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleLogros.map((logro) => (
          <LogroCard key={logro.id} logro={logro} />
        ))}
        {visibleLogros.length === 0 && (
          <ClienteCard className="col-span-full">
            <p className="text-sm text-slate-400">
              No hay logros para el filtro seleccionado.
            </p>
          </ClienteCard>
        )}
      </div>
    </div>
  );
}
