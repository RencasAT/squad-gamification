import { BusquedaClientesPage } from './busqueda-clientes-page';
import { RemoteFeature } from '@gamification/shared-ui/remote-feature';
import { RemoteBridge } from '@gamification/shared-ui/remote-bridge';
import type { FederatedRemoteProps } from '@gamification/shared-utils/access';

/** Remote de Module Federation: búsqueda de clientes, sin layout del backoffice. */
export default function BusquedaClientesRemote({
  token,
  roles,
  onUnauthorized,
}: FederatedRemoteProps) {
  return (
    <RemoteFeature>
      <RemoteBridge token={token} roles={roles} onUnauthorized={onUnauthorized}>
        <BusquedaClientesPage />
      </RemoteBridge>
    </RemoteFeature>
  );
}
