import { errorCodes } from '@kitapp/contracts';
import { generateOpenApi } from '@kitapp/contracts/openapi';
import scalar from '@scalar/fastify-api-reference';
import Fastify, { type FastifyBaseLogger, type FastifyInstance } from 'fastify';
import type { Kysely } from 'kysely';
import type { Logger } from 'pino';
import type { Database } from './db/schema.ts';
import { defineRoute } from './define-route.ts';
import { HttpError } from './errors.ts';
import { itemRoutes } from './routes/items.ts';

export const APP_TITLE = 'Kit App';

export async function buildApp(opts: {
  db: Kysely<Database>;
  logger?: Logger | false;
}): Promise<FastifyInstance> {
  const app = Fastify(
    opts.logger ? { loggerInstance: opts.logger as FastifyBaseLogger } : { logger: false },
  );

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof HttpError) return reply.status(error.status).send(error.toBody());
    const status = (error as { statusCode?: number }).statusCode;
    if (status && status >= 400 && status < 500) {
      return reply
        .status(status)
        .send({ error: { code: errorCodes.badRequest, message: (error as Error).message } });
    }
    request.log.error({ err: error }, 'unhandled error');
    return reply
      .status(500)
      .send({ error: { code: errorCodes.internal, message: 'Internal server error' } });
  });

  app.setNotFoundHandler((_request, reply) =>
    reply.status(404).send({ error: { code: errorCodes.notFound, message: 'Route not found' } }),
  );

  const openapi = generateOpenApi({ title: APP_TITLE, version: '0.0.0' });
  app.get('/openapi.json', async () => openapi);
  await app.register(scalar, { routePrefix: '/docs', configuration: { url: '/openapi.json' } });

  defineRoute(app, 'health', async () => ({ ok: true }));
  itemRoutes(app, opts.db);

  return app;
}
