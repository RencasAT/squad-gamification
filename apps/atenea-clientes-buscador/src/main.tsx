import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import BusquedaClientesRemote from './export-busqueda-clientes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BusquedaClientesRemote />
  </StrictMode>,
);
