import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { remotesCors, remotesSecurityHeaders } from './federation-serve.ts';

const repoRoot = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(repoRoot, 'dist');

fs.mkdirSync(dist, { recursive: true });

const indexPath = path.join(dist, 'index.html');
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(
    indexPath,
    '<!doctype html><html lang="es"><head><meta charset="UTF-8"/><title>Remotes</title></head><body><p>Entorno de hijos. Cada módulo: /[modulo]/remoteEntry.js</p></body></html>\n',
  );
}

/** Sirve `dist/` como un solo origen (un path por remote). */
export default defineConfig({
  appType: 'mpa',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
  },
  preview: {
    host: 'localhost',
    port: 5177,
    cors: remotesCors,
    headers: remotesSecurityHeaders,
  },
});
