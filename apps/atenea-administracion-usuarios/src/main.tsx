import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import UsersRemote from './export-users';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UsersRemote />
  </StrictMode>,
);
