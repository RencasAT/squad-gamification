import { expect, test, type Page } from '@playwright/test';

async function login(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto('/auth/login');
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.goto('/auth/login');
  await page.getByLabel('Correo electrónico').fill(email);
  await page.getByLabel('Contraseña', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

function moduleNav(page: Page) {
  return page.getByRole('navigation');
}

test.describe('Sidebar por permisos efectivos', () => {
  test('operador (Gamification): ve módulos de negocio y no Administración/Logs', async ({
    page,
  }) => {
    await login(page, 'operador@apuestatotal.com', 'operador123');

    await expect(page.getByText('operador@apuestatotal.com')).toBeVisible();
    await expect(page.getByText('Gamification', { exact: true })).toBeVisible();

    const nav = moduleNav(page);

    await expect(nav.getByRole('link', { name: 'Inicio' })).toBeVisible();
    await expect(nav.getByText('Contenido Gamification')).toBeVisible();
    await expect(nav.getByText('Premios')).toBeVisible();
    await expect(nav.getByText('Análisis y Modelado')).toBeVisible();
    await expect(nav.getByText('Clientes')).toBeVisible();
    await expect(nav.getByText('Simulaciones')).toBeVisible();
    await expect(nav.getByText('Media')).toBeVisible();
    await expect(nav.getByText('Catálogo de componentes')).toBeVisible();

    await expect(nav.getByText('Administración')).toHaveCount(0);
    await expect(nav.getByText('Gestión de usuarios')).toHaveCount(0);
    await expect(nav.getByText('Gestión de roles')).toHaveCount(0);
    await expect(nav.getByText('Logs y Monitoreo')).toHaveCount(0);

    // Guard de ruta: sin permiso, redirect a /dashboard
    await page.goto('/administracion/usuarios');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('admin (Pilar): ve Administración y puede entrar a usuarios', async ({
    page,
  }) => {
    await login(page, 'pilar.milla@apuestatotal.com', 'admin123');

    const nav = moduleNav(page);

    await expect(nav.getByText('Administración')).toBeVisible();
    await expect(nav.getByText('Logs y Monitoreo')).toBeVisible();

    await nav.getByRole('button', { name: /Administración/i }).click();
    await expect(nav.getByText('Gestión de usuarios')).toBeVisible();
    await expect(nav.getByText('Gestión de roles')).toBeVisible();

    await nav.getByRole('link', { name: 'Gestión de usuarios' }).click();
    await expect(page).toHaveURL(/\/administracion\/usuarios/);
  });
});
