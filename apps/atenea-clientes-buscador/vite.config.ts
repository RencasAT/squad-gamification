import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { federation } from '@module-federation/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gamificationAliases } from '../../workspace-alias.ts';
import {
  remotesCors,
  remotesRenderBuiltUrl,
  remotesSecurityHeaders,
} from '../../federation-serve.ts';
import moduleFederationConfig, {
  remoteBasePath,
} from './module-federation.config.ts';

const appRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(appRoot, '../..');

export default defineConfig(({ command, mode }): UserConfig => {
  const isProdBuild = command === 'build' && mode === 'production';

  return {
    root: appRoot,
    envDir: repoRoot,
    base: remoteBasePath,
    experimental: {
      renderBuiltUrl: remotesRenderBuiltUrl,
    },
    publicDir: isProdBuild
      ? false
      : path.resolve(repoRoot, 'apps/host-shell/public'),
    plugins: [federation(moduleFederationConfig), react(), tailwindcss()],
    resolve: {
      alias: gamificationAliases(repoRoot),
    },
    server: {
      host: '127.0.0.1',
      port: 5173,
      cors: remotesCors,
      origin: 'http://127.0.0.1:5173',
      headers: remotesSecurityHeaders,
      fs: {
        allow: [repoRoot],
      },
    },
    preview: {
      host: '127.0.0.1',
      port: 5173,
      cors: remotesCors,
      headers: remotesSecurityHeaders,
    },
    build: {
      target: 'esnext',
      sourcemap: false,
      outDir: path.resolve(repoRoot, 'dist/atenea-clientes-buscador'),
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000,
    },
  };
});
