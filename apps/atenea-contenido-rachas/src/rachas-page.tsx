import { useState } from 'react';
import { Button } from '@primereact/ui/button';
import { FloatInput } from '@gamification/shared-ui/components/float-input';
import { cn } from '@gamification/shared-utils/utils/cn';
import {
  useCampaignRachasQuery,
  useFeaturedRachasQuery,
  useSetCampaignRachaActiveMutation,
} from './api/use-rachas';
import { FeaturedRachasCarousel } from './components/featured-rachas-carousel';
import { RachasCard } from './components/rachas-card';
import { RachasTable } from './components/rachas-table';
import { CrearRachaDrawer } from './drawers/crear-racha-drawer';
import type { CampaignRacha, RachaStatusFilter } from './model/racha.types';

export function RachasPage() {
  const [query, setQuery] = useState('');
  const [statusTab, setStatusTab] = useState<RachaStatusFilter>('active');
  const [createOpen, setCreateOpen] = useState(false);

  const filters = {
    q: query,
    active: statusTab === 'active',
  };

  const featuredQuery = useFeaturedRachasQuery(filters);
  const campaignsQuery = useCampaignRachasQuery(filters);
  const setActiveMutation = useSetCampaignRachaActiveMutation();

  const featured = featuredQuery.data ?? [];
  const campaigns = campaignsQuery.data ?? [];

  const onToggleActive = (racha: CampaignRacha) => {
    void setActiveMutation.mutateAsync({
      id: racha.id,
      active: !racha.active,
    });
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-screen-2xl flex-col gap-4">
      <RachasCard>
        <h2 className="mb-4 flex items-center gap-2 text-[15px] tracking-wide text-slate-800 uppercase">
          <i
            className="pi pi-th-large size-5 text-xl leading-none"
            aria-hidden
          />
          <span className="font-gobold">Gestión de rachas</span>
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <RachasCard className="p-1! rounded-3xl! bg-[#F1F1F1]! shadow-none!">
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Estado de rachas"
            >
              <button
                type="button"
                role="tab"
                aria-selected={statusTab === 'active'}
                onClick={() => setStatusTab('active')}
                className={cn(
                  'min-h-10 rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
                  statusTab === 'active'
                    ? 'border border-ink bg-ink text-white'
                    : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
                )}
              >
                Rachas activas
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={statusTab === 'inactive'}
                onClick={() => setStatusTab('inactive')}
                className={cn(
                  'min-h-10 rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
                  statusTab === 'inactive'
                    ? 'border border-ink bg-ink text-white'
                    : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
                )}
              >
                Rachas no activas
              </button>
            </div>
          </RachasCard>

          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-3">
            <div className="min-w-56 w-full max-w-xs sm:w-auto">
              <FloatInput
                id="rachas-busqueda"
                label="Nombre de racha"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoComplete="off"
                size="lg"
              />
            </div>
            <Button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="h-12! shrink-0! justify-center rounded-xl! border-0! bg-ink! px-5! text-sm! font-semibold! whitespace-nowrap! text-white! shadow-none! hover:bg-slate-800!"
            >
              Crear racha
            </Button>
          </div>
        </div>
      </RachasCard>

      <FeaturedRachasCarousel
        items={featured}
        isLoading={featuredQuery.isLoading}
      />

      <div className="flex flex-col gap-3">
        <h3 className="font-gobold text-sm tracking-wide text-slate-800 uppercase">
          Rachas de campañas
        </h3>

        <RachasCard className="overflow-hidden rounded-2xl p-0!">
          <RachasTable
            items={campaigns}
            isLoading={campaignsQuery.isLoading}
            onToggleActive={onToggleActive}
            onReport={() => undefined}
            onEdit={() => undefined}
          />
        </RachasCard>
      </div>

      <CrearRachaDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
