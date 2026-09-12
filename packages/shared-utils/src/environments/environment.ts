function envFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') {
    return fallback;
  }
  return value === 'true' || value === '1';
}

/** Config de runtime leída desde variables VITE_* (.env / .env.[mode]). */
export const environment = {
  production: envFlag(import.meta.env.VITE_PRODUCTION, import.meta.env.PROD),
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  useMocks: envFlag(import.meta.env.VITE_USE_MOCKS, !import.meta.env.PROD),
  VITE_PRIMEUI_LICENSE: import.meta.env.VITE_PRIMEUI_LICENSE || '',
};
