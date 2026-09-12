import path from 'node:path';

const REMOTES = [
  'atenea-gamificacion-analisis-modelado',
  'atenea-clientes-buscador',
  'atenea-contenido-rachas',
  'atenea-gamificacion-contenido',
  'atenea-gamificacion-dashboard',
  'atenea-admin-logs',
  'atenea-gamificacion-media',
  'atenea-admin-notificaciones',
  'atenea-gamificacion-premios',
  'atenea-administracion-roles',
  'atenea-gamificacion-simulaciones',
  'atenea-ui-kit',
  'atenea-administracion-usuarios',
] as const;

export function gamificationAliases(repoRoot: string): Record<string, string> {
  const alias: Record<string, string> = {
    '@gamification/shared-ui': path.resolve(repoRoot, 'packages/shared-ui/src'),
    '@gamification/shared-utils': path.resolve(
      repoRoot,
      'packages/shared-utils/src',
    ),
    '@gamification/host-shell': path.resolve(repoRoot, 'apps/host-shell/src'),
    '@mocks': path.resolve(repoRoot, 'mocks'),
  };

  for (const name of REMOTES) {
    alias[`@gamification/${name}`] = path.resolve(repoRoot, `apps/${name}/src`);
  }

  return alias;
}

export const remotePackageNames = REMOTES;
