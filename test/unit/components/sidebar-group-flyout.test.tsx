import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { SidebarGroupFlyout } from '@gamification/host-shell/layout/sidebar-group-flyout';
import type { NavItem } from '@gamification/host-shell/layout/nav-modules';

afterEach(cleanup);

function stubMatchMedia(matches: boolean) {
  const original = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;

  return () => {
    window.matchMedia = original;
  };
}

const adminChildren: NavItem[] = [
  {
    label: 'Gestión de usuarios',
    path: '/administracion/usuarios',
    icon: 'pi pi-users',
    role: 'users',
  },
  {
    label: 'Gestión de roles',
    path: '/administracion/roles',
    icon: 'pi pi-shield',
    role: 'roles',
  },
];

const clientesChildren: NavItem[] = [
  {
    label: 'Búsqueda de clientes',
    path: '/clientes/busqueda',
    icon: 'pi pi-search',
    role: 'clientes',
  },
];

describe('SidebarGroupFlyout', () => {
  it('con varios hijos el icono es botón y abre el panel al click sin hover fino', async () => {
    const user = userEvent.setup();
    const restore = stubMatchMedia(false);

    render(
      <MemoryRouter>
        <SidebarGroupFlyout
          label="Administración"
          icon="pi pi-user-edit"
          items={adminChildren}
          active={false}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('button', { name: 'Administración' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Gestión de roles' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Administración' }));

    expect(
      screen.getByRole('menu', { name: 'Administración' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'Gestión de usuarios' }),
    ).toHaveAttribute('href', '/administracion/usuarios');
    expect(
      screen.getByRole('menuitem', { name: 'Gestión de roles' }),
    ).toHaveAttribute('href', '/administracion/roles');
    restore();
  });

  it('con un solo hijo el icono navega a esa ruta', () => {
    render(
      <MemoryRouter>
        <SidebarGroupFlyout
          label="Clientes"
          icon="pi pi-users"
          items={clientesChildren}
          active={false}
          navigateOnTrigger
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Clientes' })).toHaveAttribute(
      'href',
      '/clientes/busqueda',
    );
  });
});
