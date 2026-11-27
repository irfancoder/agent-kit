import type { Item } from '@kitapp/contracts';
import type { Selectable } from 'kysely';
import type { Db } from './index.ts';
import type { ItemsTable } from './schema.ts';

const toItem = (row: Selectable<ItemsTable>): Item => ({
  id: row.id,
  name: row.name,
  createdAt: row.created_at,
});

export async function listItems(db: Db): Promise<Item[]> {
  const rows = await db
    .selectFrom('items')
    .selectAll()
    .orderBy('created_at', 'desc')
    .limit(100)
    .execute();
  return rows.map(toItem);
}

export async function createItem(db: Db, name: string): Promise<Item> {
  const row = { id: crypto.randomUUID(), name, created_at: new Date().toISOString() };
  await db.insertInto('items').values(row).execute();
  return toItem(row);
}

export async function getItem(db: Db, id: string): Promise<Item | undefined> {
  const row = await db.selectFrom('items').selectAll().where('id', '=', id).executeTakeFirst();
  return row && toItem(row);
}
