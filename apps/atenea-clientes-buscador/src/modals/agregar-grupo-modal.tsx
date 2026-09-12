import { useState, type FormEvent } from 'react';
import { Button } from '@primereact/ui/button';
import { FloatInput } from '@gamification/shared-ui/components/float-input';
import { cn } from '@gamification/shared-utils/utils/cn';
import { useGroupsCatalogQuery } from '../api/use-clients';
import type { ClienteGrupo } from '../model/cliente.types';

type GroupCheckboxProps = {
  checked: boolean;
  label: string;
  onToggle: () => void;
};

function GroupCheckbox({ checked, label, onToggle }: GroupCheckboxProps) {
  return (
    <label
      className="relative inline-flex cursor-pointer items-center"
      onClick={(event) => event.stopPropagation()}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        onClick={(event) => event.stopPropagation()}
        className="peer sr-only"
        aria-label={label}
      />
      <span
        aria-hidden
        className={cn(
          'flex h-4.5 w-4.5 items-center justify-center rounded-sm border',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40',
          checked
            ? 'border-brand bg-brand text-white'
            : 'border-slate-300 bg-white',
        )}
      >
        {checked ? (
          <i className="pi pi-check text-[10px] leading-none" />
        ) : null}
      </span>
    </label>
  );
}

type AgregarGrupoModalProps = {
  open: boolean;
  assignedGroupIds: number[];
  onClose: () => void;
  onAdd: (grupos: ClienteGrupo[]) => void;
};

export function AgregarGrupoModal({
  open,
  assignedGroupIds,
  onClose,
  onAdd,
}: AgregarGrupoModalProps) {
  const catalogQuery = useGroupsCatalogQuery(open);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSearch('');
      setSelectedIds([]);
    }
  }

  if (!open) {
    return null;
  }

  const catalog = catalogQuery.data ?? [];
  const availableGroups = catalog.filter(
    (grupo) => !assignedGroupIds.includes(grupo.id),
  );

  const normalizedSearch = search.trim().toLowerCase();
  const filteredGroups = availableGroups.filter((grupo) => {
    if (!normalizedSearch) {
      return true;
    }
    return (
      grupo.name.toLowerCase().includes(normalizedSearch) ||
      String(grupo.id).includes(normalizedSearch)
    );
  });

  const toggleGroup = (groupId: number) => {
    setSelectedIds((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (selectedIds.length === 0) {
      return;
    }
    const selectedGroups = availableGroups.filter((grupo) =>
      selectedIds.includes(grupo.id),
    );
    onAdd(selectedGroups);
    onClose();
  };

  const canSubmit = selectedIds.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-slate-900/45"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="agregar-grupo-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="mb-1 flex items-start justify-between gap-3">
          <h2
            id="agregar-grupo-title"
            className="font-gobold text-base tracking-wide text-slate-800 uppercase"
          >
            Selecciona los grupos
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <i className="pi pi-times text-sm" />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-500">
          Solo se mostrarán los grupos donde el cliente no este participando.
        </p>

        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <FloatInput
            type="search"
            label="Buscar grupo por nombre o ID"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoComplete="off"
          />

          <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-slate-200">
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-white text-slate-600">
                  <tr className="border-b border-slate-200">
                    <th className="w-10 px-3 py-3" />
                    <th className="px-3 py-3 font-semibold">ID</th>
                    <th className="px-3 py-3 text-center font-semibold">
                      Nombre del grupo
                    </th>
                    <th className="px-3 py-3 text-center font-semibold">
                      N° de participantes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGroups.map((grupo, index) => {
                    const isSelected = selectedIds.includes(grupo.id);
                    return (
                      <tr
                        key={grupo.id}
                        onClick={() => toggleGroup(grupo.id)}
                        className={cn(
                          'cursor-pointer border-b border-slate-100 last:border-b-0',
                          index % 2 === 0 ? 'bg-white' : 'bg-[#eef3f7]/80',
                          'hover:bg-slate-50',
                        )}
                      >
                        <td className="px-3 py-3">
                          <GroupCheckbox
                            checked={isSelected}
                            label={`Seleccionar ${grupo.name}`}
                            onToggle={() => toggleGroup(grupo.id)}
                          />
                        </td>
                        <td className="px-3 py-3 text-slate-700">{grupo.id}</td>
                        <td className="px-3 py-3 text-center font-medium text-slate-800">
                          {grupo.name}
                        </td>
                        <td className="px-3 py-3 text-center font-semibold text-slate-800">
                          {grupo.participants.toLocaleString('es-PE')}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredGroups.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-8 text-center text-slate-400"
                      >
                        {availableGroups.length === 0
                          ? 'El cliente ya está en todos los grupos disponibles.'
                          : 'No hay grupos que coincidan con la búsqueda.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              'h-11! w-full! justify-center rounded-xl! border-0! text-sm! font-semibold! shadow-none!',
              canSubmit
                ? 'bg-brand! text-white! hover:bg-brand-hover!'
                : 'bg-[#F5F5F5]! text-slate-400! hover:bg-[#F5F5F5]! disabled:opacity-100!',
            )}
          >
            Agregar usuario a los grupos
          </Button>
        </form>
      </div>
    </div>
  );
}
