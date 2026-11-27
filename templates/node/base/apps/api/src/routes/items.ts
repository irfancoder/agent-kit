import type { FastifyInstance } from 'fastify';
import type { Db } from '../db/index.ts';
import { createItem, getItem, listItems } from '../db/items.ts';
import { defineRoute } from '../define-route.ts';
import { notFound } from '../errors.ts';

export function itemRoutes(app: FastifyInstance, db: Db): void {
  defineRoute(app, 'listItems', async () => ({ items: await listItems(db) }));

  defineRoute(app, 'createItem', async ({ body }) => createItem(db, body.name));

  defineRoute(app, 'getItem', async ({ params }) => {
    const item = await getItem(db, params.id);
    if (!item) throw notFound('Item not found');
    return item;
  });
}
