/** Orígenes del host de producto que pueden cargar remoteEntry.js en local. */
export const hostDevOrigins = [
  'http://127.0.0.1:5174',
  'http://localhost:5174',
] as const;

/** `remoteEntry.js` del host ATBO. Override: `VITE_HOST_ENTRY`. */
export const defaultHostEntry =
  process.env.VITE_HOST_ENTRY ?? 'http://localhost:5174/remoteEntry.js';

/** Remote federado `host/*` (`host/layout`, `host/store`, …). */
export const hostFederationRemote = {
  host: {
    type: 'module',
    name: 'host',
    entry: defaultHostEntry,
    entryGlobalName: 'host',
    shareScope: 'default',
  },
};

export const remotesCors = {
  origin: [...hostDevOrigins],
  credentials: false,
};

export const remotesSecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cross-Origin-Resource-Policy': 'cross-origin',
};

/**
 * Vite emite `/<remote>/assets/x.png`. En el host esa ruta 404: el browser
 * la resuelve contra el origen de la página, no contra el remoteEntry.
 * Relativo al chunk = mismo origen que el JS federado.
 */
export function remotesRenderBuiltUrl(
  _filename: string,
  context: { hostType: string },
) {
  if (context.hostType === 'html') return;
  return { relative: true as const };
}
