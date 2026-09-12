import { useEffect, useRef, useState } from 'react';
import { Button } from '@primereact/ui/button';
import { cn } from '@gamification/shared-utils/utils/cn';
import { useClientTournamentsQuery } from '../api/use-clients';
import { ClienteCard } from '../components/cliente-card';
import { FilterChip } from '../components/filter-chip';
import { ModuleLoader } from '@gamification/shared-ui/components/module-loader';
import type { ClienteTorneoTipo } from '../model/cliente.types';

type ClienteTorneosPanelProps = {
  clientSearchId: string;
};

const PERIOD_OPTIONS = [
  { value: '7d', label: 'Últimos 7 días' },
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: 'all', label: 'Todo el historial' },
] as const;

const TIPO_OPTIONS: {
  id: ClienteTorneoTipo;
  label: string;
  chip: string;
}[] = [
  { id: 'carrera', label: 'Carrera', chip: 'Carrera' },
  { id: 'torneo', label: 'Torneo', chip: 'Torneos' },
  { id: 'arena', label: 'Arena', chip: 'Arena' },
];

const periodSelectClass =
  ' h-10 appearance-none rounded-full border border-slate-300 bg-white bg-size-[12px] bg-[right_0.9rem_center] bg-no-repeat px-4 pr-9 text-sm leading-none font-medium text-slate-600 outline-none focus:border-slate-400';

const periodSelectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%2364748b' d='M1 1.2 5 5.2 9 1.2'/%3E%3C/svg%3E")`,
};

const ROW_ACTION_CLASS =
  'rounded-lg! border-brand! bg-white! px-3! py-1.5! text-sm! font-medium! text-brand! shadow-none! hover:border-brand-hover! hover:bg-brand/5! hover:text-brand-hover!';

const TIPO_BADGE: Record<
  ClienteTorneoTipo,
  { label: string; icon: string; className: string; action: string }
> = {
  carrera: {
    label: 'Carrera',
    icon: 'pi-flag',
    className: 'bg-warning text-ink',
    action: 'Ir a la carrera',
  },
  torneo: {
    label: 'Torneo',
    icon: 'pi-trophy',
    className: 'bg-ink text-white',
    action: 'Ir al torneo',
  },
  arena: {
    label: 'Arena',
    icon: 'pi-shield',
    className: 'bg-[#003399] text-white',
    action: 'Ir a la arena',
  },
};

type TorneoTipoBadgeProps = {
  type: ClienteTorneoTipo;
};

function TorneoTipoBadge({ type }: TorneoTipoBadgeProps) {
  const config = TIPO_BADGE[type];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide uppercase',
        config.className,
      )}
    >
      <i className={cn('pi text-[11px]', config.icon)} aria-hidden />
      {config.label}
    </span>
  );
}

export function ClienteTorneosPanel({
  clientSearchId,
}: ClienteTorneosPanelProps) {
  const tournamentsQuery = useClientTournamentsQuery(clientSearchId);
  const torneos = tournamentsQuery.data ?? [];
  const [period, setPeriod] =
    useState<(typeof PERIOD_OPTIONS)[number]['value']>('7d');
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftTipos, setDraftTipos] = useState<ClienteTorneoTipo[]>([]);
  const [appliedTipos, setAppliedTipos] = useState<ClienteTorneoTipo[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

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
        setDraftTipos(appliedTipos);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [filterOpen, appliedTipos]);

  const toggleDraftTipo = (tipo: ClienteTorneoTipo) => {
    setDraftTipos((prev) =>
      prev.includes(tipo)
        ? prev.filter((item) => item !== tipo)
        : [...prev, tipo],
    );
  };

  const onClearFilter = () => {
    setDraftTipos([]);
    setAppliedTipos([]);
    setFilterOpen(false);
  };

  const removeTipo = (tipo: ClienteTorneoTipo) => {
    const next = appliedTipos.filter((item) => item !== tipo);
    setAppliedTipos(next);
    setDraftTipos(next);
  };

  const onApplyFilter = () => {
    setAppliedTipos(draftTipos);
    setFilterOpen(false);
  };

  const openFilter = () => {
    setDraftTipos(appliedTipos);
    setFilterOpen((open) => !open);
  };

  const visibleTorneos =
    appliedTipos.length === 0
      ? torneos
      : torneos.filter((torneo) => appliedTipos.includes(torneo.type));

  if (tournamentsQuery.isLoading) {
    return <ModuleLoader variant="section" label="Cargando torneos" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h3 className="font-gobold text-sm tracking-wide text-slate-800 uppercase">
            Torneos del cliente
          </h3>
          {appliedTipos.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {appliedTipos.map((tipo) => {
                const option = TIPO_OPTIONS.find((item) => item.id === tipo);
                return (
                  <FilterChip
                    key={tipo}
                    label={option?.chip ?? option?.label ?? tipo}
                    onRemove={() => removeTipo(tipo)}
                  />
                );
              })}
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
            aria-label="Periodo de torneos"
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
                appliedTipos.length > 0
                  ? 'border-brand font-semibold text-brand'
                  : 'border-slate-300 font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50',
              )}
              aria-expanded={filterOpen}
              aria-haspopup="dialog"
            >
              <i className="pi pi-filter text-sm" />
              Filtrar
              {appliedTipos.length > 0 ? (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Quitar filtros"
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
                aria-label="Filtrar torneos por tipo"
                className="absolute top-[calc(100%+0.5rem)] right-0 z-20 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_28px_rgba(15,23,42,0.14)]"
              >
                <div className="flex items-center gap-2.5 px-4 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-600 text-white">
                    <i className="pi pi-check text-xs" />
                  </span>
                  <p className="text-sm font-bold text-slate-800">
                    Tipo de torneo
                  </p>
                </div>

                <div className="bg-[#e8f0fa] px-4 py-3">
                  <div className="space-y-2">
                    {TIPO_OPTIONS.map((option) => {
                      const checked = draftTipos.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleDraftTipo(option.id)}
                          className={cn(
                            'flex h-11 w-full items-center gap-3 rounded-xl border bg-white px-3 text-left text-sm transition-colors',
                            checked
                              ? 'border-sky-400 text-slate-800'
                              : 'border-slate-200 text-slate-500 hover:border-slate-300',
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border',
                              checked
                                ? 'border-slate-600 bg-slate-600 text-white'
                                : 'border-slate-300 bg-white',
                            )}
                          >
                            {checked && (
                              <i className="pi pi-check text-[10px]" />
                            )}
                          </span>
                          <span className="flex-1 font-medium">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={onClearFilter}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Borrar
                  </button>
                  <Button
                    type="button"
                    onClick={onApplyFilter}
                    className="rounded-xl! border-0! bg-slate-600! px-4! text-sm! font-semibold! text-white! hover:bg-slate-700!"
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
          <table className="w-full min-w-205 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Nombre del torneo
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  Nº de participantes
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  Tipo de torneo
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleTorneos.map((torneo, index) => (
                <tr
                  key={torneo.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#eef3f7]/70'}
                >
                  <td className="px-4 py-3 text-slate-700">{torneo.id}</td>
                  <td className="px-4 py-3 text-center font-medium text-slate-800">
                    {torneo.name}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-slate-800">
                    {torneo.participants.toLocaleString('es-PE')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TorneoTipoBadge type={torneo.type} />
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
                        {TIPO_BADGE[torneo.type].action}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleTorneos.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    No hay torneos para el filtro seleccionado.
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
