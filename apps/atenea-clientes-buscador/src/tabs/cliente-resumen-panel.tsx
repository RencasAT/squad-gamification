import { useClientSummaryQuery } from '../api/use-clients';
import { ClienteCard } from '../components/cliente-card';
import { ModuleLoader } from '@gamification/shared-ui/components/module-loader';
import {
  ClienteMetricIcon,
  type ClienteMetricIconName,
} from '../components/cliente-metric-icon';
import type { ClienteMetric } from '../model/cliente.types';

const DEPORTIVAS_ICONS: Record<string, ClienteMetricIconName> = {
  'Deporte más apostado': 'soccer',
  'Cuota promedio': 'odds',
  'Apostado total': 'wallet',
  'GGR Deportivas': 'chart',
};

const CASINO_ICONS: Record<string, ClienteMetricIconName> = {
  'Maquina más jugada': 'star',
  'Tipo de maquinas más jugadas': 'slots',
  'N° de maquinas jugadas': 'ticket',
  'GGR Casino': 'chart',
};

type MetricCardProps = {
  metric: ClienteMetric;
  icon: ClienteMetricIconName;
};

function MetricCard({ metric, icon }: MetricCardProps) {
  return (
    <ClienteCard as="article">
      <ClienteMetricIcon name={icon} className="mb-3" />
      <p className="text-lg font-bold text-slate-900">{metric.value}</p>
      <p className="mt-1 text-sm text-slate-400">{metric.label}</p>
    </ClienteCard>
  );
}

type SectionTitleProps = {
  children: string;
};

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h3 className="font-gobold mb-3 text-sm tracking-wide text-slate-800 uppercase">
      {children}
    </h3>
  );
}

type ClienteResumenPanelProps = {
  clientSearchId: string;
};

export function ClienteResumenPanel({
  clientSearchId,
}: ClienteResumenPanelProps) {
  const summaryQuery = useClientSummaryQuery(clientSearchId);
  const resumen = summaryQuery.data;

  if (summaryQuery.isLoading) {
    return <ModuleLoader variant="section" label="Cargando resumen" />;
  }

  if (summaryQuery.isError || !resumen) {
    return (
      <ClienteCard>
        <p className="text-sm text-red-500">No se pudo cargar el resumen.</p>
      </ClienteCard>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <SectionTitle>Información de deportivas</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {resumen.deportivas.map((metric) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              icon={DEPORTIVAS_ICONS[metric.label] ?? 'chart'}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Información de casino</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {resumen.casino.map((metric) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              icon={CASINO_ICONS[metric.label] ?? 'star'}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Tipo de jugador</SectionTitle>
        <ClienteCard as="article" className="flex items-start gap-4">
          <ClienteMetricIcon name="pin" className="mt-0.5 h-7 w-7" />
          <div className="min-w-0">
            <p className="text-base font-bold text-slate-900">
              {resumen.tipoJugador.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {resumen.tipoJugador.description}
            </p>
          </div>
        </ClienteCard>
      </section>
    </div>
  );
}
