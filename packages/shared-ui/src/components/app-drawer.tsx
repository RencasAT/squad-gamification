import {
  useEffect,
  useId,
  useState,
  type FormEventHandler,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@gamification/shared-utils/utils/cn';
import { ModuleLoader } from './module-loader';

const TRANSITION_MS = 300;

const PANEL_CLASS =
  'flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-[-12px_0_40px_rgba(15,23,42,0.18)] sm:max-w-2xl';

type AppDrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  titleId?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Si se pasa, el contenido se envuelve en `<form>`. */
  onSubmit?: FormEventHandler<HTMLFormElement>;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
  footerClassName?: string;
};

export function AppDrawer({
  open,
  onClose,
  title,
  description,
  titleId,
  children,
  footer,
  onSubmit,
  loading = false,
  loadingLabel = 'Cargando...',
  className,
  footerClassName,
}: AppDrawerProps) {
  const autoTitleId = useId();
  const resolvedTitleId = titleId ?? autoTitleId;
  const [mounted, setMounted] = useState(open);
  const [entered, setEntered] = useState(false);

  if (open && !mounted) {
    setMounted(true);
  }

  if (!open && entered) {
    setEntered(false);
  }

  useEffect(() => {
    if (!open || !mounted || entered) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setEntered(true));
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [open, mounted, entered]);

  useEffect(() => {
    if (open || entered || !mounted) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setMounted(false);
    }, TRANSITION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [open, entered, mounted]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mounted, onClose]);

  const handleBackdropClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!mounted) {
    return null;
  }

  const body = (
    <>
      <header className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
        <button
          type="button"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          aria-label="Cerrar"
          onClick={onClose}
        >
          <i className="pi pi-times text-sm" />
        </button>

        <div className="min-w-0 flex-1">
          <h2
            id={resolvedTitleId}
            className="font-gobold text-[15px] tracking-wide text-slate-800 uppercase"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm leading-snug text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
        {loading ? (
          <ModuleLoader variant="inline" label={loadingLabel} />
        ) : (
          children
        )}
      </div>

      {footer ? (
        <footer
          className={cn('border-t border-slate-100 px-5 py-4', footerClassName)}
        >
          {footer}
        </footer>
      ) : null}
    </>
  );

  return createPortal(
    <div className="fixed inset-0 z-50" data-app-drawer="">
      <button
        type="button"
        aria-label="Cerrar panel"
        className={cn(
          'absolute inset-0 bg-slate-900/45 transition-opacity ease-out',
          entered ? 'opacity-100' : 'opacity-0',
        )}
        style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        onClick={handleBackdropClick}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={resolvedTitleId}
        className={cn(
          'absolute inset-y-0 right-0 transition-transform ease-out',
          entered ? 'translate-x-0' : 'translate-x-full',
          PANEL_CLASS,
          className,
        )}
        style={{ transitionDuration: `${TRANSITION_MS}ms` }}
      >
        {onSubmit ? (
          <form
            onSubmit={onSubmit}
            className="flex h-full min-h-0 flex-col overflow-hidden"
          >
            {body}
          </form>
        ) : (
          <div className="flex h-full min-h-0 flex-col overflow-hidden">
            {body}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
