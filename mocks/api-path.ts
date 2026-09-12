/** Prefijo para matchear `/api/*` desde cualquier origin (Vite + axios). */
export function apiPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `*/api${normalized}`;
}
