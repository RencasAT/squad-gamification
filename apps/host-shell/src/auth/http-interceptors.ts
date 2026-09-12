import {
  setAccessToken,
  setUnauthorizedHandler,
} from '@gamification/shared-utils/api/http';
import { AUTH_STORAGE_KEY, AUTH_TOKEN_KEY } from './auth.constants';

let installed = false;

function clearStoredSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
  setAccessToken(null);
}

/** 401 → limpia sesión local y vuelve al login. El Bearer lo adjunta `http`. */
export function installAuthHttpInterceptors(): void {
  if (installed) {
    return;
  }
  installed = true;

  setUnauthorizedHandler(() => {
    clearStoredSession();
    if (window.location.pathname !== '/auth/login') {
      window.location.assign('/auth/login');
    }
  });
}
