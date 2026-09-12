import { createModuleFederationConfig } from '@module-federation/vite';
import { hostFederationRemote } from '../../federation-serve.ts';

import {
  MF_BUILD_TARGET,
  MF_SHARE_STRATEGY,
  sharedDependencies,
} from '@atbo/mf-kit/shared';

export const remoteBasePath = '/atenea-contenido-rachas/';

export default createModuleFederationConfig({
  name: 'atenea-contenido-rachas',
  filename: 'remoteEntry.js',
  bundleAllCSS: true,
  dts: false,
  remotes: hostFederationRemote,
  shareStrategy: MF_SHARE_STRATEGY,
  build: {
    target: MF_BUILD_TARGET,
  },
  exposes: {
    './page': './src/export-rachas.tsx',
    './module': './src/module.tsx',
  },
  shared: sharedDependencies,
});
