import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from '@primereact/ui/button';
import { FloatInput } from '@gamification/shared-ui/components/float-input';
import { ModuleLoader } from '@gamification/shared-ui/components/module-loader';
import { cn } from '@gamification/shared-utils/utils/cn';
import { isApiNotFound } from '@gamification/shared-utils/utils/get-api-error-message';
import { useClientQuery } from './api/use-clients';
import { ClienteCard } from './components/cliente-card';
import { ClienteNoEncontrado } from './components/cliente-no-encontrado';
import { ClientePerfilCard } from './components/cliente-perfil-card';
import { ClienteSectionTabs } from './components/cliente-section-tabs';
import type { ClienteTabId } from './model/cliente.types';
import { ClienteGruposPanel } from './tabs/cliente-grupos-panel';
import { ClienteLogrosPanel } from './tabs/cliente-logros-panel';
import { ClienteMisionesPanel } from './tabs/cliente-misiones-panel';
import { ClienteResumenPanel } from './tabs/cliente-resumen-panel';
import { ClienteTorneosPanel } from './tabs/cliente-torneos-panel';

export function BusquedaClientesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const numParam = searchParams.get('num')?.trim() ?? '';

  const [query, setQuery] = useState(numParam);
  const [prevNumParam, setPrevNumParam] = useState(numParam);
  const [activeTab, setActiveTab] = useState<ClienteTabId>('resumen');

  if (numParam !== prevNumParam) {
    setPrevNumParam(numParam);
    setQuery(numParam);
  }

  const clientQuery = useClientQuery(numParam);
  const cliente = clientQuery.data ?? null;
  const isNotFound =
    Boolean(numParam) &&
    clientQuery.isError &&
    isApiNotFound(clientQuery.error);
  const isGenericError =
    Boolean(numParam) && clientQuery.isError && !isNotFound;
  const inputInvalid = isNotFound && query.trim() === numParam;
  const canSearch = query.trim().length > 0;

  const applySearch = (term: string) => {
    const next = term.trim();
    if (!next) {
      return;
    }
    setActiveTab('resumen');
    setSearchParams({ num: next });
  };

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    applySearch(query);
  };

  const onOpenInNewTab = () => {
    const term = query.trim();
    if (!term) {
      return;
    }
    const url = `${window.location.origin}/clientes/busqueda?num=${encodeURIComponent(term)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-screen-2xl flex-col gap-4">
      <ClienteCard>
        <h2 className="mb-4 flex items-center gap-2 text-[15px] tracking-wide text-slate-800 uppercase">
          <i className="pi pi-search text-[13px]" aria-hidden />
          <span className="font-gobold">Búsqueda de clientes</span>
        </h2>

        <form onSubmit={onSearch} className="flex flex-wrap items-center gap-3">
          <div className="min-w-56 max-w-md flex-1 basis-56">
            <FloatInput
              id="cliente-busqueda"
              label="ID del cliente, N° de DNI"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              invalid={inputInvalid}
              size="lg"
            />
          </div>

          <Button
            type="submit"
            disabled={!canSearch}
            className={cn(
              'h-12! w-39.25! min-w-39.25! shrink-0! justify-center rounded-xl! border-0! px-5! text-sm! font-semibold! whitespace-nowrap!',
              canSearch
                ? 'bg-brand! text-white! shadow-none! hover:bg-brand-hover!'
                : 'bg-[#F5F5F5]! text-slate-400! shadow-[0_1px_2px_rgba(15,23,42,0.08)]! hover:bg-[#F5F5F5]! disabled:opacity-100!',
            )}
          >
            Buscar
          </Button>
          <Button
            type="button"
            variant="outlined"
            disabled={!canSearch}
            onClick={onOpenInNewTab}
            className={cn(
              'h-12! w-46.25! min-w-46.25! shrink-0! justify-center rounded-xl! px-4! text-sm! font-medium! whitespace-nowrap!',
              canSearch
                ? 'border-brand! bg-white! text-brand! shadow-none! hover:border-brand-hover! hover:bg-brand/5! hover:text-brand-hover!'
                : 'border-transparent! bg-[#F5F5F5]! text-slate-400! shadow-[0_1px_2px_rgba(15,23,42,0.08)]! hover:bg-[#F5F5F5]! disabled:opacity-100!',
            )}
          >
            Abrir en nueva pestaña
          </Button>
        </form>
      </ClienteCard>

      {numParam && clientQuery.isLoading && (
        <ModuleLoader variant="section" label="Cargando cliente" />
      )}

      {isNotFound && (
        <div className="flex flex-1 items-center justify-center py-20">
          <ClienteNoEncontrado />
        </div>
      )}

      {isGenericError && (
        <ClienteCard>
          <p className="text-sm text-red-500">
            No se pudo cargar el cliente. Intentá de nuevo.
          </p>
        </ClienteCard>
      )}

      {cliente && (
        <>
          <ClientePerfilCard cliente={cliente} />

          <ClienteSectionTabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'resumen' ? (
            <ClienteResumenPanel
              key={`${cliente.num}-resumen`}
              clientSearchId={numParam}
            />
          ) : activeTab === 'grupos' ? (
            <ClienteGruposPanel
              key={`${cliente.num}-grupos`}
              clientSearchId={numParam}
              clientId={cliente.clientId}
            />
          ) : activeTab === 'logros' ? (
            <ClienteLogrosPanel
              key={`${cliente.num}-logros`}
              clientSearchId={numParam}
            />
          ) : activeTab === 'torneos' ? (
            <ClienteTorneosPanel
              key={`${cliente.num}-torneos`}
              clientSearchId={numParam}
            />
          ) : (
            <ClienteMisionesPanel
              key={`${cliente.num}-misiones`}
              clientSearchId={numParam}
            />
          )}
        </>
      )}
    </div>
  );
}
