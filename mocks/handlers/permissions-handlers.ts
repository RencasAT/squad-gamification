import { http } from 'msw';
import { apiPath } from '../api-path';
import { mockPermissionModules } from '../data/permissions.mock';
import { okJson, withMockDelay } from '../mock-utils';

export const permissionsHandlers = [
  http.get(apiPath('/permissions'), async () => {
    await withMockDelay();
    return okJson({ data: structuredClone(mockPermissionModules) });
  }),
];
