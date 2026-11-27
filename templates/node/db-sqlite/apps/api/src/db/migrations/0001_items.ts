import type { Kysely } from 'kysely';

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('items')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) => col.notNull())
    .execute();
  await db.schema.createIndex('items_created_at').on('items').column('created_at desc').execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('items').execute();
}
