import { useEffect } from 'react';
import {
  completeNavigationProgress,
  startNavigationProgress,
} from '@gamification/shared-utils/lib/navigation-progress';

/** Mientras `isPending` es true, mantiene la barra superior activa. */
export function useNavigationProgress(isPending: boolean) {
  useEffect(() => {
    if (!isPending) {
      return;
    }

    startNavigationProgress();
    return () => {
      completeNavigationProgress();
    };
  }, [isPending]);
}
