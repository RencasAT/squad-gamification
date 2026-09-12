import { Button } from '@primereact/ui/button';

type ConfirmarCrearRachaModalProps = {
  open: boolean;
  rachaName: string;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmarCrearRachaModal({
  open,
  rachaName,
  onClose,
  onConfirm,
}: ConfirmarCrearRachaModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmar-crear-racha-title"
        className="relative z-10 flex h-[225px] w-full max-w-[599px] flex-col rounded-[22px] bg-white px-8 pt-6 pb-5 shadow-[0_24px_60px_rgba(15,23,42,0.28)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Cerrar"
        >
          <i className="pi pi-times text-sm" />
        </button>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
          <h2
            id="confirmar-crear-racha-title"
            className="font-gobold text-[22px] leading-none tracking-wide text-ink uppercase italic"
          >
            ¿Confirmar creación de racha?
          </h2>

          <p className="mt-4 text-[15px] text-ink/75">
            Se creará la racha:{' '}
            <span className="font-bold text-ink">
              {rachaName.trim() || 'Sin nombre'}
            </span>
          </p>
        </div>

        <Button
          type="button"
          onClick={() => void onConfirm()}
          className="h-12! w-full! shrink-0! justify-center! rounded-xl! border-0! bg-ink! text-[15px]! font-semibold! text-white! shadow-none! hover:bg-slate-800!"
        >
          Crear
        </Button>
      </div>
    </div>
  );
}
