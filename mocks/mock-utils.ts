import { delay, HttpResponse, type JsonBodyType } from 'msw';

export const MOCK_DELAY_MS = 400;

export async function withMockDelay(): Promise<void> {
  // En Vitest evitamos latencia artificial.
  if (import.meta.env.MODE === 'test') {
    return;
  }
  await delay(MOCK_DELAY_MS);
}

export function okJson<T extends JsonBodyType>(data: T, init?: ResponseInit) {
  return HttpResponse.json(data, init);
}

export function errorJson(status: number, message: string) {
  return HttpResponse.json({ message }, { status });
}
