import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { gamificationAliases } from './workspace-alias.ts';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: gamificationAliases(path.resolve(__dirname)),
  },
  test: {
    environment: 'jsdom',
    css: false,
    include: ['test/unit/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./test/setup/unit.ts'],
  },
});
