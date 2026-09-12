import { useState, type CSSProperties } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import { Button } from '@primereact/ui/button';
import { useAuth } from '../auth/auth';
import { useAccess } from '@gamification/shared-ui/access-context';
import { useUiStore } from '../store/ui-store';
import { AppLogo } from '@gamification/shared-ui/components/app-logo';
import { cn } from '@gamification/shared-utils/utils/cn';
import { useIsMobile } from '@gamification/shared-ui/hooks/use-media-query';
import { navModules, type NavItem } from './nav-modules';
import { SidebarGroupFlyout } from './sidebar-group-flyout';
import { SidebarToggleIcon } from './sidebar-toggle-icon';
import {
  SIDEBAR_CHILD_FONT_MAX_PX,
  SIDEBAR_FONT_MAX_PX,
  computeSidebarChildFontSize,
  useSidebarTypeScale,
} from './sidebar-type-scale';

type SidebarProps = {
  onOpenSettings: () => void;
};

const iconButtonClass = 'h-9! w-9! min-w-0! p-0! text-ink hover:text-ink';

/** Labels del menú: heredan --sidebar-text (tope --sidebar-font-max). */
const navItemTextClass =
  'font-sans text-[1em] leading-none font-normal tracking-normal text-ink';

/** Fila de módulo: hug 52px en el tope de 16px. */
const navRowClass =
  'relative flex h-[3.25em] w-full items-center gap-4 px-4 py-[1em] transition-colors';

/** Iconos del menú: 20px fijos, no escalan con el texto. */
const navIconClass =
  'inline-flex size-5 shrink-0 items-center justify-center text-xl leading-none text-ink';

const navChevronClass = 'pi shrink-0 text-[0.75em] text-sidebar-chevron';

