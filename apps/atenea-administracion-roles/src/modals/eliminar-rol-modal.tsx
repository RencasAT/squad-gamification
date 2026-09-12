import { useEffect, useRef, useState } from 'react';
import { Button } from '@primereact/ui/button';
import { toast } from '@primereact/ui/toaster';
import { getApiErrorMessage } from '@gamification/shared-utils/utils/get-api-error-message';

type EliminarRolModalProps = {
  open: boolean;
  roleName: string | null;
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

export function EliminarRolModal({
  open,
  roleName,
  onClose,
  onConfirm,
}: EliminarRolModalProps) {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const busyRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handleClose = () => {
    if (busyRef.current || submitting || success) {
      return;
    }
    setSuccess(false);
    onClose();
  };

  useEffect(() => {
    if (!success) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      busyRef.current = false;
      setSuccess(false);
      onCloseRef.current();
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [success]);

  if (!open || !roleName) {
    return null;
  }

  const handleAccept = async () => {
    if (busyRef.current) {
      return;
    }
    busyRef.current = true;
    setSubmitting(true);
    try {
      await onConfirm();
      setSuccess(true);
    } catch (error) {
      busyRef.current = false;
      toast.error({
        title: 'No se pudo eliminar el rol',
        description: getApiErrorMessage(
          error,
          'Inténtalo de nuevo en unos segundos.',
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-slate-900/50"
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="eliminar-rol-title"
        className="relative z-10 w-full max-w-[599px] rounded-3xl bg-white px-8 pt-8 pb-7 shadow-[0_24px_60px_rgba(15,23,42,0.28)]"
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {!success && (
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Cerrar"
          >
            <i className="pi pi-times text-base" />
          </button>
        )}

        {success ? (
          <div className="flex min-h-55 flex-col items-center justify-center py-6 text-center animate-[success-fade_0.35s_ease-out]">
            <SuccessCheckIcon />
            <h2
              id="eliminar-rol-title"
              className="font-gobold mt-6 text-[22px] leading-none tracking-wide text-ink uppercase"
            >
              Eliminado con éxito
            </h2>
          </div>
        ) : (
          <div className="text-center">
            <h2
              id="eliminar-rol-title"
              className="font-gobold text-[22px] leading-none tracking-wide text-ink uppercase"
            >
              ¿Eliminar rol?
            </h2>

            <p className="mt-5 text-[15px] text-ink/75">Se eliminará el rol:</p>
            <p className="mt-1 text-[15px] font-bold text-ink">{roleName}</p>

            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-[#0F3B66] bg-[#EAF2FF] px-3.5 py-3 text-left">
              <span
                className="relative min-h-8.75! min-w-8.75! rounded-full bg-[#2F80ED]"
                aria-hidden
              >
                <i className="pi pi-info-circle text-[16px] leading-none text-white absolute! top-1/2! left-1/2! -translate-x-1/2! -translate-y-1/2!" />
              </span>
              <p className="text-[13px] leading-snug text-[#0F3B66]">
                Al eliminar el rol, los usuarios asociados{' '}
                <span className="font-bold">perderán estos accesos</span> en la
                plataforma de gamificación.
              </p>
            </div>

            <Button
              type="button"
              disabled={submitting}
              onClick={() => void handleAccept()}
              className="mt-6! h-12! w-full! justify-center rounded-xl! border-0! bg-brand! text-[15px]! font-semibold! text-white! shadow-none! hover:bg-brand-hover! disabled:opacity-60!"
            >
              {submitting ? 'Eliminando...' : 'Aceptar'}
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
