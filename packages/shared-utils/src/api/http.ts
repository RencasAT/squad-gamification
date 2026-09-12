import axios, { isAxiosError } from 'axios';
import { environment } from '@gamification/shared-utils/environments/environment';

/** Cliente HTTP compartido. El token vive en memoria (lo setea el host o el remote). */
export const http = axios.create({
  baseURL: environment.apiUrl,
});

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const requestUrl = String(error.config?.url ?? '');
    const isLoginRequest = requestUrl.includes('/login');

    if (status === 401 && !isLoginRequest) {
      accessToken = null;
      onUnauthorized?.();
    }

    return Promise.reject(error);
  },
);
