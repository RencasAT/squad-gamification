import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RemoteFeature } from '@gamification/shared-ui/remote-feature';
import { RolesListPage } from './roles-list-page';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RemoteFeature>
      <RolesListPage />
    </RemoteFeature>
  </StrictMode>,
);
