import { createModuleFederationConfig } from '@module-federation/vite';
import {
  MF_BUILD_TARGET,
  MF_SHARE_STRATEGY,
  sharedDependencies,
} from '@atbo/mf-kit/shared';

import { hostFederationRemote } from '../../federation-serve.ts';

export const remoteBasePath = '/atenea-clientes-buscador/';

export default createModuleFederationConfig({
  name: 'atenea-clientes-buscador',
  filename: 'remoteEntry.js',
  dts: false,
  bundleAllCSS: true,
  remotes: hostFederationRemote,
  shareStrategy: MF_SHARE_STRATEGY,
  build: {
    target: MF_BUILD_TARGET,
  },
  exposes: {
    './page': './src/export-busqueda-clientes.tsx',
    './module': './src/module.tsx',
  },
  shared: sharedDependencies,
});
