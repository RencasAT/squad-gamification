import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gamificationAliases } from '../../workspace-alias.ts';

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(appRoot, '../..');

export default defineConfig({
  root: appRoot,
  envDir: repoRoot,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: gamificationAliases(repoRoot),
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    cors: true,
    fs: {
      allow: [repoRoot],
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 5173,
    cors: true,
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
});
