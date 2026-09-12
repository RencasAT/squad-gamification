import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@gamification/shared-utils/utils/cn';

type HoverPopupPlacement = 'top' | 'right';

type HoverPopupProps = {
  label: string;
  infoLabel: string;
  popupLabel: string;
  disabled?: boolean;
  placement?: HoverPopupPlacement;
  triggerClassName?: string;
  popupClassName?: string;
  children: ReactNode;
};

type PopupCoords = {
  top: number;
  left: number;
};

function supportsHover(): boolean {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Chip con (i) que abre un popover al hover (click en touch).
 * Usado en listados de roles y usuarios.
 */
export function HoverPopup({
  label,
  infoLabel,
  popupLabel,
  disabled = false,
  placement = 'top',
  triggerClassName,
  popupClassName,
  children,
}: HoverPopupProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<PopupCoords | null>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openPopup = () => {
    if (disabled) {
      return;
    }
    clearCloseTimeout();
    setOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 120);
  };

  useLayoutEffect(() => {
    if (!open || disabled || !rootRef.current) {
      return;
    }

    const updatePosition = () => {
      const trigger = rootRef.current;
      const popup = popupRef.current;
      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();
      if (placement === 'top') {
        setCoords({
          top: rect.top,
          left: rect.left + rect.width / 2,
        });
        return;
      }

      const gap = 8;
      const width = popup?.offsetWidth ?? 280;
      const height = popup?.offsetHeight ?? 0;
      let left = rect.right + gap;
      if (left + width > window.innerWidth - 8) {
        left = Math.max(8, rect.left - width - gap);
      }

      let top = rect.top;
      if (height > 0 && top + height > window.innerHeight - 8) {
        top = Math.max(8, window.innerHeight - height - 8);
      }

      setCoords({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, disabled, placement]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        rootRef.current?.contains(target) ||
        popupRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    return () => clearCloseTimeout();
  }, []);

  const showPopup = open && !disabled;

  return (
    <span
      ref={rootRef}
      className="relative inline-flex"
      onMouseEnter={() => {
        if (supportsHover()) {
          openPopup();
        }
      }}
      onMouseLeave={() => {
        if (supportsHover()) {
          scheduleClose();
        }
      }}
    >
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold',
          'outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1',
          triggerClassName,
        )}
        aria-expanded={showPopup}
        aria-haspopup={disabled ? undefined : 'dialog'}
        aria-label={infoLabel}
        onClick={() => {
          if (!supportsHover() && !disabled) {
            setOpen((current) => !current);
          }
        }}
      >
        {label}
        <i className="pi pi-info-circle text-[11px] opacity-90" aria-hidden />
      </button>

      {showPopup &&
        createPortal(
          <div
            ref={popupRef}
            role="dialog"
            aria-label={popupLabel}
            className={cn(
              'fixed z-100 w-max rounded-xl border border-slate-200 bg-white px-3.5 py-2.5',
              'shadow-[0_10px_30px_rgba(15,23,42,0.14)]',
              placement === 'top' &&
                '-translate-x-1/2 -translate-y-[calc(100%+8px)]',
              popupClassName,
            )}
            style={
              coords
                ? { top: coords.top, left: coords.left }
                : { top: 0, left: 0, visibility: 'hidden' }
            }
            onMouseEnter={() => {
              if (supportsHover()) {
                openPopup();
              }
            }}
            onMouseLeave={() => {
              if (supportsHover()) {
                scheduleClose();
              }
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </span>
  );
}
