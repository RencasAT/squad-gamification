import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router';
import UsersRemote from './export-users';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* El host monta el módulo dentro de SU router; suelto necesita uno propio. */}
    {/* <BrowserRouter basename="/atenea-administracion-usuarios"> */}
    <UsersRemote />
    {/* </BrowserRouter> */}
  </StrictMode>,
);
