import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { HoverPopup } from '@gamification/shared-ui/components/hover-popup';

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

describe('HoverPopup', () => {
  it('abre el popover al hacer click cuando no hay hover fino', async () => {
    const user = userEvent.setup();
    const restore = stubMatchMedia(false);

    render(
      <HoverPopup
        label="Admin"
        infoLabel="Permisos del rol Admin"
        popupLabel="Permisos de Admin"
      >
        <p>Gestión de usuario</p>
      </HoverPopup>,
    );

    await user.click(
      screen.getByRole('button', { name: 'Permisos del rol Admin' }),
    );

    expect(
      screen.getByRole('dialog', { name: 'Permisos de Admin' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Gestión de usuario')).toBeInTheDocument();
    restore();
  });
});
