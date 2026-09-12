import { cn } from '@gamification/shared-utils/utils/cn';

export type PermissionAccessKind = 'lectura' | 'edicion' | 'ambas';

const ACCESS_LABELS: Record<PermissionAccessKind, string> = {
  lectura: 'Lectura',
  edicion: 'Edición',
  ambas: 'Combinado',
};

const ACCESS_ICONS: Record<Exclude<PermissionAccessKind, 'ambas'>, string> = {
  lectura: 'pi-eye',
  edicion: 'pi-pencil',
};

type PermissionAccessMarkProps = {
  access: PermissionAccessKind;
};

/** Icono + etiqueta de acceso (lectura / edición / combinado). */
export function PermissionAccessMark({ access }: PermissionAccessMarkProps) {
  if (access === 'ambas') {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] text-slate-500">
        <span
          className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border border-slate-500"
          aria-hidden
        >
          <span className="block h-0.5 w-2 rounded-sm bg-slate-500" />
        </span>
        {ACCESS_LABELS[access]}
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-[13px] text-slate-500">
      <i className={cn('pi text-[12px]', ACCESS_ICONS[access])} aria-hidden />
      {ACCESS_LABELS[access]}
    </span>
  );
}
