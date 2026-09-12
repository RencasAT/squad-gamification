import { Button } from '@primereact/ui/button';
import { DataTable } from '@primereact/ui/datatable';
import { Skeleton } from '@primereact/ui/skeleton';
import { cn } from '@gamification/shared-utils/utils/cn';
import type { CampaignRacha } from '../model/racha.types';
import { TipoBadge } from './tipo-badge';

const ROW_ACTION_CLASS =
  'rounded-full! border-slate-400! bg-white! px-3.5! py-1.5! text-sm! font-medium! text-slate-700! shadow-none! hover:border-slate-500! hover:bg-slate-50! hover:text-slate-900!';

const TABLE_CLASS =
  'w-full bg-transparent text-sm shadow-none [&_.p-datatable-table]:w-full [&_.p-datatable-table]:border-collapse [&_.p-datatable-header-cell]:border-none [&_.p-datatable-cell]:border-none';

const HEAD_CELL =
  'bg-white! px-4! py-3.5! text-sm! font-semibold! text-slate-800!';

const CELL = 'px-4! py-3.5! text-sm!';

const SKELETON_ROWS = 5;
const COLUMN_COUNT = 6;

type RachasTableProps = {
  items: CampaignRacha[];
  isLoading: boolean;
  onToggleActive: (racha: CampaignRacha) => void;
  onReport: (racha: CampaignRacha) => void;
  onEdit: (racha: CampaignRacha) => void;
};

function rowClass(index: number) {
  return index % 2 === 0 ? 'bg-[#EEF4FB]!' : 'bg-white!';
}

function RachasTableHead() {
  return (
    <DataTable.THead className="bg-white">
      <DataTable.THeadRow>
        <DataTable.THeadCell className={HEAD_CELL}>
          <DataTable.THeadTitle>ID</DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell className={HEAD_CELL}>
          <DataTable.THeadTitle>Nombre de la Racha</DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell className={cn(HEAD_CELL, 'text-center')}>
          <DataTable.THeadTitle>Jugadores activos</DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell className={cn(HEAD_CELL, 'text-center')}>
          <DataTable.THeadTitle>Tipo</DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell className={cn(HEAD_CELL, 'text-center')}>
          <DataTable.THeadTitle>
            Jugadores con Racha perdida
          </DataTable.THeadTitle>
        </DataTable.THeadCell>
        <DataTable.THeadCell className={cn(HEAD_CELL, 'text-center')}>
          <DataTable.THeadTitle>Acciones</DataTable.THeadTitle>
        </DataTable.THeadCell>
      </DataTable.THeadRow>
    </DataTable.THead>
  );
}

function RachasTableSkeleton() {
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

export function RachasTable({
  items,
  isLoading,
  onToggleActive,
  onReport,
  onEdit,
}: RachasTableProps) {
  return (
    <DataTable.Root
      data={isLoading ? [] : items}
      dataKey="id"
      className={TABLE_CLASS}
    >
      <DataTable.TableContainer className="overflow-x-auto">
        <DataTable.Table>
          <RachasTableHead />

          {isLoading ? (
            <RachasTableSkeleton />
          ) : (
            <DataTable.TBody>
              {({ item, index }) => {
                const racha = item as unknown as CampaignRacha;

                return (
                  <DataTable.Row index={index} className={rowClass(index)}>
                    <DataTable.Cell
                      className={cn(CELL, 'tabular-nums text-slate-700')}
                    >
                      {racha.id}
                    </DataTable.Cell>
                    <DataTable.Cell
                      className={cn(CELL, 'font-medium text-slate-800')}
                    >
                      {racha.name}
                    </DataTable.Cell>
                    <DataTable.Cell
                      className={cn(
                        CELL,
                        'text-center tabular-nums text-slate-700',
                      )}
                    >
                      {racha.activePlayers}
                    </DataTable.Cell>
                    <DataTable.Cell className={cn(CELL, 'text-center')}>
                      <TipoBadge tipo={racha.tipo} />
                    </DataTable.Cell>
                    <DataTable.Cell
                      className={cn(
                        CELL,
                        'text-center tabular-nums text-slate-700',
                      )}
                    >
                      {racha.lostPlayers}
                    </DataTable.Cell>
                    <DataTable.Cell className={CELL}>
                      <div className="flex flex-nowrap items-center justify-center gap-2">
                        <Button
                          type="button"
                          size="small"
                          variant="outlined"
                          className={ROW_ACTION_CLASS}
                          onClick={() => onToggleActive(racha)}
                        >
                          {racha.active ? 'Desactivar' : 'Activar'}
                        </Button>
                        <Button
                          type="button"
                          size="small"
                          variant="outlined"
                          className={ROW_ACTION_CLASS}
                          onClick={() => onReport(racha)}
                        >
                          Reporte
                        </Button>
                        <Button
                          type="button"
                          size="small"
                          variant="outlined"
                          className={ROW_ACTION_CLASS}
                          onClick={() => onEdit(racha)}
                        >
                          Editar
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
                  No se encontraron rachas de campaña.
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable.EmptyTBody>
          ) : null}
        </DataTable.Table>
      </DataTable.TableContainer>
    </DataTable.Root>
  );
}
