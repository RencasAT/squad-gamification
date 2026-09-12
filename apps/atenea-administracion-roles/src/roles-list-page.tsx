import { lazy, Suspense, useEffect, useState } from 'react';
import { Button } from '@primereact/ui/button';
import { HasRole } from '@gamification/shared-ui/has-role';
import { FloatInput } from '@gamification/shared-ui/components/float-input';
import { importWithChunkRetry } from '@gamification/shared-utils/utils/chunk-load';
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useRolesQuery,
  useUpdateRoleMutation,
} from './api/use-roles';
import { RolesCard } from './components/roles-card';
import { RolesTable } from './components/roles-table';
import { EliminarRolModal } from './modals/eliminar-rol-modal';
import type { RoleFormValues } from './model/role.types';

const RoleFormPanel = lazy(() =>
  importWithChunkRetry(() =>
    import('./drawers/role-form-panel').then((module) => ({
      default: module.RoleFormPanel,
    })),
  ),
);

export function RolesListPage() {
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [roleToEditId, setRoleToEditId] = useState<number | null>(null);
  const [drawerSession, setDrawerSession] = useState(0);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [highlightedRoleId, setHighlightedRoleId] = useState<number | null>(
    null,
  );

  const drawerOpen = createOpen || Boolean(roleToEditId);

  const rolesQuery = useRolesQuery(query);
  const createRoleMutation = useCreateRoleMutation();
  const updateRoleMutation = useUpdateRoleMutation();
  const deleteRoleMutation = useDeleteRoleMutation();

  const roles = rolesQuery.data ?? [];

  const openDrawer = (next: { create?: boolean; roleId?: number }) => {
    setDrawerSession((session) => session + 1);
    setDrawerMounted(true);
    if (typeof next.roleId === 'number') {
      setCreateOpen(false);
      setRoleToEditId(next.roleId);
      return;
    }
    setRoleToEditId(null);
    setCreateOpen(true);
  };

  const closeDrawer = () => {
    setCreateOpen(false);
    setRoleToEditId(null);
  };

  const onSaved = async (values: RoleFormValues) => {
    if (roleToEditId) {
      await updateRoleMutation.mutateAsync({
        id: roleToEditId,
        payload: values,
      });
      setHighlightedRoleId(roleToEditId);
      return;
    }

    const created = await createRoleMutation.mutateAsync(values);
    setHighlightedRoleId(created.id);
  };

  useEffect(() => {
    if (highlightedRoleId == null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHighlightedRoleId(null);
    }, 4000);

    return () => window.clearTimeout(timeoutId);
  }, [highlightedRoleId]);

  const onConfirmDelete = async () => {
    if (!roleToDelete) {
      return;
    }
    await deleteRoleMutation.mutateAsync(roleToDelete.id);
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-screen-2xl flex-col gap-4">
      <RolesCard>
        <h2 className="mb-4 flex items-center gap-2 text-[15px] tracking-wide text-slate-800 uppercase">
          <i className="pi pi-shield size-5 text-xl leading-none" aria-hidden />
          <span className="font-gobold">Gestión de roles</span>
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-56 w-full max-w-md sm:w-auto sm:flex-1">
            <FloatInput
              id="roles-busqueda"
              label="Buscar rol"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              size="lg"
            />
          </div>

          <HasRole role="roles">
            <Button
              type="button"
              onClick={() => openDrawer({ create: true })}
              className="ml-auto h-12! shrink-0! justify-center rounded-xl! border-0! bg-brand! px-5! text-sm! font-semibold! whitespace-nowrap! text-white! shadow-none! hover:bg-brand-hover!"
            >
              Crear nuevo rol
            </Button>
          </HasRole>
        </div>
      </RolesCard>

      <div className="flex flex-col gap-3">
        <h3 className="font-gobold text-sm tracking-wide text-slate-800 uppercase">
          Roles
        </h3>

        <RolesCard className="overflow-hidden rounded-2xl p-0!">
          <RolesTable
            roles={roles}
            isLoading={rolesQuery.isLoading}
            highlightedRoleId={highlightedRoleId}
            onDelete={setRoleToDelete}
            onEdit={(roleId) => openDrawer({ roleId })}
          />
        </RolesCard>
      </div>

      {drawerMounted ? (
        <Suspense fallback={null}>
          <RoleFormPanel
            key={drawerSession}
            open={drawerOpen}
            roleId={roleToEditId}
            sessionKey={drawerSession}
            onClose={closeDrawer}
            onSaved={onSaved}
          />
        </Suspense>
      ) : null}

      <EliminarRolModal
        open={Boolean(roleToDelete)}
        roleName={roleToDelete?.name ?? null}
        onClose={() => setRoleToDelete(null)}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
