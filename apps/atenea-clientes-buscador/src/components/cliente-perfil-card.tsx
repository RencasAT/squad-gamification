import type { ClienteDetalle } from '../model/cliente.types';
import { ClienteCard } from './cliente-card';

type ClientePerfilCardProps = {
  cliente: ClienteDetalle;
};

export function ClientePerfilCard({ cliente }: ClientePerfilCardProps) {
  return (
    <ClienteCard className="flex items-center justify-between gap-6">
      <div className="flex min-w-0 items-center gap-4">
        <div
          aria-hidden
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400"
        >
          <i className="pi pi-user text-2xl" />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-slate-900">
            {cliente.name}
          </h3>
          <p className="mt-0.5 text-sm text-slate-400">ID {cliente.clientId}</p>
        </div>
      </div>

      <div className="shrink-0 text-right text-sm leading-snug">
        <p className="text-slate-400">{cliente.lastLoginLabel}</p>
        <p className="mt-0.5 text-slate-400">
          Registrado el{' '}
          <span className="font-bold text-slate-600">
            {cliente.registeredAtDate}
          </span>
        </p>
      </div>
    </ClienteCard>
  );
}
