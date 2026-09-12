import { expect, test, type Page } from '@playwright/test';

async function loginAsPilar(page: Page): Promise<void> {
  await page.goto('/auth/login');
  await page
    .getByLabel('Correo electrónico')
    .fill('pilar.milla@apuestatotal.com');
  await page.getByLabel('Contraseña', { exact: true }).fill('admin123');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Búsqueda de clientes', () => {
  test('busca un cliente y muestra perfil + tabs', async ({ page }) => {
    await loginAsPilar(page);

    await page.goto('/clientes/busqueda');
    await expect(
      page.getByRole('heading', { name: /Búsqueda de clientes/i }),
    ).toBeVisible();

    await page.getByLabel(/ID del cliente/i).fill('76461311');
    await page.getByRole('button', { name: 'Buscar' }).click();

    await expect(page).toHaveURL(/num=76461311/);
    await expect(
      page.getByRole('heading', { name: /Maria del Pilar Milla/i }),
    ).toBeVisible();
    await expect(page.getByText('ID 1002052584')).toBeVisible();

    await page.getByRole('tab', { name: 'Grupos' }).click();
    await expect(page.getByText('Jugador activado')).toBeVisible();

    await page.getByRole('tab', { name: 'Logros' }).click();
    await expect(page.getByText('Apostador')).toBeVisible();
  });

  test('carga cliente desde query param', async ({ page }) => {
    await loginAsPilar(page);
    await page.goto('/clientes/busqueda?num=76461311');

    await expect(
      page.getByRole('heading', { name: /Maria del Pilar Milla/i }),
    ).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Resumen' })).toBeVisible();
  });

  test('muestra empty state si el cliente no existe', async ({ page }) => {
    await loginAsPilar(page);
    await page.goto('/clientes/busqueda');

    await page.getByLabel(/ID del cliente/i).fill('99999999');
    await page.getByRole('button', { name: 'Buscar' }).click();

    await expect(page).toHaveURL(/num=99999999/);
    await expect(
      page.getByRole('heading', { name: /No existe jugador/i }),
    ).toBeVisible();
    await expect(
      page.getByText('Prueba con otro ID o N° de DNI'),
    ).toBeVisible();
  });
});
