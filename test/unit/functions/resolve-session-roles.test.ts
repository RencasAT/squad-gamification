import { beforeEach, describe, expect, it } from 'vitest';
import { resetRolesStore, updateRole } from '@mocks/db/roles.store';
import { resolveSessionRoles } from '@mocks/lib/resolve-session-roles';
import { permissionsFromModules } from '@gamification/atenea-administracion-roles/model/role.types';
import { mockPermissionModules } from '@mocks/data/permissions.mock';

describe('resolveSessionRoles', () => {
  beforeEach(() => {
    resetRolesStore();
  });

  it('une módulos de varios roles en nombres Keycloak', () => {
    const roles = resolveSessionRoles([
      { id: 2, name: 'Gamification' },
      { id: 1, name: 'Admin' },
    ]);

    expect(roles).toEqual(
      expect.arrayContaining(['users', 'premios', 'clientes']),
    );
  });

  it('un módulo habilitado otorga el rol aunque sea solo lectura', () => {
    updateRole(3, {
      name: 'Producto',
      permissions: permissionsFromModules(
        mockPermissionModules,
        ['clientes'],
        'lectura',
      ),
    });

    const roles = resolveSessionRoles([{ id: 3, name: 'Producto' }]);

    expect(roles).toContain('clientes');
    expect(roles).not.toContain('users');
  });
});
