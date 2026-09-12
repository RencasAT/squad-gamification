import { authHandlers } from './auth-handlers';
import { clientsHandlers } from './clients-handlers';
import { permissionsHandlers } from './permissions-handlers';
import { rachasHandlers } from './rachas-handlers';
import { rolesHandlers } from './roles-handlers';
import { usersHandlers } from './users-handlers';

export const handlers = [
  ...authHandlers,
  ...usersHandlers,
  ...rolesHandlers,
  ...permissionsHandlers,
  ...clientsHandlers,
  ...rachasHandlers,
];
