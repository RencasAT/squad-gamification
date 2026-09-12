import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const appsDir = path.join(repoRoot, 'apps');
const extraArgs = process.argv.slice(2);

/** Apps con Vite + federation (host-shell no publica remoteEntry). */
function listRemotes() {
  return readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => name !== 'host-shell')
    .filter((name) => {
      const dir = path.join(appsDir, name);
      return (
        existsSync(path.join(dir, 'vite.config.ts')) &&
        existsSync(path.join(dir, 'module-federation.config.ts'))
      );
    })
    .sort();
}

function buildRemote(name) {
  const config = path.join('apps', name, 'vite.config.ts');
  console.log(`\n▸ ${name}`);
  const result = spawnSync(
    'pnpm',
    ['exec', 'vite', 'build', '--config', config, ...extraArgs],
    {
      cwd: repoRoot,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

/** El host/proxy pide `/mockServiceWorker.js` en el origen de remotes. */
function copyMockServiceWorker() {
  const source = path.join(
    repoRoot,
    'apps/host-shell/public/mockServiceWorker.js',
  );
  const dist = path.join(repoRoot, 'dist');
  if (!existsSync(source)) {
    console.warn('⚠ No está apps/host-shell/public/mockServiceWorker.js');
    return;
  }
  mkdirSync(dist, { recursive: true });
  copyFileSync(source, path.join(dist, 'mockServiceWorker.js'));
  console.log('\n✓ dist/mockServiceWorker.js');
}

const remotes = listRemotes();
if (remotes.length === 0) {
  console.error('No hay remotes (apps/*/module-federation.config.ts).');
  process.exit(1);
}

console.log(`Build serial (${remotes.length}): ${remotes.join(', ')}`);
for (const name of remotes) {
  buildRemote(name);
}
copyMockServiceWorker();
