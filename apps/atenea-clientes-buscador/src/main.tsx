import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router';
import BusquedaClientesRemote from './export-busqueda-clientes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* El host monta el módulo dentro de SU router; suelto necesita uno propio. */}
    {/* <BrowserRouter basename="/atenea-clientes-buscador"> */}
    <BusquedaClientesRemote />
    {/* </BrowserRouter> */}
  </StrictMode>,
);
