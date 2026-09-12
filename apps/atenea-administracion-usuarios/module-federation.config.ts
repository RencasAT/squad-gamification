import { createModuleFederationConfig } from '@module-federation/vite';
import {
  MF_BUILD_TARGET,
  MF_SHARE_STRATEGY,
  sharedDependencies,
} from '@atbo/mf-kit/shared';
import { hostFederationRemote } from '../../federation-serve.ts';

export const remoteBasePath = '/atenea-administracion-usuarios/';

export default createModuleFederationConfig({
  name: 'atenea-administracion-usuarios',
  filename: 'remoteEntry.js',
  dts: false,
  bundleAllCSS: true,
  remotes: hostFederationRemote,
  shareStrategy: MF_SHARE_STRATEGY,
  exposes: {
    './page': './src/export-users.tsx',
    './module': './src/module.tsx',
  },
  shared: sharedDependencies,
  build: {
    target: MF_BUILD_TARGET,
  },
});
