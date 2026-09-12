import { lazy, type ComponentType } from 'react';
import { importWithChunkRetry } from './chunk-load';

/** `React.lazy` que recarga una vez si el chunk del deploy anterior 404. */
export function lazyRoute(factory: () => Promise<{ default: ComponentType }>) {
  return lazy(() => importWithChunkRetry(factory));
}
