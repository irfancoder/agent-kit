import { toJsonSchema } from '@valibot/to-json-schema';
import type * as v from 'valibot';
import { ErrorResponse } from './errors.ts';
import { routes, type RouteDef } from './routes.ts';

type Json = Record<string, unknown>;

function schema(s: v.GenericSchema): Json {
  const { $schema: _ignored, ...rest } = toJsonSchema(s, { errorMode: 'ignore' }) as Json;
  return rest;
}

function pathParams(path: string): string[] {
  return [...path.matchAll(/:([A-Za-z0-9_]+)/g)].map((m) => m[1] as string);
}

function operation(key: string, route: RouteDef, error: Json): Json {
  const parameters: Json[] = [];
  const paramSchema = route.params ? schema(route.params) : undefined;
  for (const name of pathParams(route.path)) {
    const props = (paramSchema?.properties ?? {}) as Record<string, Json>;
    parameters.push({
      name,
      in: 'path',
      required: true,
      schema: props[name] ?? { type: 'string' },
    });
  }
  if (route.query) {
    const q = schema(route.query);
    const required = new Set((q.required as string[] | undefined) ?? []);
    for (const [name, s] of Object.entries((q.properties ?? {}) as Record<string, Json>)) {
      parameters.push({ name, in: 'query', required: required.has(name), schema: s });
    }
  }
  return {
    operationId: key,
    summary: route.summary,
    ...(route.tags ? { tags: route.tags } : {}),
    ...(parameters.length ? { parameters } : {}),
    ...(route.body
      ? {
          requestBody: {
            required: true,
            content: { 'application/json': { schema: schema(route.body) } },
          },
        }
      : {}),
    responses: {
      [String(route.status ?? 200)]: {
        description: 'Success',
        content: { 'application/json': { schema: schema(route.response) } },
      },
      ...(route.body || route.params || route.query ? { '400': error } : {}),
      ...(route.params ? { '404': error } : {}),
      default: error,
    },
  };
}

/** Builds the OpenAPI 3.1 document from the route map. */
export function generateOpenApi(info: { title: string; version: string }): Json {
  const error = {
    description: 'Error',
    content: { 'application/json': { schema: schema(ErrorResponse) } },
  };
  const paths: Record<string, Json> = {};
  for (const [key, route] of Object.entries(routes) as [string, RouteDef][]) {
    const openApiPath = route.path.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
    paths[openApiPath] = {
      ...paths[openApiPath],
      [route.method.toLowerCase()]: operation(key, route, error),
    };
  }
  return { openapi: '3.1.0', info, paths };
}
