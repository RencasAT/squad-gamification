import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import checkFile from 'eslint-plugin-check-file';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'dist',
    'coverage',
    'test-results',
    'playwright-report',
    'blob-report',
    'apps/host-shell/public/mockServiceWorker.js',
    '**/*.css',
  ]),
  {
    files: [
      'apps/**/*.{ts,tsx}',
      'packages/**/*.{ts,tsx}',
      'test/**/*.{ts,tsx}',
    ],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      'check-file/folder-naming-convention': [
        'error',
        {
          'apps/**/src/**/': 'KEBAB_CASE',
          'packages/**/src/**/': 'KEBAB_CASE',
          'test/**/': 'KEBAB_CASE',
        },
      ],
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': [
        'error',
        {
          allowExportNames: [
            'useAuth',
            'useUser',
            'useLogin',
            'useLogout',
            'useRegister',
            'AuthLoader',
            'useUiStore',
            'useAccess',
            'setAccessToken',
            'setUnauthorizedHandler',
            'hasAppRole',
            'APP_ROLES',
            'cn',
            'cva',
            'dayjs',
            'queryClient',
            'loginSchema',
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
]);
