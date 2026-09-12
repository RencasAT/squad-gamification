import { http } from 'msw';
import { apiPath } from '../api-path';
import {
  addClientGroups,
  getOrCreateClient,
  listClientGroups,
  listGroupsCatalog,
  removeClientGroup,
} from '../db/clients.store';
import { errorJson, okJson, withMockDelay } from '../mock-utils';

type AddGroupsBody = {
  groupIds?: number[];
};

export const clientsHandlers = [
  http.get(apiPath('/clients/:id'), async ({ params }) => {
    await withMockDelay();
    const id = String(params.id ?? '');
    const client = getOrCreateClient(id);
    if (!client) {
      return errorJson(404, 'Cliente no encontrado');
    }
    return okJson({ data: client });
  }),

  http.get(apiPath('/clients/:id/summary'), async ({ params }) => {
    await withMockDelay();
    const client = getOrCreateClient(String(params.id ?? ''));
    if (!client) {
      return errorJson(404, 'Cliente no encontrado');
    }
    return okJson({ data: client.resumen });
  }),

  http.get(apiPath('/clients/:id/groups'), async ({ params }) => {
    await withMockDelay();
    const groups = listClientGroups(String(params.id ?? ''));
    if (!groups) {
      return errorJson(404, 'Cliente no encontrado');
    }
    return okJson({ data: groups });
  }),

  http.post(apiPath('/clients/:id/groups'), async ({ params, request }) => {
    await withMockDelay();
    const body = (await request.json()) as AddGroupsBody;
    const groupIds = body.groupIds ?? [];
    if (groupIds.length === 0) {
      return errorJson(400, 'Debes indicar al menos un grupo');
    }
    const groups = addClientGroups(String(params.id ?? ''), groupIds);
    if (!groups) {
      return errorJson(404, 'Cliente no encontrado');
    }
    return okJson({ data: groups });
  }),

  http.delete(apiPath('/clients/:id/groups/:groupId'), async ({ params }) => {
    await withMockDelay();
    const groups = removeClientGroup(
      String(params.id ?? ''),
      Number(params.groupId),
    );
    if (!groups) {
      return errorJson(404, 'Cliente o grupo no encontrado');
    }
    return okJson({ data: groups });
  }),

  http.get(apiPath('/groups'), async () => {
    await withMockDelay();
    return okJson({ data: listGroupsCatalog() });
  }),

  http.get(apiPath('/clients/:id/achievements'), async ({ params }) => {
    await withMockDelay();
    const client = getOrCreateClient(String(params.id ?? ''));
    if (!client) {
      return errorJson(404, 'Cliente no encontrado');
    }
    return okJson({ data: client.logros });
  }),

  http.get(apiPath('/clients/:id/tournaments'), async ({ params }) => {
    await withMockDelay();
    const client = getOrCreateClient(String(params.id ?? ''));
    if (!client) {
      return errorJson(404, 'Cliente no encontrado');
    }
    return okJson({ data: client.torneos });
  }),

  http.get(apiPath('/clients/:id/missions'), async ({ params }) => {
    await withMockDelay();
    const client = getOrCreateClient(String(params.id ?? ''));
    if (!client) {
      return errorJson(404, 'Cliente no encontrado');
    }
    return okJson({ data: client.misiones });
  }),
];
