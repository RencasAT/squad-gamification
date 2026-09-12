export type AppErrorKind = 'chunk' | 'network' | 'not-found' | 'unknown';

const STALE_CHUNK_RELOAD_KEY = 'gm:stale-chunk-reload';

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error ?? '');
}

/** Chunk de Vite/React.lazy que ya no existe (deploy nuevo o 404 del .js). */
export function isChunkLoadError(error: unknown): boolean {
  if (error instanceof Error && error.name === 'ChunkLoadError') {
    return true;
  }

  const message = errorMessage(error).toLowerCase();
  return (
    message.includes('failed to fetch dynamically imported module') ||
    message.includes('error loading dynamically imported module') ||
    message.includes('importing a module script failed') ||
    message.includes('unable to preload css')
  );
}

export function isNetworkError(error: unknown): boolean {
  if (isChunkLoadError(error)) {
    return false;
  }

  const message = errorMessage(error).toLowerCase();
  return (
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('network request failed') ||
    message.includes('load failed')
  );
}

export function classifyAppError(error: unknown): AppErrorKind {
  if (isChunkLoadError(error)) {
    return 'chunk';
  }
  if (isNetworkError(error)) {
    return 'network';
  }
  return 'unknown';
}

export function hasAttemptedStaleChunkReload(): boolean {
  try {
    return sessionStorage.getItem(STALE_CHUNK_RELOAD_KEY) === '1';
  } catch {
    return true;
  }
}

/** Marca el intento. `true` si todavía no se recargó en esta pestaña. */
export function markStaleChunkReload(): boolean {
  if (hasAttemptedStaleChunkReload()) {
    return false;
  }

  try {
    sessionStorage.setItem(STALE_CHUNK_RELOAD_KEY, '1');
    return true;
  } catch {
    return false;
  }
}

export function clearStaleChunkReloadFlag(): void {
  try {
    sessionStorage.removeItem(STALE_CHUNK_RELOAD_KEY);
  } catch {
    /* sessionStorage puede estar bloqueado */
  }
}

/**
 * Reintenta un import dinámico. Si el chunk es stale, recarga la pestaña
 * una sola vez para tomar el `index.html` del último deploy.
 */
export function importWithChunkRetry<T>(loader: () => Promise<T>): Promise<T> {
  return loader().then(
    (module) => {
      clearStaleChunkReloadFlag();
      return module;
    },
    (error: unknown) => {
      if (isChunkLoadError(error) && markStaleChunkReload()) {
        window.location.reload();
        return new Promise<T>(() => undefined);
      }
      throw error;
    },
  );
}
