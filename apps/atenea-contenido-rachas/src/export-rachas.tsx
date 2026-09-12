import { RachasPage } from './rachas-page';
import { RemoteFeature } from '@gamification/shared-ui/remote-feature';
import { RemoteBridge } from '@gamification/shared-ui/remote-bridge';
import type { FederatedRemoteProps } from '@gamification/shared-utils/access';

/** Remote de Module Federation: rachas (contenido), sin layout del backoffice. */
export default function RachasRemote({
  token,
  roles,
  onUnauthorized,
}: FederatedRemoteProps) {
  return (
    <RemoteFeature>
      <RemoteBridge token={token} roles={roles} onUnauthorized={onUnauthorized}>
        <RachasPage />
      </RemoteBridge>
    </RemoteFeature>
  );
}
