import { http } from 'msw';
import { apiPath } from '../api-path';
import {
  listCampaignRachas,
  listFeaturedRachas,
  setCampaignRachaActive,
} from '../db/rachas.store';
import { errorJson, okJson, withMockDelay } from '../mock-utils';

export const rachasHandlers = [
  http.get(apiPath('/rachas/featured'), async ({ request }) => {
    await withMockDelay();
    const url = new URL(request.url);
    const activeParam = url.searchParams.get('active');
    const active =
      activeParam === 'true'
        ? true
        : activeParam === 'false'
          ? false
          : undefined;

    return okJson({
      data: listFeaturedRachas({
        q: url.searchParams.get('q') ?? undefined,
        active,
      }),
    });
  }),

  http.get(apiPath('/rachas/campaigns'), async ({ request }) => {
    await withMockDelay();
    const url = new URL(request.url);
    const activeParam = url.searchParams.get('active');
    const active =
      activeParam === 'true'
        ? true
        : activeParam === 'false'
          ? false
          : undefined;

    return okJson({
      data: listCampaignRachas({
        q: url.searchParams.get('q') ?? undefined,
        active,
      }),
    });
  }),

  http.patch(
    apiPath('/rachas/campaigns/:id/active'),
    async ({ params, request }) => {
      await withMockDelay();
      const id = Number(params.id);
      const body = (await request.json()) as { active?: boolean };
      if (typeof body.active !== 'boolean') {
        return errorJson(400, 'active es requerido');
      }
      const updated = setCampaignRachaActive(id, body.active);
      if (!updated) {
        return errorJson(404, 'Racha no encontrada');
      }
      return okJson({ data: updated });
    },
  ),
];
