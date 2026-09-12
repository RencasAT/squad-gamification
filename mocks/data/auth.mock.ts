import type { AuthUser } from '@gamification/host-shell/auth/auth.types';
import { getUserByEmail } from '../db/users.store';
import { resolveSessionRoles } from '../lib/resolve-session-roles';

export type MockAuthAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  mustChangePassword: boolean;
};

/** Sobrevive F5 junto con `access_token` / `gm_auth_user`. */
export const MOCK_AUTH_ACCOUNTS_KEY = 'gm_mock_auth_accounts';

function cloneAccount(account: MockAuthAccount): MockAuthAccount {
  return { ...account };
}

function isValidAccount(value: unknown): value is MockAuthAccount {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const account = value as Partial<MockAuthAccount>;
  return (
    typeof account.id === 'string' &&
    typeof account.name === 'string' &&
    typeof account.email === 'string' &&
    typeof account.password === 'string' &&
    typeof account.mustChangePassword === 'boolean'
  );
}

function readStoredAccounts(): MockAuthAccount[] {
  try {
    const raw = localStorage.getItem(MOCK_AUTH_ACCOUNTS_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isValidAccount).map(cloneAccount);
  } catch {
    return [];
  }
}

function loadAccounts(): MockAuthAccount[] {
  const seed = seedAuthAccounts.map(cloneAccount);
  const stored = readStoredAccounts();
  if (stored.length === 0) {
    return seed;
  }

  const byEmail = new Map(
    seed.map((account) => [account.email.toLowerCase(), account]),
  );
  for (const account of stored) {
    byEmail.set(account.email.toLowerCase(), cloneAccount(account));
  }
  return [...byEmail.values()];
}

function persistAuthAccounts(): void {
  try {
    const seedByEmail = new Map(
      seedAuthAccounts.map((account) => [account.email.toLowerCase(), account]),
    );
    const diverged = mockAuthAccounts.filter((account) => {
      const seed = seedByEmail.get(account.email.toLowerCase());
      if (!seed) {
        return true;
      }
      return (
        account.password !== seed.password ||
        account.mustChangePassword !== seed.mustChangePassword ||
        account.name !== seed.name ||
        account.id !== seed.id
      );
    });

    if (diverged.length === 0) {
      localStorage.removeItem(MOCK_AUTH_ACCOUNTS_KEY);
      return;
    }

    localStorage.setItem(MOCK_AUTH_ACCOUNTS_KEY, JSON.stringify(diverged));
  } catch {
    // Storage no disponible (SSR / tests sin DOM).
  }
}

/**
 * Cuentas de login mock.
 * Roles/permisos efectivos se resuelven desde users.store + roles.store por email.
 */
const seedAuthAccounts: MockAuthAccount[] = [
  {
    id: '1',
    name: 'Eduardo Escudero Arens',
    email: 'eduardo.escudero@apuestatotal.com',
    password: 'admin123',
    mustChangePassword: false,
  },
  {
    id: '2',
    name: 'Pilar Milla',
    email: 'pilar.milla@apuestatotal.com',
    password: 'admin123',
    mustChangePassword: false,
  },
  {
    id: '3',
    name: 'Operador Demo',
    email: 'operador@apuestatotal.com',
    password: 'operador123',
    mustChangePassword: false,
  },
  {
    id: '4',
    name: 'Usuario Nuevo',
    email: 'nuevo@apuestatotal.com',
    password: 'TempPass1',
    mustChangePassword: true,
  },
];

let mockAuthAccounts: MockAuthAccount[] = loadAccounts();

export function resetAuthAccounts(): void {
  try {
    localStorage.removeItem(MOCK_AUTH_ACCOUNTS_KEY);
  } catch {
    // Storage no disponible.
  }
  mockAuthAccounts = seedAuthAccounts.map(cloneAccount);
}

/** Relee cuentas desde storage (simula F5 del mock). */
export function hydrateAuthAccounts(): void {
  mockAuthAccounts = loadAccounts();
}

export function addAuthAccount(account: MockAuthAccount): void {
  mockAuthAccounts.push(cloneAccount(account));
  persistAuthAccounts();
}

export function findAuthAccount(
  email: string,
  password: string,
): MockAuthAccount | null {
  const normalized = email.trim().toLowerCase();
  return (
    mockAuthAccounts.find(
      (account) =>
        account.email.toLowerCase() === normalized &&
        account.password === password,
    ) ?? null
  );
}

export function findAuthAccountByEmail(email: string): MockAuthAccount | null {
  const normalized = email.trim().toLowerCase();
  return (
    mockAuthAccounts.find(
      (account) => account.email.toLowerCase() === normalized,
    ) ?? null
  );
}

export function completePasswordChange(
  email: string,
  newPassword: string,
): MockAuthAccount | null {
  const account = findAuthAccountByEmail(email);
  if (!account) {
    return null;
  }
  account.password = newPassword;
  account.mustChangePassword = false;
  persistAuthAccounts();
  return account;
}

export function findAuthAccountById(id: string): MockAuthAccount | null {
  return mockAuthAccounts.find((account) => account.id === id) ?? null;
}

/** AuthUser de sesión: roles de display + roles de acceso estilo Keycloak. */
export function toAuthUser(account: MockAuthAccount): AuthUser {
  const backofficeUser = getUserByEmail(account.email);
  const roles = backofficeUser?.roles.map((role) => ({ ...role })) ?? [];

  return {
    id: account.id,
    name: backofficeUser?.name ?? account.name,
    email: account.email,
    roles,
    accessRoles: resolveSessionRoles(roles),
    mustChangePassword: account.mustChangePassword,
  };
}