export function Sidebar({ onOpenSettings }: SidebarProps) {
  const { user, logout } = useAuth();
  const { hasRole } = useAccess();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const closeMobileNav = useUiStore((s) => s.closeMobileNav);
  const [expandedGroups, setExpandedGroups] = useState<
    Record<string, boolean | undefined>
  >({});

  // En mobile el drawer siempre va expandido (con labels).
  const compact = !isMobile && sidebarCollapsed;
  const sidebarTextPx = useSidebarTypeScale();
  const sidebarChildTextPx = computeSidebarChildFontSize(sidebarTextPx);
  const sidebarTypeStyle = {
    '--sidebar-font-max': `${SIDEBAR_FONT_MAX_PX}px`,
    '--sidebar-text': `${sidebarTextPx}px`,
    '--sidebar-child-font-max': `${SIDEBAR_CHILD_FONT_MAX_PX}px`,
    '--sidebar-child-text': `${sidebarChildTextPx}px`,
  } as CSSProperties;

  const visibleModules = navModules.filter((item) => {
    if (item.children?.length) {
      return (
        hasRole(item.role) || item.children.some((child) => hasRole(child.role))
      );
    }
    return hasRole(item.role);
  });

  const onLogout = async () => {
    closeMobileNav();
    await logout();
    void navigate('/auth/login');
  };

  const isGroupOpen = (path: string) => {
    if (expandedGroups[path] !== undefined) {
      return expandedGroups[path];
    }
    return pathname.startsWith(path);
  };

  const toggleGroup = (path: string) => {
    setExpandedGroups((prev) => {
      const currentlyOpen =
        prev[path] !== undefined ? prev[path] : pathname.startsWith(path);
      return { ...prev, [path]: !currentlyOpen };
    });
  };

  const visibleChildren = (item: NavItem) =>
    (item.children ?? []).filter((child) => hasRole(child.role));

  return (
    <aside
      className={cn(
        'gm-sidebar flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-[transform,width] duration-200',
        // Mobile: drawer off-canvas
        'fixed inset-y-0 left-0 z-50 w-[min(322px,88vw)] md:static md:z-auto md:translate-x-0',
        mobileNavOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full',
        // Desktop width
        'md:shrink-0',
        compact ? 'md:w-16' : 'md:w-80.5',
      )}
      style={sidebarTypeStyle}
      aria-hidden={isMobile ? !mobileNavOpen : undefined}
    >
      <div
        className={cn(
          'flex shrink-0',
          compact
            ? 'flex-col items-center gap-3 px-2 pt-5 pb-3'
            : 'items-center gap-2 px-6 py-5',
        )}
      >
        {compact ? (
          <span className="text-[1.25em] font-black tracking-tight">
            <span className="text-brand">a</span>
            <span className="text-ink">t</span>
          </span>
        ) : (
          <AppLogo className="h-7 w-auto" />
        )}

        {isMobile ? (
          <Button
            severity="secondary"
            variant="text"
            iconOnly
            className={cn(iconButtonClass, 'ml-auto')}
            onClick={closeMobileNav}
            aria-label="Cerrar menú"
            title="Cerrar menú"
          >
            <i className="pi pi-times text-xl leading-none" />
          </Button>
        ) : (
          <Button
            severity="secondary"
            variant="text"
            iconOnly
            className={cn(iconButtonClass, !compact && 'ml-auto')}
            onClick={toggleSidebar}
            aria-label={compact ? 'Expandir menú' : 'Comprimir menú'}
            title={compact ? 'Expandir menú' : 'Comprimir menú'}
          >
            <SidebarToggleIcon
              className={cn(
                'transition-transform duration-200',
                compact && 'scale-x-[-1]',
              )}
            />
          </Button>
        )}
      </div>

      {!compact && (
        <div className="px-6 pt-2 pb-5">
          <p className="font-sans text-[0.875em] leading-none font-bold tracking-normal text-sidebar-muted">
            Módulos
          </p>
        </div>
      )}

      <nav
        className={cn(
          'flex-1 overflow-y-auto pb-4',
          compact
            ? 'flex flex-col items-center gap-1 px-1.5'
            : 'space-y-0.5 px-0',
        )}
      >
        {visibleModules.map((item) => {
          const children = visibleChildren(item);
          const hasChildren = children.length > 0;
          const isOpen = isGroupOpen(item.path);

          if (hasChildren && compact) {
            const childActive = children.some(
              (child) =>
                pathname === child.path ||
                pathname.startsWith(`${child.path}/`),
            );

            return (
              <SidebarGroupFlyout
                key={item.path}
                label={item.label}
                icon={item.icon}
                items={children}
                active={childActive}
                navigateOnTrigger={children.length === 1}
              />
            );
          }

          if (hasChildren && !compact) {
            return (
              <div key={item.path}>
                <button
                  type="button"
                  onClick={() => toggleGroup(item.path)}
                  className={cn(
                    navRowClass,
                    navItemTextClass,
                    'hover:bg-sidebar-hover',
                  )}
                >
                  <i className={cn(item.icon, navIconClass)} />
                  <span className="min-w-0 flex-1 truncate text-left">
                    {item.label}
                  </span>
                  <i
                    className={cn(
                      navChevronClass,
                      'transition-transform',
                      isOpen ? 'pi-chevron-down' : 'pi-chevron-right',
                    )}
                  />
                </button>

                {isOpen &&
                  children.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      title={child.label}
                      className={({ isActive }) =>
                        cn(
                          'gm-sidebar-child relative flex h-[3.25em] items-center py-[1em] pr-4 pl-11 transition-colors',
                          navItemTextClass,
                          isActive
                            ? 'bg-sidebar-active font-medium'
                            : 'hover:bg-sidebar-hover',
                        )
                      }
                    >
                      <span className="truncate">{child.label}</span>
                    </NavLink>
                  ))}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  navItemTextClass,
                  compact
                    ? 'relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors'
                    : navRowClass,
                  isActive
                    ? 'bg-sidebar-active font-medium'
                    : 'hover:bg-sidebar-hover',
                )
              }
            >
              <i className={cn(item.icon, navIconClass)} />
              {!compact && (
                <>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  <i className={cn(navChevronClass, 'pi-chevron-right')} />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div
        className={cn(
          'mt-auto border-t border-sidebar-border',
          compact
            ? 'flex flex-col items-center gap-1 px-1.5 py-4'
            : 'px-6 py-4',
        )}
      >
        {compact ? (
          <>
            <Button
              severity="secondary"
              variant="text"
              iconOnly
              className={iconButtonClass}
              aria-label="Notificaciones"
              title="Notificaciones"
              onClick={() => void navigate('/notificaciones')}
            >
              <i className="pi pi-bell text-xl leading-none" />
            </Button>
            {hasRole('settings') && (
              <Button
                severity="secondary"
                variant="text"
                iconOnly
                className={iconButtonClass}
                aria-label="Configuración"
                onClick={onOpenSettings}
              >
                <i className="pi pi-cog text-xl leading-none" />
              </Button>
            )}
            <Button
              severity="secondary"
              variant="text"
              iconOnly
              className={iconButtonClass}
              aria-label="Salir"
              title="Salir"
              onClick={onLogout}
            >
              <i className="pi pi-sign-out text-xl leading-none" />
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.875em] font-semibold text-ink">
                {user?.email ?? 'Usuario'}
              </p>
              <p className="truncate text-[0.75em] text-ink/60">
                {user?.roles.map((role) => role.name).join(' · ') ||
                  'Sin roles'}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                severity="secondary"
                variant="text"
                iconOnly
                className={iconButtonClass}
                aria-label="Notificaciones"
                title="Notificaciones"
                onClick={() => void navigate('/notificaciones')}
              >
                <i className="pi pi-bell text-xl leading-none" />
              </Button>
              {hasRole('settings') && (
                <Button
                  severity="secondary"
                  variant="text"
                  iconOnly
                  className={iconButtonClass}
                  aria-label="Configuración"
                  onClick={() => {
                    closeMobileNav();
                    onOpenSettings();
                  }}
                >
                  <i className="pi pi-cog text-xl leading-none" />
                </Button>
              )}
              <Button
                severity="secondary"
                variant="text"
                iconOnly
                className={iconButtonClass}
                aria-label="Salir"
                title="Salir"
                onClick={onLogout}
              >
                <i className="pi pi-sign-out text-xl leading-none" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
