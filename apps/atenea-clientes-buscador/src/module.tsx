import {
  CONTRACT_VERSION,
  type MicrofrontendModule,
} from '@atbo/mf-kit/contract';
import type { RouteObject } from 'react-router';
import { RemoteFeature } from '@gamification/shared-ui/remote-feature';
import { DashboardLayout } from 'host/layout';
import { BusquedaClientesPage } from './busqueda-clientes-page';

/**
 * El chrome del backoffice (sidebar, header, breadcrumb) llega del host por
 * federación. Va en esta entrada, la federada, y no en `RemoteFeature`: el modo
 * standalone (`src/main.tsx`) comparte ese bootstrap y no debe depender del host.
 */

const routes = [
  {
    path: '',
    element: (
      <DashboardLayout
        breadcrumb={{
          current: 'Búsqueda de clientes',
          items: [{ label: 'Gamification', to: '#' }],
        }}
      >
        <RemoteFeature>
          <BusquedaClientesPage />
        </RemoteFeature>
      </DashboardLayout>
    ),
  },
] satisfies RouteObject[];

export default {
  contractVersion: CONTRACT_VERSION,
  routes,
} satisfies MicrofrontendModule;
