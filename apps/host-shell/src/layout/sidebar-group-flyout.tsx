import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router';
import { cn } from '@gamification/shared-utils/utils/cn';
import type { NavItem } from './nav-modules';

type SidebarGroupFlyoutProps = {
  label: string;
  icon: string;
  items: NavItem[];
  active: boolean;
  /** Un solo hijo: el icono navega directo a esa ruta. */
  navigateOnTrigger?: boolean;
};

type PopupCoords = {
  top: number;
  left: number;
};

function supportsHover() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

const triggerClass = (active: boolean) =>
  cn(
    'relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
    active ? 'bg-sidebar-active font-medium' : 'hover:bg-sidebar-hover',
  );

/** Rail compacto: panel a la derecha con los hijos del grupo. */
export function SidebarGroupFlyout({
  label,
  icon,
  items,
  active,
  navigateOnTrigger = false,
}: SidebarGroupFlyoutProps) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<PopupCoords | null>(null);
  const [openedAtPath, setOpenedAtPath] = useState(pathname);
  const rootRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  if (pathname !== openedAtPath) {
    setOpenedAtPath(pathname);
    setOpen(false);
  }

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current === null) {
      return;
    }
    window.clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = null;
  };

  const openPopup = () => {
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
    if (!open || !rootRef.current) {
      return;
    }

    const updatePosition = () => {
      const trigger = rootRef.current;
      const popup = popupRef.current;
      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();
      const gap = 8;
      const width = popup?.offsetWidth ?? 220;
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
  }, [open, items.length]);

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

  useEffect(() => () => clearCloseTimeout(), []);

  const trigger = navigateOnTrigger ? (
    <NavLink
      to={items[0]?.path ?? '#'}
      aria-label={label}
      aria-haspopup="menu"
      aria-expanded={open}
      className={triggerClass(active)}
    >
      <i
        className={cn(icon, 'size-5 text-xl leading-none text-ink')}
        aria-hidden
      />
    </NavLink>
  ) : (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="menu"
      aria-expanded={open}
      className={triggerClass(active)}
      onClick={() => {
        if (!supportsHover()) {
          setOpen((current) => !current);
        }
      }}
    >
      <i
        className={cn(icon, 'size-5 text-xl leading-none text-ink')}
        aria-hidden
      />
    </button>
  );

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
      {trigger}
      {open &&
        createPortal(
          <FlyoutPanel
            ref={popupRef}
            label={label}
            coords={coords}
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
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-3 py-2 text-sm text-ink transition-colors',
                    isActive
                      ? 'bg-sidebar-active font-medium'
                      : 'hover:bg-sidebar-hover',
                  )
                }
              >
                <i
                  className={cn(item.icon, 'text-sm text-ink/70')}
                  aria-hidden
                />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </FlyoutPanel>,
          document.body,
        )}
    </span>
  );
}

type FlyoutPanelProps = {
  label: string;
  coords: PopupCoords | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  children: ReactNode;
  ref: Ref<HTMLDivElement>;
};

function FlyoutPanel({
  label,
  coords,
  onMouseEnter,
  onMouseLeave,
  children,
  ref,
}: FlyoutPanelProps) {
  return (
    <div
      ref={ref}
      role="menu"
      aria-label={label}
      className="fixed z-100 min-w-52 overflow-hidden rounded-xl border border-sidebar-border bg-sidebar py-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.16)]"
      style={
        coords
          ? { top: coords.top, left: coords.left }
          : { top: 0, left: 0, visibility: 'hidden' }
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <p className="px-3 pt-1 pb-1.5 text-[11px] font-semibold tracking-wide text-sidebar-muted uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}
