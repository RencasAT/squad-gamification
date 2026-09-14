import { createModuleFederationConfig } from '@module-federation/vite';
import {
  hostFederationRemote,
  remoteSharedDependencies,
} from '../../federation-serve.ts';
import { MF_BUILD_TARGET, MF_SHARE_STRATEGY } from '@atbo/mf-kit/shared';

export const remoteBasePath = '/atenea-administracion-roles/';

export default createModuleFederationConfig({
  name: 'atenea-administracion-roles',
  filename: 'remoteEntry.js',
  dts: false,
  bundleAllCSS: true,
  remotes: hostFederationRemote,
  shareStrategy: MF_SHARE_STRATEGY,
  exposes: {
    './module': './src/module.tsx',
  },
  shared: remoteSharedDependencies,
  build: {
    target: MF_BUILD_TARGET,
  },
});
