import { Outlet, useLocation, useNavigate, Link } from 'react-router';
import { Suspense, useEffect } from 'react';
import { Button } from '@primereact/ui/button';
import { useUiStore } from '../store/ui-store';
import { Sidebar } from './sidebar';
import { navModules, type NavItem } from './nav-modules';
import { ModuleLoader } from '@gamification/shared-ui/components/module-loader';

type Crumb = {
  label: string;
  path: string;
};

function isPathMatch(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function findBreadcrumbs(pathname: string): Crumb[] {
  const home: Crumb = { label: 'Inicio', path: '/dashboard' };

  if (pathname === '/' || pathname === '/dashboard') {
    return [home];
  }

  if (pathname === '/settings' || pathname.startsWith('/settings/')) {
    return [home, { label: 'Mi perfil', path: '/settings' }];
  }

  if (
    pathname === '/notificaciones' ||
    pathname.startsWith('/notificaciones/')
  ) {
    return [home, { label: 'Mis Notificaciones', path: '/notificaciones' }];
  }

  for (const item of navModules) {
    if (item.children?.length) {
      const child = item.children.find((sub) =>
        isPathMatch(pathname, sub.path),
      );

      if (child) {
        return [
          home,
          { label: item.label, path: item.path },
          { label: child.label, path: child.path },
        ];
      }

      if (pathname === item.path) {
        return [home, { label: item.label, path: item.path }];
      }

      continue;
    }

    if (isPathMatch(pathname, item.path)) {
      return [home, { label: item.label, path: item.path }];
    }
  }

  return [home];
}

function resolveParentLink(item: NavItem) {
  return item.children?.[0]?.path ?? item.path;
}

/** Shell: sidebar + breadcrumbs + content (Apuesta Total). */
export function ShellLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const toggleMobileNav = useUiStore((s) => s.toggleMobileNav);
  const closeMobileNav = useUiStore((s) => s.closeMobileNav);

  const crumbs = findBreadcrumbs(pathname).map((crumb, index, list) => {
    if (index === 1 && list.length > 2) {
      const parent = navModules.find((item) => item.label === crumb.label);
      if (parent?.children?.length) {
        return { ...crumb, path: resolveParentLink(parent) };
      }
    }
    return crumb;
  });

  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileNavOpen]);

  const breadcrumbNav = (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden md:gap-2"
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span
            key={`${crumb.label}-${crumb.path}`}
            className="flex min-w-0 items-center gap-1 md:gap-2"
          >
            {index > 0 && (
              <span className="shrink-0 text-ink/35" aria-hidden>
                /
              </span>
            )}
            {isLast ? (
              <span className="truncate font-medium text-ink">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="max-w-22 truncate text-ink/55 hover:text-ink sm:max-w-28 md:max-w-none"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-ink/40 md:hidden"
          onClick={closeMobileNav}
        />
      )}

      <Sidebar onOpenSettings={() => void navigate('/settings')} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="flex h-12 shrink-0 items-center gap-1.5 border-b border-sidebar-border bg-sidebar px-2 md:hidden">
          <Button
            type="button"
            severity="secondary"
            variant="text"
            iconOnly
            className="h-9! w-9! min-w-0! shrink-0! p-0! text-ink!"
            aria-label="Abrir menú"
            aria-expanded={mobileNavOpen}
            onClick={toggleMobileNav}
          >
            <i className="pi pi-bars text-base" />
          </Button>

          <div className="min-w-0 flex-1 text-[11px] leading-none">
            {breadcrumbNav}
          </div>

          <Button
            type="button"
            severity="secondary"
            variant="text"
            iconOnly
            className="h-9! w-9! min-w-0! shrink-0! p-0! text-ink!"
            aria-label="Notificaciones"
            title="Notificaciones"
            onClick={() => void navigate('/notificaciones')}
          >
            <i className="pi pi-bell text-sm" />
          </Button>
        </header>

        {/* Desktop breadcrumbs */}
        <header className="hidden h-12 shrink-0 items-center border-b border-slate-200/60 bg-transparent px-6 md:flex">
          <div className="min-w-0 text-sm text-slate-500">{breadcrumbNav}</div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-transparent p-3 md:p-5">
          <Suspense fallback={<ModuleLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
