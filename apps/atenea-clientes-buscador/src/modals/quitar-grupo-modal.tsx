import { Button } from '@primereact/ui/button';
import type { ClienteGrupo } from '../model/cliente.types';

type QuitarGrupoModalProps = {
  open: boolean;
  clientId: string;
  grupo: ClienteGrupo | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function QuitarGrupoModal({
  open,
  clientId,
  grupo,
  onClose,
  onConfirm,
}: QuitarGrupoModalProps) {
  if (!open || !grupo) {
    return null;
  }

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
        aria-labelledby="quitar-grupo-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <i className="pi pi-times text-sm" />
          </button>
        </div>

        <div className="px-2 pb-2 text-center">
          <h2
            id="quitar-grupo-title"
            className="text-xl font-extrabold tracking-wide text-slate-900 uppercase"
          >
            ¿Estás seguro?
          </h2>

          <p className="mt-3 text-sm text-slate-600">
            Se quitará el{' '}
            <span className="font-bold text-sky-600 underline underline-offset-2">
              ID {clientId}
            </span>{' '}
            de:
          </p>

          <ul className="mt-4 list-disc space-y-1 pl-5 text-left text-sm font-medium text-slate-800">
            <li>{grupo.name}</li>
          </ul>

          <Button
            type="button"
            onClick={onConfirm}
            className="mt-6! h-11! w-full! justify-center rounded-xl! border-0! bg-slate-600! text-sm! font-semibold! text-white! shadow-sm! hover:bg-slate-700!"
          >
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
