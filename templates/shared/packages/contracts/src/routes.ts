import * as v from 'valibot';
import { CreateItem, Item, ItemList, ItemParams } from './items.ts';

type Schema = v.GenericSchema;

export interface RouteDef {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Path with `:param` segments, as Fastify and Hono both write them. */
  path: string;
  summary: string;
  tags?: string[];
  params?: Schema;
  query?: Schema;
  body?: Schema;
  response: Schema;
  /** Success status. Defaults to 200. */
  status?: number;
}

export const Health = v.object({ ok: v.literal(true) });

/**
 * The one route map. The api registers a handler for each entry, the web
 * client calls them by key, and the OpenAPI document is generated from it.
 * API changes start here.
 */
export const routes = {
  health: {
    method: 'GET',
    path: '/healthz',
    summary: 'Health check',
    tags: ['system'],
    response: Health,
  },
  listItems: {
    method: 'GET',
    path: '/items',
    summary: 'List items, newest first',
    tags: ['items'],
    response: ItemList,
  },
  createItem: {
    method: 'POST',
    path: '/items',
    summary: 'Create an item',
    tags: ['items'],
    body: CreateItem,
    response: Item,
    status: 201,
  },
  getItem: {
    method: 'GET',
    path: '/items/:id',
    summary: 'Get one item',
    tags: ['items'],
    params: ItemParams,
    response: Item,
  },
} as const satisfies Record<string, RouteDef>;

export type Routes = typeof routes;
export type RouteKey = keyof Routes;

type Out<S> = S extends Schema ? v.InferOutput<S> : never;
type In<S> = S extends Schema ? v.InferInput<S> : never;

export type RouteResponse<K extends RouteKey> = Out<Routes[K]['response']>;
export type RouteBody<K extends RouteKey> = Routes[K] extends { body: infer B } ? In<B> : never;
export type RouteParams<K extends RouteKey> = Routes[K] extends { params: infer P } ? In<P> : never;
export type RouteQuery<K extends RouteKey> = Routes[K] extends { query: infer Q } ? In<Q> : never;

/** What a handler receives once the request is validated (schema outputs, undefined when absent). */
export type RouteInput<K extends RouteKey> = {
  params: Routes[K] extends { params: infer P } ? Out<P> : undefined;
  query: Routes[K] extends { query: infer Q } ? Out<Q> : undefined;
  body: Routes[K] extends { body: infer B } ? Out<B> : undefined;
};
