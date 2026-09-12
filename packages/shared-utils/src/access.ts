/** Roles de cliente/realm que el backoffice entiende (nombres de Keycloak). */
export const APP_ROLES = [
  'admin',
  'administrador',
  'dashboard',
  'contenido-gamification',
  'premios',
  'analisis-modelado',
  'clientes',
  'simulaciones',
  'media',
  'administracion',
  'users',
  'roles',
  'logs-monitoreo',
  'settings',
  'ui-kit',
] as const;

export type AppRole = (typeof APP_ROLES)[number];

const APP_ROLE_SET = new Set<string>(APP_ROLES);

const IGNORED_TOKEN_ROLES = new Set([
  'offline_access',
  'uma_authorization',
  'account',
]);

export type FederatedRemoteProps = {
  token?: string | null;
  roles?: readonly string[] | null;
  onUnauthorized?: () => void;
};

export function isAppRole(value: string): value is AppRole {
  return APP_ROLE_SET.has(value);
}

function normalizeRole(value: string): string {
  return value.trim().toLowerCase();
}

function isIgnoredTokenRole(role: string): boolean {
  if (IGNORED_TOKEN_ROLES.has(role)) {
    return true;
  }
  return role.startsWith('default-roles-');
}

/**
 * Match exacto del string (rol o permiso).
 * `admin` abre todo.
 */
export function hasPermission(
  roles: readonly string[] | null | undefined,
  permission: string,
): boolean {
  if (!roles?.length) {
    return false;
  }

  const needed = normalizeRole(permission);
  for (const entry of roles) {
    const current = normalizeRole(entry);
    if (current === 'admin' || current === needed) {
      return true;
    }
  }

  return false;
}

/** @deprecated Preferí `hasPermission` (misma semántica). */
export function hasAppRole(
  roles: readonly string[] | null | undefined,
  role: string,
): boolean {
  return hasPermission(roles, role);
}

export function rolesFromKeycloakToken(
  token:
    | {
        realm_access?: { roles?: string[] };
        resource_access?: Record<string, { roles?: string[] }>;
      }
    | null
    | undefined,
  clientId: string,
): string[] {
  const realmRoles = token?.realm_access?.roles ?? [];
  const clientRoles = clientId
    ? (token?.resource_access?.[clientId]?.roles ?? [])
    : [];

  const unique = new Set<string>();
  for (const role of [...realmRoles, ...clientRoles]) {
    const normalized = normalizeRole(role);
    if (!normalized || isIgnoredTokenRole(normalized)) {
      continue;
    }
    unique.add(normalized);
  }

  return [...unique];
}
