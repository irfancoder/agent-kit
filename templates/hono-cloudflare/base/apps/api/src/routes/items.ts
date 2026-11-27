import type { Hono } from 'hono';
import type { AppEnv } from '../app.ts';
import { createItem, getItem, listItems } from '../db/items.ts';
import { defineRoute } from '../define-route.ts';
import { notFound } from '../errors.ts';

export function itemRoutes(app: Hono<AppEnv>): void {
  defineRoute(app, 'listItems', async (_input, c) => ({
    items: await listItems(await c.get('db')()),
  }));

  defineRoute(app, 'createItem', async ({ body }, c) => createItem(await c.get('db')(), body.name));

  defineRoute(app, 'getItem', async ({ params }, c) => {
    const item = await getItem(await c.get('db')(), params.id);
    if (!item) throw notFound('Item not found');
    return item;
  });
}
