import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { FloatInput } from '@gamification/shared-ui/components/float-input';

afterEach(cleanup);

describe('FloatInput', () => {
  it('muestra el mensaje de error', () => {
    render(<FloatInput label="Correo" invalid error="Correo inválido" />);

    const input = screen.getByRole('textbox', { name: 'Correo' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Correo inválido')).toBeInTheDocument();
  });

  it('permite mostrar y ocultar la contraseña', async () => {
    const user = userEvent.setup();
    render(<FloatInput label="Contraseña" type="password" />);

    const input = screen.getByLabelText('Contraseña');
    expect(input).toHaveAttribute('type', 'password');

    await user.click(
      screen.getByRole('button', { name: 'Mostrar caracteres' }),
    );
    expect(input).toHaveAttribute('type', 'text');

    await user.click(
      screen.getByRole('button', { name: 'Ocultar caracteres' }),
    );
    expect(input).toHaveAttribute('type', 'password');
  });
});
