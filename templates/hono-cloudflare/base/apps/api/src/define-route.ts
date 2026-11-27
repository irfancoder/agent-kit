import {
  routes,
  type RouteDef,
  type RouteInput,
  type RouteKey,
  type RouteResponse,
} from '@kitapp/contracts';
import type { Context, Hono } from 'hono';
import * as v from 'valibot';
import { parseRequest } from './validate.ts';
import type { AppEnv } from './app.ts';

/**
 * Registers the handler for one entry of the contracts route map. The request
 * is validated against the route's schemas before the handler runs, and the
 * response is validated before it is sent.
 */
export function defineRoute<K extends RouteKey>(
  app: Hono<AppEnv>,
  key: K,
  handler: (input: RouteInput<K>, c: Context<AppEnv>) => Promise<RouteResponse<K>>,
): void {
  const route: RouteDef = routes[key];
  app.on(route.method, route.path, async (c) => {
    const body = route.body ? await c.req.json().catch(() => undefined) : undefined;
    const input = {
      params: parseRequest(route.params, c.req.param()),
      query: parseRequest(route.query, c.req.query()),
      body: parseRequest(route.body, body),
    } as RouteInput<K>;
    const output = await handler(input, c);
    const checked = v.safeParse(route.response, output);
    if (!checked.success) {
      console.error(
        JSON.stringify({ level: 'error', msg: 'response does not match contract', route: key }),
      );
      throw new Error(`Response for ${key} does not match its contract`);
    }
    return c.json(checked.output, (route.status ?? 200) as 200);
  });
}
