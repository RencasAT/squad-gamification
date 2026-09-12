import type { PrimeReactProps } from '@primereact/types/core';
import { AppTheme } from './theme/app-theme';
import { environment } from '@gamification/shared-utils/environments/environment';

/** Equivalente a providePrimeNG(...) — config de PrimeReactProvider. */
export const primeReactConfig = {
  ripple: true,
  license: environment.VITE_PRIMEUI_LICENSE,
  theme: {
    preset: AppTheme,
    options: {
      darkModeSelector: '.app-dark',
      // Tailwind v4: primereact después de base/theme y antes de utilities
      cssLayer: {
        name: 'primereact',
        order: 'theme, base, primereact',
      },
    },
  },
} satisfies PrimeReactProps;
