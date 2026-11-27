import {
  ErrorResponse,
  routes,
  type RouteBody,
  type RouteKey,
  type RouteParams,
  type RouteResponse,
} from '@kitapp/contracts';
import ky, { HTTPError } from 'ky';
import * as v from 'valibot';

const http = ky.create({ prefix: '/api', retry: 0 });

type CallArgs<K extends RouteKey> = ([RouteParams<K>] extends [never]
  ? { params?: never }
  : { params: RouteParams<K> }) &
  ([RouteBody<K>] extends [never] ? { body?: never } : { body: RouteBody<K> });

/** The api's error, with the code and message from the error shape. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function fillPath(path: string, params: Record<string, string> | undefined): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, (_, name: string) =>
    encodeURIComponent(params?.[name] ?? ''),
  );
}

/** Calls one route of the contract and validates the response against it. */
export async function call<K extends RouteKey>(
  key: K,
  ...[args]: {} extends CallArgs<K> ? [CallArgs<K>?] : [CallArgs<K>]
): Promise<RouteResponse<K>> {
  const route = routes[key];
  const a = (args ?? {}) as { params?: Record<string, string>; body?: unknown };
  try {
    const data = await http(fillPath(route.path, a.params).slice(1), {
      method: route.method,
      ...(a.body === undefined ? {} : { json: a.body }),
    }).json();
    return v.parse(route.response, data) as RouteResponse<K>;
  } catch (error) {
    if (error instanceof HTTPError) {
      const body = v.safeParse(ErrorResponse, await error.response.json().catch(() => null));
      if (body.success)
        throw new ApiError(
          error.response.status,
          body.output.error.code,
          body.output.error.message,
        );
      throw new ApiError(error.response.status, 'UNKNOWN', error.message);
    }
    throw error;
  }
}
