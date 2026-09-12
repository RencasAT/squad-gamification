import { useEffect } from 'react';
import { Button } from '@primereact/ui/button';
import { DataTable } from '@primereact/ui/datatable';
import { Skeleton } from '@primereact/ui/skeleton';
import { HasRole } from '@gamification/shared-ui/has-role';
import { cn } from '@gamification/shared-utils/utils/cn';
import { enabledModulesFromRole, type RoleRow } from '../model/role.types';
import { PermissionBadge } from './permission-badge';

const ROW_ACTION_CLASS =
  'rounded-lg! border-brand! bg-white! px-3! py-1.5! text-sm! font-medium! text-brand! shadow-none! hover:border-brand-hover! hover:bg-brand/5! hover:text-brand-hover!';

const TABLE_CLASS =
  'w-full bg-transparent text-sm shadow-none [&_.p-datatable-table]:w-full [&_.p-datatable-table]:min-w-205 [&_.p-datatable-table]:border-collapse [&_.p-datatable-header-cell]:border-none [&_.p-datatable-cell]:border-none';

const HEAD_CELL =
  'bg-white! px-4! py-3.5! text-sm! font-semibold! text-slate-800!';

const CELL = 'px-4! py-3.5! text-sm!';

const SKELETON_ROWS = 8;
const COLUMN_COUNT = 4;

type RoleToDelete = {
  id: number;
  name: string;
};

type RolesTableProps = {
  roles: RoleRow[];
  isLoading: boolean;
  highlightedRoleId?: number | null;
  onDelete: (role: RoleToDelete) => void;
  onEdit: (roleId: number) => void;
};

function rowClass(index: number) {
  return index % 2 === 0 ? 'bg-white!' : 'bg-[#F1F1F1]!';
}

function RolesTableHead() {
  return (
    <DataTable.THead className="bg-white">
      <DataTable.THeadRow>
        <DataTable.THeadCell className={HEAD_CELL}>
          <DataTable.THeadTitle>ID</DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell className={HEAD_CELL}>
          <DataTable.THeadTitle>Roles</DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell className={cn(HEAD_CELL, 'min-w-80')}>
          <DataTable.THeadTitle>Permisos</DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell
          className={cn(HEAD_CELL, 'text-center whitespace-nowrap')}
        >
          <DataTable.THeadTitle>Acciones</DataTable.THeadTitle>
        </DataTable.THeadCell>
      </DataTable.THeadRow>
    </DataTable.THead>
  );
}

function RolesTableSkeleton() {
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

export function RolesTable({
  roles,
  isLoading,
  highlightedRoleId = null,
  onDelete,
  onEdit,
}: RolesTableProps) {
  useEffect(() => {
    if (highlightedRoleId == null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const marker = document.querySelector(
        `[data-role-row="${highlightedRoleId}"]`,
      );
      marker
        ?.closest('tr')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 2150);

    return () => window.clearTimeout(timeoutId);
  }, [highlightedRoleId]);

  return (
    <DataTable.Root
      data={isLoading ? [] : roles}
      dataKey="id"
      className={TABLE_CLASS}
    >
      <DataTable.TableContainer className="overflow-x-auto">
        <DataTable.Table>
          <RolesTableHead />

          {isLoading ? (
            <RolesTableSkeleton />
          ) : (
            <DataTable.TBody>
              {({ item, index }) => {
                const role = item as unknown as RoleRow;
                const modules = enabledModulesFromRole(role.permissions);

                const isHighlighted = highlightedRoleId === role.id;

                return (
                  <DataTable.Row
                    index={index}
                    className={cn(
                      rowClass(index),
                      isHighlighted && 'gm-row-flash',
                    )}
                  >
                    <DataTable.Cell
                      className={cn(CELL, 'tabular-nums text-slate-700')}
                    >
                      {role.id}
                    </DataTable.Cell>
                    <DataTable.Cell className={CELL}>
                      <span
                        data-role-row={role.id}
                        className="font-semibold whitespace-nowrap text-slate-800"
                      >
                        {role.name}
                      </span>
                    </DataTable.Cell>
                    <DataTable.Cell className={cn(CELL, 'min-w-80')}>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {modules.map((module) => (
                          <PermissionBadge
                            key={module.id}
                            module={module}
                            moduleState={role.permissions[module.id]}
                          />
                        ))}
                      </div>
                    </DataTable.Cell>
                    <DataTable.Cell className={cn(CELL, 'whitespace-nowrap')}>
                      <div className="flex flex-nowrap items-center justify-center gap-2">
                        <HasRole role="roles">
                          <Button
                            type="button"
                            size="small"
                            variant="outlined"
                            className={ROW_ACTION_CLASS}
                            onClick={() =>
                              onDelete({
                                id: role.id,
                                name: role.name,
                              })
                            }
                          >
                            Eliminar
                          </Button>
                        </HasRole>
                        <HasRole role="roles">
                          <Button
                            type="button"
                            size="small"
                            variant="outlined"
                            className={ROW_ACTION_CLASS}
                            onClick={() => onEdit(role.id)}
                          >
                            Editar
                          </Button>
                        </HasRole>
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
                  No se encontraron roles.
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable.EmptyTBody>
          ) : null}
        </DataTable.Table>
      </DataTable.TableContainer>
    </DataTable.Root>
  );
}
