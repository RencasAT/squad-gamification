import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ShellProviders } from './shell-providers';
import { App } from './app';
import { installAuthHttpInterceptors } from './auth/http-interceptors';
import '@gamification/shared-ui/index.css';
import '@gamification/shared-ui/shell.css';
import { enableMocking } from '@mocks/enable-mocking';

installAuthHttpInterceptors();

async function bootstrap() {
  await enableMocking();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ShellProviders>
        <App />
      </ShellProviders>
    </StrictMode>,
  );
}

void bootstrap();
