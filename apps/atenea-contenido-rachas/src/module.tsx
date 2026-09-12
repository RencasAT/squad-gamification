import type { RouteObject } from 'react-router';
import { RemoteFeature } from '@gamification/shared-ui/remote-feature';
import { RachasPage } from './rachas-page';

/** Misma versión que `@atbo/mf-kit/contract` en el host ATBO. */
const CONTRACT_VERSION = 1;

const routes = [
  {
    path: '',
    element: (
      <RemoteFeature>
        <RachasPage />
      </RemoteFeature>
    ),
  },
] satisfies RouteObject[];

export default {
  contractVersion: CONTRACT_VERSION,
  routes,
};
