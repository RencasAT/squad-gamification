import { useNavigate } from 'react-router';
import { Button } from '@primereact/ui/button';
import { DataTable } from '@primereact/ui/datatable';
import { Skeleton } from '@primereact/ui/skeleton';
import { HasPermission } from '@gamification/shared-ui/has-permission';
import { PERMISSIONS } from '@gamification/shared-utils/permissions';
import { cn } from '@gamification/shared-utils/utils/cn';
import type { AssignableRole, BackofficeUser } from '../model/user.types';
import { iconsTable } from './icons-table';
import { RoleBadge } from './role-badge';

const ROW_ACTION_CLASS =
  'rounded-lg! border-brand! bg-white! px-3! py-1.5! text-sm! font-medium! text-brand! shadow-none! hover:border-brand-hover! hover:bg-brand/5! hover:text-brand-hover!';

const TABLE_CLASS =
  'w-full bg-transparent text-sm shadow-none [&_.p-datatable-table]:w-full [&_.p-datatable-table]:border-collapse [&_.p-datatable-header-cell]:border-none [&_.p-datatable-cell]:border-none';

const HEAD_CELL =
  'bg-white! px-4! py-3.5! text-sm! font-semibold! text-slate-800!';

const CELL = 'px-4! py-3.5! text-sm!';

const SKELETON_ROWS = 8;
const COLUMN_COUNT = 5;

type UsersTableProps = {
  users: BackofficeUser[];
  isLoading: boolean;
  assignableRoles: AssignableRole[];
  onToggleActive: (user: BackofficeUser) => void;
  onEdit: (userId: number) => void;
};

function rowClass(index: number) {
  return index % 2 === 0 ? 'bg-white!' : 'bg-[#F1F1F1]!';
}

function UserEmailCell({ user }: { user: BackofficeUser }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-semibold whitespace-nowrap text-slate-800">
        {user.email}
      </span>
      {user.active ? (
        <span className="inline-flex shrink-0" aria-label="Usuario activo">
          {iconsTable.segurity}
        </span>
      ) : null}
    </div>
  );
}

function UsersTableHead() {
  return (
    <DataTable.THead className="bg-white">
      <DataTable.THeadRow>
        <DataTable.THeadCell className={HEAD_CELL}>
          <DataTable.THeadTitle>DB</DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell className={HEAD_CELL}>
          <DataTable.THeadTitle>Correo del usuario</DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell className={cn(HEAD_CELL, 'text-center')}>
          <DataTable.THeadTitle>ID</DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell className={HEAD_CELL}>
          <DataTable.THeadTitle>Roles</DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell className={cn(HEAD_CELL, 'text-center')}>
          <DataTable.THeadTitle>Acciones</DataTable.THeadTitle>
        </DataTable.THeadCell>
      </DataTable.THeadRow>
    </DataTable.THead>
  );
}

function UsersTableSkeleton() {
  return (
    <DataTable.TBody>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <DataTable.Row key={index} index={index} className={rowClass(index)}>
          {Array.from({ length: COLUMN_COUNT }, (_, column) => (
            <DataTable.Cell key={column} className={CELL}>
              <Skeleton width="100%" height="0.85rem" borderRadius="6px" />
            </DataTable.Cell>
          ))}
        </DataTable.Row>
      ))}
    </DataTable.TBody>
  );
}

export function UsersTable({
  users,
  isLoading,
  assignableRoles,
  onToggleActive,
  onEdit,
}: UsersTableProps) {
  const navigate = useNavigate();

  return (
    <DataTable.Root
      data={isLoading ? [] : users}
      dataKey="id"
      className={TABLE_CLASS}
    >
      <DataTable.TableContainer className="overflow-x-auto">
        <DataTable.Table>
          <UsersTableHead />

          {isLoading ? (
            <UsersTableSkeleton />
          ) : (
            <DataTable.TBody>
              {({ item, index }) => {
                const user = item as unknown as BackofficeUser;

                return (
                  <DataTable.Row index={index} className={rowClass(index)}>
                    <DataTable.Cell
                      className={cn(CELL, 'tabular-nums text-slate-700')}
                    >
                      {user.id}
                    </DataTable.Cell>
                    <DataTable.Cell className={CELL}>
                      <UserEmailCell user={user} />
                    </DataTable.Cell>
                    <DataTable.Cell
                      className={cn(
                        CELL,
                        'text-center tabular-nums whitespace-nowrap text-slate-700',
                      )}
                    >
                      {user.externalId}
                    </DataTable.Cell>
                    <DataTable.Cell className={CELL}>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {user.roles.map((role) => (
                          <RoleBadge
                            key={role.id}
                            role={role}
                            modules={
                              assignableRoles.find(
                                (assignable) => assignable.id === role.id,
                              )?.modules
                            }
                          />
                        ))}
                      </div>
                    </DataTable.Cell>
                    <DataTable.Cell className={CELL}>
                      <div className="flex flex-nowrap items-center justify-center gap-2">
                        <HasPermission permission={PERMISSIONS.USUARIO_EDITAR}>
                          <Button
                            type="button"
                            size="small"
                            variant="outlined"
                            className={ROW_ACTION_CLASS}
                            onClick={() => onToggleActive(user)}
                          >
                            {user.active ? 'Desactivar' : 'Activar'}
                          </Button>
                        </HasPermission>
                        <HasPermission permission={PERMISSIONS.USUARIO_EDITAR}>
                          <Button
                            type="button"
                            size="small"
                            variant="outlined"
                            className={ROW_ACTION_CLASS}
                            onClick={() => onEdit(user.id)}
                          >
                            Editar
                          </Button>
                        </HasPermission>
                        <Button
                          type="button"
                          size="small"
                          variant="outlined"
                          className={ROW_ACTION_CLASS}
                          onClick={() =>
                            void navigate(
                              `/logs-monitoreo?userId=${user.externalId}`,
                            )
                          }
                        >
                          Logs
                        </Button>
                      </div>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              }}
            </DataTable.TBody>
          )}

          {!isLoading ? (
            <DataTable.EmptyTBody>
              <DataTable.Row>
                <DataTable.Cell
                  colSpan={COLUMN_COUNT}
                  className="px-4! py-8! text-center text-slate-400"
                >
                  No se encontraron usuarios.
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable.EmptyTBody>
          ) : null}
        </DataTable.Table>
      </DataTable.TableContainer>
    </DataTable.Root>
  );
}
