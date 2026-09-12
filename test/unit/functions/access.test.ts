import { describe, expect, it } from 'vitest';
import {
  hasAppRole,
  rolesFromKeycloakToken,
} from '@gamification/shared-utils/access';

describe('hasAppRole', () => {
  it('sin roles no concede nada', () => {
    expect(hasAppRole(null, 'users')).toBe(false);
    expect(hasAppRole([], 'users')).toBe(false);
  });

  it('coincide el rol de Keycloak', () => {
    expect(hasAppRole(['users', 'clientes'], 'users')).toBe(true);
    expect(hasAppRole(['users'], 'roles')).toBe(false);
  });

  it('admin concede cualquier módulo', () => {
    expect(hasAppRole(['admin'], 'users')).toBe(true);
    expect(hasAppRole(['Admin'], 'clientes')).toBe(true);
  });
});

describe('rolesFromKeycloakToken', () => {
  it('une realm y client y descarta roles de sistema', () => {
    const roles = rolesFromKeycloakToken(
      {
        realm_access: {
          roles: ['users', 'offline_access', 'default-roles-gamificacion'],
        },
        resource_access: {
          'host-web': { roles: ['clientes'] },
        },
      },
      'host-web',
    );

    expect(roles).toEqual(['users', 'clientes']);
  });
});
