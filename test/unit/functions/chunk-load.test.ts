import { afterEach, describe, expect, it } from 'vitest';
import {
  classifyAppError,
  clearStaleChunkReloadFlag,
  hasAttemptedStaleChunkReload,
  isChunkLoadError,
  isNetworkError,
  markStaleChunkReload,
} from '@gamification/shared-utils/utils/chunk-load';

afterEach(() => {
  sessionStorage.clear();
});

describe('isChunkLoadError', () => {
  it('detecta el TypeError de import dinámico de Vite', () => {
    expect(
      isChunkLoadError(
        new TypeError(
          'Failed to fetch dynamically imported module: https://example.com/assets/users-list-page-CqV-un58.js',
        ),
      ),
    ).toBe(true);
  });

  it('detecta ChunkLoadError de webpack', () => {
    const error = new Error('Loading chunk 5 failed');
    error.name = 'ChunkLoadError';
    expect(isChunkLoadError(error)).toBe(true);
  });

  it('no marca un error de render genérico', () => {
    expect(isChunkLoadError(new Error('Cannot read properties of null'))).toBe(
      false,
    );
  });
});

describe('classifyAppError', () => {
  it('clasifica chunk, red y desconocido', () => {
    expect(
      classifyAppError(
        new TypeError('Failed to fetch dynamically imported module: /x.js'),
      ),
    ).toBe('chunk');
    expect(classifyAppError(new TypeError('Failed to fetch'))).toBe('network');
    expect(classifyAppError(new Error('boom'))).toBe('unknown');
  });

  it('no trata un chunk stale como error de red', () => {
    expect(
      isNetworkError(
        new TypeError('Failed to fetch dynamically imported module: /x.js'),
      ),
    ).toBe(false);
  });
});

describe('stale chunk reload flag', () => {
  it('permite un solo intento por pestaña', () => {
    expect(hasAttemptedStaleChunkReload()).toBe(false);
    expect(markStaleChunkReload()).toBe(true);
    expect(hasAttemptedStaleChunkReload()).toBe(true);
    expect(markStaleChunkReload()).toBe(false);
    clearStaleChunkReloadFlag();
    expect(hasAttemptedStaleChunkReload()).toBe(false);
  });
});
