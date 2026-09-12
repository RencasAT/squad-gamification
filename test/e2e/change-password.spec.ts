import { expect, test } from '@playwright/test';

test.describe('Cambio de contraseña obligatorio', () => {
  test('usuario nuevo es redirigido a cambiar contraseña al ingresar', async ({
    page,
  }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Correo electrónico').fill('nuevo@apuestatotal.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('TempPass1');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page).toHaveURL(/\/auth\/change-password/);
    await expect(
      page.getByText(
        'Ingresa la contraseña anterior para cambiar tu contraseña',
      ),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Cambiar contraseña' }),
    ).toBeDisabled();
  });

  test('no deja entrar al dashboard hasta actualizar la contraseña', async ({
    page,
  }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Correo electrónico').fill('nuevo@apuestatotal.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('TempPass1');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL(/\/auth\/change-password/);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/change-password/);
  });

  test('habilita el botón y entra al dashboard al cumplir los requisitos', async ({
    page,
  }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Correo electrónico').fill('nuevo@apuestatotal.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('TempPass1');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL(/\/auth\/change-password/);

    const submit = page.getByRole('button', { name: 'Cambiar contraseña' });
    await expect(submit).toBeDisabled();

    await page.getByLabel('Contraseña actual').fill('TempPass1');
    await page.getByLabel('Nueva contraseña', { exact: true }).fill('corta');
    await page.getByLabel('Repetir nueva contraseña').fill('corta');
    await expect(submit).toBeDisabled();

    await page
      .getByLabel('Nueva contraseña', { exact: true })
      .fill('NuevaPass1');
    await page.getByLabel('Repetir nueva contraseña').fill('NuevaPass1');
    await expect(submit).toBeEnabled();

    await submit.click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('nuevo@apuestatotal.com')).toBeVisible();

    await page.reload();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('nuevo@apuestatotal.com')).toBeVisible();
  });

  test('permite cerrar sesión sin quedar atrapado en el cambio de contraseña', async ({
    page,
  }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Correo electrónico').fill('nuevo@apuestatotal.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('TempPass1');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL(/\/auth\/change-password/);

    await page.getByRole('button', { name: 'Cerrar sesión' }).click();
    await expect(page).toHaveURL(/\/auth\/login/);

    await page
      .getByLabel('Correo electrónico')
      .fill('pilar.milla@apuestatotal.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('admin123');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('un usuario existente sigue yendo al dashboard', async ({ page }) => {
    await page.goto('/auth/login');
    await page
      .getByLabel('Correo electrónico')
      .fill('pilar.milla@apuestatotal.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('admin123');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
  });
});
