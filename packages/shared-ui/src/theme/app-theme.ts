import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

/** Preset Aura para Prime. La paleta de marca vive en `packages/shared-ui/src/index.css` (@theme). */
export const AppTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}',
    },
  },
});
