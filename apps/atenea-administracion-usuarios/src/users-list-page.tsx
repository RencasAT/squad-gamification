import { useState } from 'react';
import { Button } from '@primereact/ui/button';
import { HasPermission } from '@gamification/shared-ui/has-permission';
import { PERMISSIONS } from '@gamification/shared-utils/permissions';
import { FloatInput } from '@gamification/shared-ui/components/float-input';
import { cn } from '@gamification/shared-utils/utils/cn';
import {
  useAssignableRolesQuery,
  useCreateUserMutation,
  useSetUserActiveMutation,
  useUpdateUserMutation,
  useUserRoleOptionsQuery,
  useUsersQuery,
} from './api/use-users';
import { UsersCard } from './components/users-card';
import { UsersTable } from './components/users-table';
import {
  CreateUserDrawer,
  type CreateUserFormValues,
} from './drawers/create-user-drawer';
import { DesactivarUsuarioModal } from './modals/desactivar-usuario-modal';
import type { BackofficeUser } from './model/user.types';

type StatusTab = 'active' | 'inactive';

const ROLE_SELECT_CLASS =
  ' h-10 appearance-none rounded-full border border-slate-300 bg-white bg-size-[12px] bg-position-[right_0.9rem_center] bg-no-repeat px-4 pr-9 text-sm leading-none font-medium text-slate-600 outline-none focus:border-slate-400';

const ROLE_SELECT_STYLE = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath fill='%2364748b' d='M1 1.2 5 5.2 9 1.2'/%3E%3C/svg%3E")`,
};

export function UsersListPage() {
  const [query, setQuery] = useState('');
  const [statusTab, setStatusTab] = useState<StatusTab>('active');
  const [roleId, setRoleId] = useState<number | 'all'>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [userToEditId, setUserToEditId] = useState<number | null>(null);
  const [userToToggle, setUserToToggle] = useState<BackofficeUser | null>(null);

  const usersQuery = useUsersQuery({
    q: query,
    active: statusTab === 'active',
    roleId: roleId === 'all' ? undefined : roleId,
  });
  const roleOptionsQuery = useUserRoleOptionsQuery();
  const assignableRolesQuery = useAssignableRolesQuery();
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const setUserActiveMutation = useSetUserActiveMutation();

  const users = usersQuery.data ?? [];
  const roleOptions = roleOptionsQuery.data ?? [];
  const assignableRoles = assignableRolesQuery.data ?? [];

  const onCreated = async (values: CreateUserFormValues) => {
    await createUserMutation.mutateAsync({
      email: values.email,
      roles: values.roles,
    });
  };

  const onUserSaved = async (values: CreateUserFormValues) => {
    if (!userToEditId) {
      return;
    }
    await updateUserMutation.mutateAsync({
      id: userToEditId,
      payload: {
        email: values.email,
        roles: values.roles,
      },
    });
    setUserToEditId(null);
  };

  const onConfirmToggleActive = async () => {
    if (!userToToggle) {
      return;
    }
    await setUserActiveMutation.mutateAsync({
      id: userToToggle.id,
      active: !userToToggle.active,
    });
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-screen-2xl flex-col gap-4">
      <UsersCard>
        <h2 className="mb-4 flex items-center gap-2 text-[15px] tracking-wide text-slate-800 uppercase">
          <i
            className="pi pi-user-plus size-5 text-xl leading-none"
            aria-hidden
          />
          <span className="font-gobold">Gestión de usuarios</span>
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-56 w-full max-w-md sm:w-auto sm:flex-1">
            <FloatInput
              id="usuarios-busqueda"
              label="ID del usuario, correo electrónico"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              size="lg"
            />
          </div>

          <HasPermission permission={PERMISSIONS.USUARIO_CREAR}>
            <Button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="ml-auto h-12! shrink-0! justify-center rounded-xl! border-0! bg-brand! px-5! text-sm! font-semibold! whitespace-nowrap! text-white! shadow-none! hover:bg-brand-hover!"
            >
              Crear nuevo usuario
            </Button>
          </HasPermission>
        </div>
      </UsersCard>

      <div className="flex flex-col gap-3">
        <h3 className="font-gobold text-sm tracking-wide text-slate-800 uppercase">
          Usuarios
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <UsersCard className="p-1! rounded-3xl! bg-[#F1F1F1]!">
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Estado de usuarios"
            >
              <button
                type="button"
                role="tab"
                aria-selected={statusTab === 'active'}
                onClick={() => setStatusTab('active')}
                className={cn(
                  'min-h-10 rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
                  statusTab === 'active'
                    ? 'border border-brand bg-brand text-white'
                    : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
                )}
              >
                Usuarios activos
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={statusTab === 'inactive'}
                onClick={() => setStatusTab('inactive')}
                className={cn(
                  'min-h-10 rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
                  statusTab === 'inactive'
                    ? 'border border-brand bg-brand text-white'
                    : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
                )}
              >
                Usuarios no activos
              </button>
            </div>
          </UsersCard>

          <select
            id="usuarios-filtro-rol"
            value={roleId === 'all' ? 'all' : String(roleId)}
            onChange={(event) => {
              const value = event.target.value;
              setRoleId(value === 'all' ? 'all' : Number(value));
            }}
            className={ROLE_SELECT_CLASS}
            style={ROLE_SELECT_STYLE}
            aria-label="Filtrar por rol"
          >
            <option value="all">Todos los roles</option>
            {roleOptions.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <UsersCard className="overflow-hidden rounded-2xl p-0!">
          <UsersTable
            users={users}
            isLoading={usersQuery.isLoading}
            assignableRoles={assignableRoles}
            onToggleActive={setUserToToggle}
            onEdit={setUserToEditId}
          />
        </UsersCard>
      </div>

      <CreateUserDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />

      <CreateUserDrawer
        open={Boolean(userToEditId)}
        userId={userToEditId}
        onClose={() => setUserToEditId(null)}
        onCreated={onUserSaved}
      />

      <DesactivarUsuarioModal
        open={Boolean(userToToggle)}
        email={userToToggle?.email ?? null}
        active={userToToggle?.active ?? true}
        onClose={() => setUserToToggle(null)}
        onConfirm={onConfirmToggleActive}
      />
    </div>
  );
}
