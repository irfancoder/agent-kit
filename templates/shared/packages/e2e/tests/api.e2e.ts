import { Health } from '@kitapp/contracts';
import { expect, test } from 'e2e';

test('GET /healthz returns ok', async ({ request }) => {
  // The web server proxies /api/* to the api.
  const response = await request.get('/api/healthz');
  expect(response).toBeOK();
  const body = expect(await response.json()).toMatchSchema(Health);
  expect(body).toEqual({ ok: true });
});

test('GET /openapi.json describes the items routes', async ({ request }) => {
  const response = await request.get('/api/openapi.json');
  expect(response).toBeOK();
  const doc = (await response.json()) as { paths: Record<string, unknown> };
  expect(Object.keys(doc.paths)).toEqual(
    expect.arrayContaining(['/healthz', '/items', '/items/{id}']),
  );
});
