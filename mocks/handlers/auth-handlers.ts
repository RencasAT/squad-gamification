import { http } from 'msw';
import {
  completePasswordChange,
  findAuthAccount,
  findAuthAccountByEmail,
  findAuthAccountById,
  toAuthUser,
} from '../data/auth.mock';
import { isValidNewPassword } from '@gamification/host-shell/auth/password-policy';
import { apiPath } from '../api-path';
import { errorJson, okJson, withMockDelay } from '../mock-utils';

type LoginBody = {
  email?: string;
  password?: string;
};

type ChangePasswordBody = {
  currentPassword?: string;
  newPassword?: string;
};

const REVOKED_TOKENS_KEY = 'msw_revoked_tokens';

/** Tokens emitidos en esta sesión de mock (memoria). */
const activeTokens = new Map<string, string>();

function readRevokedTokens(): Set<string> {
  try {
    const raw = sessionStorage.getItem(REVOKED_TOKENS_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(
      parsed.filter((item): item is string => typeof item === 'string'),
    );
  } catch {
    return new Set();
  }
}

function revokeToken(token: string): void {
  const revoked = readRevokedTokens();
  revoked.add(token);
  sessionStorage.setItem(REVOKED_TOKENS_KEY, JSON.stringify([...revoked]));
  activeTokens.delete(token);
}

/**
 * Resuelve el email del token.
 * Sobrevive F5: el formato `mock-token-{accountId}-{ts}` no depende del Map en memoria.
 */
function resolveEmailFromToken(token: string): string | null {
  if (readRevokedTokens().has(token)) {
    return null;
  }

  const cached = activeTokens.get(token);
  if (cached) {
    return cached;
  }

  const match = /^mock-token-([^-]+)-\d+$/.exec(token);
  if (!match) {
    return null;
  }

  const account = findAuthAccountById(match[1]);
  if (!account) {
    return null;
  }

  activeTokens.set(token, account.email);
  return account.email;
}

function bearerEmail(request: Request): string | null {
  const header = request.headers.get('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return null;
  }
  const token = header.slice('Bearer '.length).trim();
  return resolveEmailFromToken(token);
}

export const authHandlers = [
  http.post(apiPath('/login'), async ({ request }) => {
    await withMockDelay();
    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim();
    const password = body.password ?? '';

    if (!email || !password) {
      return errorJson(400, 'Correo y contraseña son requeridos');
    }

    const account = findAuthAccount(email, password);
    if (!account) {
      return errorJson(401, 'Credenciales inválidas');
    }

    const accessToken = `mock-token-${account.id}-${Date.now()}`;
    activeTokens.set(accessToken, account.email);

    return okJson({
      accessToken,
      user: toAuthUser(account),
    });
  }),

  http.get(apiPath('/me'), async ({ request }) => {
    await withMockDelay();
    const email = bearerEmail(request);
    if (!email) {
      return errorJson(401, 'No autenticado');
    }

    const account = findAuthAccountByEmail(email);
    if (!account) {
      return errorJson(401, 'Sesión inválida');
    }

    return okJson({ data: toAuthUser(account) });
  }),

  http.post(apiPath('/logout'), async ({ request }) => {
    await withMockDelay();
    const header = request.headers.get('Authorization');
    if (header?.startsWith('Bearer ')) {
      revokeToken(header.slice('Bearer '.length).trim());
    }
    return okJson({ ok: true });
  }),

  http.put(apiPath('/change-password'), async ({ request }) => {
    await withMockDelay();
    const email = bearerEmail(request);
    if (!email) {
      return errorJson(401, 'No autenticado');
    }

    const body = (await request.json()) as ChangePasswordBody;
    const account = findAuthAccount(email, body.currentPassword ?? '');
    if (!account) {
      return errorJson(400, 'Contraseña actual incorrecta');
    }

    const newPassword = body.newPassword ?? '';
    if (!isValidNewPassword(newPassword)) {
      return errorJson(
        400,
        'La nueva contraseña no cumple los requisitos mínimos',
      );
    }

    completePasswordChange(email, newPassword);
    return okJson({ ok: true });
  }),
];
