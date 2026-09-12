import { useEffect, useRef, useState } from 'react';
import { Button } from '@primereact/ui/button';
import { cn } from '@gamification/shared-utils/utils/cn';
import { useClientMissionsQuery } from '../api/use-clients';
import { ClienteCard } from '../components/cliente-card';
import { FilterChip } from '../components/filter-chip';
import { ModuleLoader } from '@gamification/shared-ui/components/module-loader';
import type { ClienteMisionEstado } from '../model/cliente.types';

type ClienteMisionesPanelProps = {
  clientSearchId: string;
};

const PERIOD_OPTIONS = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: 'all', label: 'Todo el historial' },
] as const;

const ESTADO_OPTIONS: { id: ClienteMisionEstado; label: string }[] = [
  { id: 'completado', label: 'Completado' },
  { id: 'incompleto', label: 'Incompleto' },
];

const periodSelectClass =
  ' h-10 appearance-none rounded-full border border-slate-300 bg-white bg-size-[12px] bg-position-[right_0.9rem_center] bg-no-repeat px-4 pr-9 text-sm leading-none font-medium text-slate-600 outline-none focus:border-slate-400';

const periodSelectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%2364748b' d='M1 1.2 5 5.2 9 1.2'/%3E%3C/svg%3E")`,
};

const ROW_ACTION_CLASS =
  'rounded-lg! border-brand! bg-white! px-3! py-1.5! text-sm! font-medium! text-brand! shadow-none! hover:border-brand-hover! hover:bg-brand/5! hover:text-brand-hover!';

type MisionEstadoBadgeProps = {
  status: ClienteMisionEstado;
};

function MisionEstadoBadge({ status }: MisionEstadoBadgeProps) {
  const isCompletado = status === 'completado';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide uppercase',
        isCompletado ? 'bg-success text-white' : 'bg-warning text-ink',
      )}
    >
      {isCompletado ? 'Completado' : 'Incompleto'}
    </span>
  );
}

export function ClienteMisionesPanel({
  clientSearchId,
}: ClienteMisionesPanelProps) {
  const missionsQuery = useClientMissionsQuery(clientSearchId);
  const misiones = missionsQuery.data ?? [];
  const [period, setPeriod] =
    useState<(typeof PERIOD_OPTIONS)[number]['value']>('7d');
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftEstadoEnabled, setDraftEstadoEnabled] = useState(false);
  const [draftEstado, setDraftEstado] =
    useState<ClienteMisionEstado>('completado');
  const [appliedEstado, setAppliedEstado] =
    useState<ClienteMisionEstado | null>(null);
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

  const visibleMisiones = appliedEstado
    ? misiones.filter((mision) => mision.status === appliedEstado)
    : misiones;

  if (missionsQuery.isLoading) {
    return <ModuleLoader variant="section" label="Cargando misiones" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h3 className="font-gobold text-sm tracking-wide text-slate-800 uppercase">
            Misiones del cliente
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
            aria-label="Periodo de misiones"
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
                aria-label="Filtrar misiones por estado"
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
                    setDraftEstado(event.target.value as ClienteMisionEstado)
                  }
                  className="mt-3  h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white bg-size-[12px] bg-position-[right_0.9rem_center] bg-no-repeat px-3 pr-9 text-sm font-medium text-slate-700 outline-none disabled:text-slate-400"
                  style={periodSelectStyle}
                  aria-label="Estado de la misión"
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

      <ClienteCard className="overflow-hidden p-0!">
        <div className="overflow-x-auto">
          <table className="w-full min-w-215 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Nombre de la misión
                </th>
                <th className="px-4 py-3 text-center font-semibold">Estado</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Fecha de inscripción
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleMisiones.map((mision, index) => (
                <tr
                  key={mision.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#eef3f7]/70'}
                >
                  <td className="px-4 py-3 text-slate-700">{mision.id}</td>
                  <td className="px-4 py-3 text-center font-medium text-slate-800">
                    {mision.name}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <MisionEstadoBadge status={mision.status} />
                  </td>
                  <td className="px-4 py-3 text-center text-slate-700">
                    {mision.enrolledAt}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        className={ROW_ACTION_CLASS}
                      >
                        Abrir en web
                      </Button>
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        className={ROW_ACTION_CLASS}
                      >
                        Ir a la misión
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleMisiones.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    No hay misiones para el filtro seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ClienteCard>
    </div>
  );
}
