import { Outlet } from 'react-router';
import { NavigationProgressListener } from '@gamification/shared-ui/components/navigation-progress';

/** Layout raíz: sincroniza la barra de progreso con los cambios de ruta. */
export function AppRoot() {
  return (
    <>
      <NavigationProgressListener />
      <Outlet />
    </>
  );
}
