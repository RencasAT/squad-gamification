import { useState } from 'react';
import { Button } from '@primereact/ui/button';
import { cn } from '@gamification/shared-utils/utils/cn';
import { TableRowsLoader } from '@gamification/shared-ui/components/module-loader';
import {
  useAddClientGroupsMutation,
  useClientGroupsQuery,
  useRemoveClientGroupMutation,
} from '../api/use-clients';
import { ClienteCard } from '../components/cliente-card';
import { AgregarGrupoModal } from '../modals/agregar-grupo-modal';
import { ConfirmarAgregarGruposModal } from '../modals/confirmar-agregar-grupos-modal';
import { QuitarGrupoModal } from '../modals/quitar-grupo-modal';
import type { ClienteGrupo, ClienteGrupoRiesgo } from '../model/cliente.types';

type ClienteGruposPanelProps = {
  /** ID usado en la URL/API (`?num=`). */
  clientSearchId: string;
  clientId: string;
};

const RISK_BADGE_CLASS: Record<ClienteGrupoRiesgo, string> = {
  bajo: 'bg-success',
  medio: 'bg-warning',
  alto: 'bg-brand',
};

const ROW_ACTION_CLASS =
  'rounded-lg! border-brand! bg-white! px-3! py-1.5! text-sm! font-medium! text-brand! shadow-none! hover:border-brand-hover! hover:bg-brand/5! hover:text-brand-hover!';

function RiskBadge({ risk }: { risk: ClienteGrupoRiesgo }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-md px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase',
        RISK_BADGE_CLASS[risk],
      )}
    >
      {risk}
    </span>
  );
}

export function ClienteGruposPanel({
  clientSearchId,
  clientId,
}: ClienteGruposPanelProps) {
  const groupsQuery = useClientGroupsQuery(clientSearchId);
  const addGroupsMutation = useAddClientGroupsMutation(clientSearchId);
  const removeGroupMutation = useRemoveClientGroupMutation(clientSearchId);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [gruposToAdd, setGruposToAdd] = useState<ClienteGrupo[]>([]);
  const [grupoToRemove, setGrupoToRemove] = useState<ClienteGrupo | null>(null);

  const grupos = groupsQuery.data ?? [];

  const onConfirmRemove = () => {
    if (!grupoToRemove) {
      return;
    }
    void removeGroupMutation.mutateAsync(grupoToRemove.id).then(() => {
      setGrupoToRemove(null);
    });
  };

  const onConfirmAdd = async () => {
    const groupIds = gruposToAdd.map((grupo) => grupo.id);
    if (groupIds.length === 0) {
      return;
    }
    await addGroupsMutation.mutateAsync(groupIds);
  };

  const onAdd = (grupos: ClienteGrupo[]) => {
    setGruposToAdd(grupos);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-gobold text-sm tracking-wide text-slate-800 uppercase">
          Grupos de clientes
        </h3>
        <Button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="rounded-xl! border-0! bg-brand! px-4! text-sm! font-semibold! text-white! shadow-sm! hover:bg-brand-hover!"
        >
          Agregar a grupo
        </Button>
      </div>

      <ClienteCard className="overflow-hidden p-0!">
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Nombre del grupo
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  N° de participantes
                </th>
                <th className="px-4 py-3 text-center font-semibold">Riesgo</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {groupsQuery.isLoading && (
                <TableRowsLoader columns={5} rows={6} />
              )}
              {!groupsQuery.isLoading &&
                grupos.map((grupo, index) => (
                  <tr
                    key={grupo.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#eef3f7]/70'}
                  >
                    <td className="px-4 py-3 text-slate-700">{grupo.id}</td>
                    <td className="px-4 py-3 text-center font-medium text-slate-800">
                      {grupo.name}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-800">
                      {grupo.participants.toLocaleString('es-PE')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <RiskBadge risk={grupo.risk} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <Button
                          type="button"
                          size="small"
                          variant="outlined"
                          className={ROW_ACTION_CLASS}
                          onClick={() => setGrupoToRemove(grupo)}
                        >
                          Quitar
                        </Button>
                        <Button
                          type="button"
                          size="small"
                          variant="outlined"
                          className={ROW_ACTION_CLASS}
                        >
                          Ir al grupo
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!groupsQuery.isLoading && grupos.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-slate-400"
                  >
                    El cliente no pertenece a ningún grupo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </ClienteCard>

      <AgregarGrupoModal
        open={addModalOpen}
        assignedGroupIds={grupos.map((grupo) => grupo.id)}
        onClose={() => setAddModalOpen(false)}
        onAdd={onAdd}
      />

      <ConfirmarAgregarGruposModal
        open={gruposToAdd.length > 0}
        clientId={clientId}
        grupos={gruposToAdd}
        onClose={() => setGruposToAdd([])}
        onConfirm={onConfirmAdd}
      />

      <QuitarGrupoModal
        open={Boolean(grupoToRemove)}
        clientId={clientId}
        grupo={grupoToRemove}
        onClose={() => setGrupoToRemove(null)}
        onConfirm={onConfirmRemove}
      />
    </div>
  );
}
