import { useEffect, useState } from 'react';
import { Button } from '@primereact/ui/button';
import { useUserQuery } from '../api/use-users';

type EliminarUsuarioModalProps = {
  open: boolean;
  userId: number | null;
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

export function EliminarUsuarioModal({
  open,
  userId,
  onClose,
  onConfirm,
}: EliminarUsuarioModalProps) {
  const [success, setSuccess] = useState(false);
  const userQuery = useUserQuery(open ? userId : null);
  const user = userQuery.data;

  const handleClose = () => {
    setSuccess(false);
    onClose();
  };

  useEffect(() => {
    if (!success) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [success, onClose]);

  if (!open || !userId) {
    return null;
  }

  const handleAccept = async () => {
    await onConfirm();
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-slate-900/50"
        onClick={success ? undefined : handleClose}
        disabled={success}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="eliminar-usuario-title"
        className="relative z-10 w-full max-w-105 rounded-3xl bg-white px-8 pt-8 pb-7 shadow-[0_24px_60px_rgba(15,23,42,0.28)]"
      >
        {!success && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <i className="pi pi-times text-base" />
          </button>
        )}

        {success ? (
          <div className="flex min-h-65 flex-col items-center justify-center py-6 text-center animate-[success-fade_0.35s_ease-out]">
            <SuccessCheckIcon />
            <h2
              id="eliminar-usuario-title"
              className="font-gobold mt-6 text-[22px] leading-none tracking-wide text-ink uppercase"
            >
              Eliminado con éxito
            </h2>
          </div>
        ) : (
          <div className="text-center">
            <h2
              id="eliminar-usuario-title"
              className="font-gobold text-[22px] leading-none tracking-wide text-ink uppercase"
            >
              ¿Eliminar?
            </h2>

            <p className="mt-5 text-[15px] text-ink/75">
              Se eliminará el usuario:
            </p>
            <p className="mt-1 text-[15px] font-bold text-ink">
              {userQuery.isLoading
                ? 'Cargando...'
                : (user?.email ?? 'Usuario no encontrado')}
            </p>

            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#c5d4e3] bg-[#eaf1f8] px-3.5 py-3 text-left">
              <i
                className="pi pi-info-circle mt-0.5 shrink-0 text-[15px] text-[#5b7a99]"
                aria-hidden
              />
              <p className="text-[13px] leading-snug text-ink/80">
                Al eliminar la cuenta el usuario{' '}
                <span className="font-bold text-ink">no podrá acceder</span> a
                la plataforma de gamificación.
              </p>
            </div>

            <Button
              type="button"
              onClick={() => void handleAccept()}
              disabled={userQuery.isLoading || !user}
              className="mt-6! h-12! w-full! justify-center rounded-xl! border-0! bg-brand! text-[15px]! font-semibold! text-white! shadow-none! hover:bg-brand-hover! disabled:opacity-60!"
            >
              Aceptar
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
