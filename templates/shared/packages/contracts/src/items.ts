import * as v from 'valibot';

export const Item = v.object({
  id: v.pipe(v.string(), v.uuid()),
  name: v.string(),
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
});
export type Item = v.InferOutput<typeof Item>;

export const ItemList = v.object({ items: v.array(Item) });
export type ItemList = v.InferOutput<typeof ItemList>;

export const CreateItem = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Name is required'), v.maxLength(120)),
});
export type CreateItem = v.InferInput<typeof CreateItem>;

export const ItemParams = v.object({ id: v.pipe(v.string(), v.uuid()) });
