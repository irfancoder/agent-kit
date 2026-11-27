import { Kysely, PostgresDialect } from 'kysely';
import { Migrator, type Migration } from 'kysely/migration';
import { Pool } from 'pg';
import * as items from './migrations/0001_items.ts';
import type { Database } from './schema.ts';

/** Migrations, in order. Add a new file in ./migrations and list it here. */
const migrations: Record<string, Migration> = {
  '0001_items': items,
};

export type Db = Kysely<Database>;

export function createDb(databaseUrl: string): Db {
  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool: new Pool({ connectionString: databaseUrl }) }),
  });
}

/** Runs pending migrations. Called on boot; throws if any migration fails. */
export async function migrate(db: Db): Promise<void> {
  const migrator = new Migrator({ db, provider: { getMigrations: async () => migrations } });
  const { error, results } = await migrator.migrateToLatest();
  const failed = results?.find((r) => r.status === 'Error');
  if (error || failed) {
    throw new Error(`Migration ${failed?.migrationName ?? ''} failed`, { cause: error });
  }
}
