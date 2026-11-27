import { errorCodes } from '@kitapp/contracts';
import { generateOpenApi } from '@kitapp/contracts/openapi';
import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono';
import type { Db } from './db/index.ts';
import { defineRoute } from './define-route.ts';
import { HttpError } from './errors.ts';
import { itemRoutes } from './routes/items.ts';

export const APP_TITLE = 'Kit App';

/** `db()` opens the request's database on first use and closes it after the response. */
export type AppEnv = { Variables: { db: () => Promise<Db> } };

/** Opens a database for one request (a Worker binding in production, a stub in unit tests). */
export type Connect = (env: unknown) => Promise<{ db: Db; close: () => Promise<void> }>;

export function buildApp(connect: Connect): Hono<AppEnv> {
  const app = new Hono<AppEnv>();

  app.onError((error, c) => {
    if (error instanceof HttpError) return c.json(error.toBody(), error.status);
    console.error(JSON.stringify({ level: 'error', msg: 'unhandled error', err: String(error) }));
    return c.json({ error: { code: errorCodes.internal, message: 'Internal server error' } }, 500);
  });
  app.notFound((c) =>
    c.json({ error: { code: errorCodes.notFound, message: 'Route not found' } }, 404),
  );

  // Built on first request, not at isolate start-up.
  let openapi: ReturnType<typeof generateOpenApi> | undefined;
  app.get('/openapi.json', (c) =>
    c.json((openapi ??= generateOpenApi({ title: APP_TITLE, version: '0.0.0' }))),
  );
  app.get('/docs', Scalar({ url: '/openapi.json', pageTitle: APP_TITLE }));

  defineRoute(app, 'health', async () => ({ ok: true }));

  app.use('*', async (c, next) => {
    let opened: ReturnType<Connect> | undefined;
    c.set('db', async () => {
      opened ??= connect(c.env);
      return (await opened).db;
    });
    await next();
    if (opened) {
      const closing = opened.then((o) => o.close());
      try {
        c.executionCtx.waitUntil(closing);
      } catch {
        await closing; // no execution context outside Workers (unit tests)
      }
    }
  });
  itemRoutes(app);

  return app;
}
