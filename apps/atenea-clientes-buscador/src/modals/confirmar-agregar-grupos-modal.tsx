import { useState } from 'react';
import { Button } from '@primereact/ui/button';
import type { ClienteGrupo } from '../model/cliente.types';

type ConfirmarAgregarGruposModalProps = {
  open: boolean;
  clientId: string;
  grupos: ClienteGrupo[];
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

function SuccessCheckIcon() {
  return (
    <svg
      width="92"
      height="92"
      viewBox="0 0 92 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="animate-[success-pop_0.45s_ease-out]"
    >
      <circle cx="46" cy="46" r="46" fill="#15BC00" />
      <path
        d="M73.5 30L69 25L34.5 58L23 45L18 49.5L34.5 67.5L73.5 30Z"
        fill="white"
      />
    </svg>
  );
}

export function ConfirmarAgregarGruposModal({
  open,
  clientId,
  grupos,
  onClose,
  onConfirm,
}: ConfirmarAgregarGruposModalProps) {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) {
      return;
    }
    setSuccess(false);
    onClose();
  };

  if (!open || grupos.length === 0) {
    return null;
  }

  const handleAccept = async () => {
    setSubmitting(true);
    try {
      await onConfirm();
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-slate-900/45"
        onClick={success || submitting ? undefined : handleClose}
        disabled={success || submitting}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmar-agregar-grupos-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      >
        {!success && (
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              aria-label="Cerrar"
            >
              <i className="pi pi-times text-sm" />
            </button>
          </div>
        )}

        {success ? (
          <div className="flex min-h-55 flex-col items-center justify-center py-6 text-center animate-[success-fade_0.35s_ease-out]">
            <SuccessCheckIcon />
            <h2
              id="confirmar-agregar-grupos-title"
              className="font-gobold mt-6 text-[22px] leading-none tracking-wide text-ink uppercase"
            >
              Agregado con éxito
            </h2>
            <Button
              type="button"
              onClick={handleClose}
              className="mt-8! h-11! w-full! justify-center rounded-xl! border-0! bg-brand! text-sm! font-semibold! text-white! shadow-none! hover:bg-brand-hover!"
            >
              Aceptar
            </Button>
          </div>
        ) : (
          <div className="px-2 pb-2 text-center">
            <h2
              id="confirmar-agregar-grupos-title"
              className="font-gobold text-xl tracking-wide text-slate-900 uppercase"
            >
              ¿Confirmar?
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Se agregará el{' '}
              <span className="font-bold text-slate-900">ID {clientId}</span> a
              los siguientes grupos:
            </p>

            <ul className="mt-4 list-disc space-y-1 pl-8 text-left text-sm font-medium text-slate-800">
              {grupos.map((grupo) => (
                <li key={grupo.id}>{grupo.name}</li>
              ))}
            </ul>

            <Button
              type="button"
              disabled={submitting}
              onClick={() => void handleAccept()}
              className="mt-6! h-11! w-full! justify-center rounded-xl! border-0! bg-brand! text-sm! font-semibold! text-white! shadow-none! hover:bg-brand-hover! disabled:opacity-60!"
            >
              {submitting ? 'Agregando...' : 'Aceptar'}
            </Button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes success-pop {
          0% {
            opacity: 0;
            transform: scale(0.55);
          }
          70% {
            opacity: 1;
            transform: scale(1.08);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes success-fade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
