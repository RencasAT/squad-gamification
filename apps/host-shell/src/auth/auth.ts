import { useQueryClient } from '@tanstack/react-query';
import { configureAuth } from 'react-query-auth';
import { setAccessToken } from '@gamification/shared-utils/api/http';
import { hasAppRole } from '@gamification/shared-utils/access';
import { changePasswordApi, fetchMeApi, loginApi, logoutApi } from './auth.api';
import {
  AUTH_STORAGE_KEY,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
} from './auth.constants';
import type { AuthUser } from './auth.types';

export type ProfileUpdate = {
  name: string;
  email: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  name: string;
};

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (
      !parsed.id ||
      !parsed.name ||
      !parsed.email ||
      !Array.isArray(parsed.roles) ||
      !Array.isArray(parsed.accessRoles)
    ) {
      return null;
    }
    return {
      id: parsed.id,
      name: parsed.name,
      email: parsed.email,
      roles: parsed.roles,
      accessRoles: parsed.accessRoles,
      mustChangePassword: parsed.mustChangePassword === true,
    };
  } catch {
    return null;
  }
}

function persistSession(token: string, user: AuthUser): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  setAccessToken(token);
}

function clearSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
  setAccessToken(null);
}

async function userFn(): Promise<AuthUser | null> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    return null;
  }

  setAccessToken(token);

  try {
    const user = await fetchMeApi();
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch {
    clearSession();
    return null;
  }
}

async function loginFn(credentials: LoginCredentials): Promise<AuthUser> {
  const data = await loginApi(credentials);
  persistSession(data.accessToken, data.user);
  return data.user;
}

async function registerFn(credentials: RegisterCredentials): Promise<AuthUser> {
  return loginFn(credentials);
}

async function logoutFn(): Promise<void> {
  try {
    await logoutApi();
  } catch {
    // Limpiamos sesión local aunque el mock falle.
  } finally {
    clearSession();
  }
}

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth<AuthUser | null, Error, LoginCredentials, RegisterCredentials>({
    userFn,
    loginFn,
    registerFn,
    logoutFn,
    userKey: AUTH_USER_KEY,
  });

function updateStoredProfile(patch: ProfileUpdate): AuthUser {
  const current = readStoredUser();
  if (!current) {
    throw new Error('No hay sesión activa');
  }

  const next: AuthUser = {
    ...current,
    name: patch.name,
    email: patch.email,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const userQuery = useUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  return {
    user: userQuery.data ?? null,
    isAuthenticated: Boolean(userQuery.data),
    isLoading: userQuery.isLoading,
    login: (credentials: LoginCredentials) =>
      loginMutation.mutateAsync(credentials),
    logout: () => logoutMutation.mutateAsync(undefined),
    changePassword: async (payload: {
      currentPassword: string;
      newPassword: string;
    }) => {
      await changePasswordApi(payload);
      await queryClient.invalidateQueries({ queryKey: AUTH_USER_KEY });
    },
    updateProfile: async (patch: ProfileUpdate) => {
      const next = updateStoredProfile(patch);
      queryClient.setQueryData(AUTH_USER_KEY, next);
      return next;
    },
    hasRole: (roleName: string) =>
      hasAppRole(userQuery.data?.accessRoles, roleName),
    loginMutation,
    logoutMutation,
  };
}
