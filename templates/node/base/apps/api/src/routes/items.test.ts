import { describe, expect, test } from '@rstest/core';
import {
  DummyDriver,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from 'kysely';
import { buildApp } from '../app.ts';
import type { Database } from '../db/schema.ts';

// A Kysely instance with no database behind it: every query returns no rows.
// Enough to test routing, validation and the error shape without a database.
const db = new Kysely<Database>({
  dialect: {
    createAdapter: () => new PostgresAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (k) => new PostgresIntrospector(k),
    createQueryCompiler: () => new PostgresQueryCompiler(),
  },
});

describe('items routes', async () => {
  const app = await buildApp({ db, logger: false });

  test('GET /healthz', async () => {
    const res = await app.inject({ method: 'GET', url: '/healthz' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });

  test('GET /items returns a list', async () => {
    const res = await app.inject({ method: 'GET', url: '/items' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ items: [] });
  });

  test('POST /items rejects an empty name with the error shape', async () => {
    const res = await app.inject({ method: 'POST', url: '/items', payload: { name: '  ' } });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({
      error: { code: 'BAD_REQUEST', details: [{ path: 'name', message: 'Name is required' }] },
    });
  });

  test('GET /items/:id rejects a bad id', async () => {
    const res = await app.inject({ method: 'GET', url: '/items/not-a-uuid' });
    expect(res.statusCode).toBe(400);
  });

  test('GET /items/:id returns 404 for a missing item', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/items/7c9e6679-7425-40de-944b-e07fc1f90ae7',
    });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toMatchObject({ error: { code: 'NOT_FOUND' } });
  });

  test('unknown routes use the error shape', async () => {
    const res = await app.inject({ method: 'GET', url: '/nope' });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toMatchObject({ error: { code: 'NOT_FOUND' } });
  });

  test('GET /openapi.json lists the contract routes', async () => {
    const res = await app.inject({ method: 'GET', url: '/openapi.json' });
    expect(Object.keys(res.json().paths)).toContain('/items/{id}');
  });
});
