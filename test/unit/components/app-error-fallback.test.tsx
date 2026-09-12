import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router';
import { AppErrorFallback } from '@gamification/shared-ui/components/app-error-fallback';
import { RouteErrorBoundary } from '@gamification/host-shell/layout/route-error-boundary';

afterEach(() => {
  cleanup();
  sessionStorage.clear();
});

describe('AppErrorFallback', () => {
  it('muestra el mensaje de chunk stale y dispara recargar', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <AppErrorFallback kind="chunk" onRetry={onRetry} onGoHome={vi.fn()} />,
    );

    expect(
      screen.getByRole('heading', { name: /nueva versión disponible/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/failed to fetch dynamically imported module/i),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Recargar' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('ofrece volver al inicio en errores de módulo', async () => {
    const user = userEvent.setup();
    const onGoHome = vi.fn();

    render(
      <AppErrorFallback kind="unknown" onRetry={vi.fn()} onGoHome={onGoHome} />,
    );

    await user.click(screen.getByRole('button', { name: 'Ir al inicio' }));
    expect(onGoHome).toHaveBeenCalledOnce();
  });
});

describe('RouteErrorBoundary', () => {
  it('mantiene el shell y no muestra el error técnico de Vite', async () => {
    sessionStorage.setItem('gm:stale-chunk-reload', '1');

    const router = createMemoryRouter([
      {
        path: '/',
        element: (
          <div>
            <p>Sidebar</p>
            <Outlet />
          </div>
        ),
        children: [
          {
            errorElement: <RouteErrorBoundary variant="page" />,
            children: [
              {
                index: true,
                loader() {
                  throw new TypeError(
                    'Failed to fetch dynamically imported module: https://example.com/assets/users-list-page-CqV-un58.js',
                  );
                },
                element: <p>Usuarios</p>,
              },
            ],
          },
        ],
      },
    ]);

    render(<RouterProvider router={router} />);

    expect(
      await screen.findByRole('heading', { name: /nueva versión disponible/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(
      screen.queryByText(/Unexpected Application Error/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Failed to fetch dynamically imported module/i),
    ).not.toBeInTheDocument();
  });
});
