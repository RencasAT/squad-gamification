import { Suspense } from 'react';
import { RouterProvider } from 'react-router';
import { ModuleLoader } from '@gamification/shared-ui/components/module-loader';
import { appRoutes } from './app.routes';

export function App() {
  return (
    <Suspense fallback={<ModuleLoader variant="fullscreen" />}>
      <RouterProvider router={appRoutes} />
    </Suspense>
  );
}
