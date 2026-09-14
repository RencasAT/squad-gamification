import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Levanta TODOS los remotes en modo dev, uno por puerto.
 *
 * No vale `preview` (build) mientras el host ATBO corre en dev: el remote
 * construido se trae su propia copia de React y gana el share scope, así que en
 * cuanto usa algo del host (`host/layout`) revienta con un `useContext` de null.
 * Con ambos lados en dev, el host es el proveedor de los singletons.
 *
 * El puerto de cada módulo vive en su `vite.config.ts` (`server.port`), que es
 * también el que el host espera en `VITE_MF_<KEY>_ENTRY`.
 */
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const remotes = [
  'atenea-administracion-usuarios',
  'atenea-administracion-roles',
  'atenea-clientes-buscador',
  'atenea-contenido-rachas',
];

const children = remotes.map((name) =>
  spawn(
    'pnpm',
    ['exec', 'vite', '--config', path.join('apps', name, 'vite.config.ts')],
    {
      cwd: repoRoot,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    },
  ),
);

const stopAll = () => {
  for (const child of children) child.kill('SIGTERM');
};

process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);

for (const child of children) {
  child.on('exit', (code) => {
    if (code) {
      stopAll();
      process.exit(code);
    }
  });
}
