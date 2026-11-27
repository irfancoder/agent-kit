import { describe, expect, test } from '@rstest/core';
import {
  DummyDriver,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from 'kysely';
import { buildApp } from './app.ts';
import type { Db } from './db/index.ts';

// A Kysely instance with no database behind it: every query returns no rows.
// Enough to test routing, validation and the error shape without a database.
const db = new Kysely({
  dialect: {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (k) => new PostgresIntrospector(k),
    createQueryCompiler: () => new PostgresQueryCompiler(),
  },
}) as unknown as Db;

const app = buildApp(async () => ({ db, close: async () => {} }));

describe('api', () => {
  test('GET /healthz', async () => {
    const res = await app.request('/healthz');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  test('GET /items returns a list', async () => {
    const res = await app.request('/items');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ items: [] });
  });

  test('POST /items rejects an empty name with the error shape', async () => {
    const res = await app.request('/items', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: '  ' }),
    });
    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({
      error: { code: 'BAD_REQUEST', details: [{ path: 'name', message: 'Name is required' }] },
    });
  });

  test('GET /items/:id returns 404 for a missing item', async () => {
    const res = await app.request('/items/7c9e6679-7425-40de-944b-e07fc1f90ae7');
    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({ error: { code: 'NOT_FOUND' } });
  });

  test('unknown routes use the error shape', async () => {
    const res = await app.request('/nope');
    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({ error: { code: 'NOT_FOUND' } });
  });

  test('GET /openapi.json lists the contract routes', async () => {
    const res = await app.request('/openapi.json');
    const doc = (await res.json()) as { paths: Record<string, unknown> };
    expect(Object.keys(doc.paths)).toContain('/items/{id}');
  });
});
