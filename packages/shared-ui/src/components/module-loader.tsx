import { ProgressSpinner } from '@primereact/ui/progressspinner';
import { Skeleton } from '@primereact/ui/skeleton';
import { useNavigationProgress } from '../hooks/use-navigation-progress';
import { cn } from '@gamification/shared-utils/utils/cn';

const CARD_CLASS =
  'rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(148,163,184,0.22)]';

type ModuleLoaderVariant = 'fullscreen' | 'page' | 'section' | 'inline';

type ModuleLoaderProps = {
  variant?: ModuleLoaderVariant;
  label?: string;
  className?: string;
};

type TableRowsLoaderProps = {
  columns: number;
  rows?: number;
};

function Spinner({ className }: { className?: string }) {
  return (
    <ProgressSpinner.Root className={cn('size-12!', className)}>
      <ProgressSpinner.Track />
      <ProgressSpinner.Value />
    </ProgressSpinner.Root>
  );
}

export function TableRowsLoader({ columns, rows = 6 }: TableRowsLoaderProps) {
  return (
    <>
      {Array.from({ length: rows }, (_, row) => (
        <tr
          key={row}
          className={row % 2 === 0 ? 'bg-white' : 'bg-[#eef3f7]/70'}
        >
          {Array.from({ length: columns }, (_, col) => (
            <td key={col} className="px-4 py-3">
              <Skeleton width="100%" height="0.85rem" borderRadius="6px" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** Loader de montaje: pantalla completa, página de módulo o sección. */
export function ModuleLoader({
  variant = 'page',
  label = 'Cargando módulo',
  className,
}: ModuleLoaderProps) {
  useNavigationProgress(variant === 'page' || variant === 'fullscreen');

  if (variant === 'fullscreen') {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={label}
        className={cn(
          'flex min-h-screen flex-col items-center justify-center gap-4',
          className,
        )}
      >
        <Spinner />
        <p className="font-gobold text-sm tracking-wide text-slate-500 uppercase">
          {label}
        </p>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={label}
        className={cn(
          'flex min-h-72 flex-col items-center justify-center gap-4 py-10',
          className,
        )}
      >
        <Spinner />
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <section
        role="status"
        aria-live="polite"
        aria-label={label}
        className={cn(CARD_CLASS, className)}
      >
        <Skeleton width="11rem" height="0.9rem" className="mb-4!" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton
              key={index}
              width="100%"
              height="5.5rem"
              borderRadius="16px"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        'mx-auto flex w-full max-w-screen-2xl flex-col gap-4',
        className,
      )}
    >
      <section className={CARD_CLASS}>
        <Skeleton width="14rem" height="1rem" className="mb-4!" />
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-56 max-w-md flex-1 basis-56">
            <Skeleton width="100%" height="3.3rem" borderRadius="12px" />
          </div>
          <Skeleton width="11rem" height="3rem" borderRadius="12px" />
        </div>
      </section>

      <Skeleton width="8rem" height="0.85rem" />

      <section className={cn(CARD_CLASS, 'overflow-hidden p-0!')}>
        <div className="border-b border-slate-100 px-4 py-3">
          <Skeleton width="16rem" height="2.25rem" borderRadius="999px" />
        </div>
        <table className="w-full">
          <tbody>
            <TableRowsLoader columns={5} rows={7} />
          </tbody>
        </table>
      </section>
    </div>
  );
}
