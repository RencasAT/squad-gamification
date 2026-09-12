import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RachasRemote from './export-rachas';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RachasRemote />
  </StrictMode>,
);
