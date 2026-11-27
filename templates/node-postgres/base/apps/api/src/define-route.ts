import {
  routes,
  type RouteDef,
  type RouteInput,
  type RouteKey,
  type RouteResponse,
} from '@kitapp/contracts';
import type { FastifyInstance } from 'fastify';
import * as v from 'valibot';
import { parseRequest } from './validate.ts';

/**
 * Registers the handler for one entry of the contracts route map. The request
 * is validated against the route's schemas before the handler runs, and the
 * response is validated before it is sent, so the api can't drift from the
 * contract.
 */
export function defineRoute<K extends RouteKey>(
  app: FastifyInstance,
  key: K,
  handler: (input: RouteInput<K>) => Promise<RouteResponse<K>>,
): void {
  const route: RouteDef = routes[key];
  app.route({
    method: route.method,
    url: route.path,
    handler: async (request, reply) => {
      const input = {
        params: parseRequest(route.params, request.params),
        query: parseRequest(route.query, request.query),
        body: parseRequest(route.body, request.body),
      } as RouteInput<K>;
      const output = await handler(input);
      const checked = v.safeParse(route.response, output);
      if (!checked.success) {
        request.log.error(
          { issues: checked.issues, route: key },
          'response does not match contract',
        );
        throw new Error(`Response for ${key} does not match its contract`);
      }
      return reply.status(route.status ?? 200).send(checked.output);
    },
  });
}
