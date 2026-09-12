import type { RouteObject } from 'react-router';
import { RemoteFeature } from '@gamification/shared-ui/remote-feature';
import { BusquedaClientesPage } from './busqueda-clientes-page';

/** Misma versión que `@atbo/mf-kit/contract` en el host ATBO. */
const CONTRACT_VERSION = 1;

const routes = [
  {
    path: '',
    element: (
      <RemoteFeature>
        <BusquedaClientesPage />
      </RemoteFeature>
    ),
  },
] satisfies RouteObject[];

export default {
  contractVersion: CONTRACT_VERSION,
  routes,
};
