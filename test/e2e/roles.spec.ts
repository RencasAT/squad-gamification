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

async function goToRoles(page: Page): Promise<void> {
  await page.goto('/administracion/roles');
  await expect(
    page.getByRole('heading', { name: /Gestión de roles/i }),
  ).toBeVisible();
  await expect(page.getByText('Admin', { exact: true })).toBeVisible();
}

function roleRow(page: Page, name: string) {
  return page.getByRole('row').filter({
    has: page.getByText(name, { exact: true }),
  });
}

async function confirmDeleteRole(page: Page, name: string): Promise<void> {
  await roleRow(page, name).getByRole('button', { name: 'Eliminar' }).click();

  const dialog = page.getByRole('dialog');
  await expect(
    dialog.getByRole('heading', { name: /¿Eliminar rol\?/i }),
  ).toBeVisible();
  await expect(dialog.getByText(name, { exact: true })).toBeVisible();

  await dialog.getByRole('button', { name: 'Aceptar' }).click();
}

test.describe('Gestión de roles', () => {
  test('eliminar un rol muestra éxito y no redirige al dashboard', async ({
    page,
  }) => {
    await loginAsPilar(page);
    await goToRoles(page);

    await confirmDeleteRole(page, 'Producto');

    const dialog = page.getByRole('dialog');
    await expect(
      dialog.getByRole('heading', { name: /Eliminado con éxito/i }),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/administracion\/roles/);

    await expect(dialog).toHaveCount(0, { timeout: 5_000 });
    await expect(roleRow(page, 'Producto')).toHaveCount(0);
    await expect(page).toHaveURL(/\/administracion\/roles/);
    await expect(
      page.getByRole('heading', { name: /Gestión de roles/i }),
    ).toBeVisible();
  });

  test('eliminar el rol Admin no saca de la pantalla de roles', async ({
    page,
  }) => {
    await loginAsPilar(page);
    await goToRoles(page);

    await confirmDeleteRole(page, 'Admin');

    await expect(
      page.getByRole('heading', { name: /Eliminado con éxito/i }),
    ).toBeVisible();
    await expect(page).not.toHaveURL(/\/dashboard/);
    await expect(page).toHaveURL(/\/administracion\/roles/);

    await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 5_000 });
    await expect(roleRow(page, 'Admin')).toHaveCount(0);
    await expect(page).toHaveURL(/\/administracion\/roles/);
    await expect(
      page.getByRole('heading', { name: /Gestión de roles/i }),
    ).toBeVisible();
  });
});
