import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router';
import { RemoteFeature } from '@gamification/shared-ui/remote-feature';
import { RolesListPage } from './roles-list-page';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* El host monta el módulo dentro de SU router; suelto necesita uno propio. */}
    {/* <BrowserRouter basename="/atenea-administracion-roles"> */}
    <RemoteFeature>
      <RolesListPage />
    </RemoteFeature>
    {/* </BrowserRouter> */}
  </StrictMode>,
);
