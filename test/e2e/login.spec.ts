import { expect, test } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
    await expect(
      page.getByRole('heading', { name: 'apuestatotal' }),
    ).toBeVisible();
  });

  test('muestra toast con credenciales incorrectas', async ({ page }) => {
    await page
      .getByLabel('Correo electrónico')
      .fill('pilar.milla@apuestatotal.com');
    await page
      .getByLabel('Contraseña', { exact: true })
      .fill('password-incorrecta');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByText('No se pudo iniciar sesión')).toBeVisible();
    await expect(page.getByText('Credenciales inválidas')).toBeVisible();
  });

  test('ingresa al dashboard con credenciales mock válidas', async ({
    page,
  }) => {
    await page
      .getByLabel('Correo electrónico')
      .fill('pilar.milla@apuestatotal.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('admin123');
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('pilar.milla@apuestatotal.com')).toBeVisible();
  });

  test('mantiene la sesión al recargar el dashboard', async ({ page }) => {
    await page
      .getByLabel('Correo electrónico')
      .fill('pilar.milla@apuestatotal.com');
    await page.getByLabel('Contraseña', { exact: true }).fill('admin123');
    await page.getByRole('button', { name: 'Ingresar' }).click();
    await expect(page).toHaveURL(/\/dashboard/);

    await page.reload();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('pilar.milla@apuestatotal.com')).toBeVisible();
  });
});
