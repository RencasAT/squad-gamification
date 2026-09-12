type FilterChipProps = {
  label: string;
  onRemove: () => void;
};

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex text-slate-500 hover:text-slate-800"
        aria-label={`Quitar filtro ${label}`}
      >
        <i className="pi pi-times text-[10px]" />
      </button>
    </span>
  );
}
