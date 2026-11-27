import { Kysely, PostgresDialect } from 'kysely';
import type { Migration } from 'kysely/migration';
import { Pool } from 'pg';
import type { Env } from '../env.ts';
import { runMigrations } from './migrate.ts';
import * as items from './migrations/0001_items.ts';
import type { Database } from './schema.ts';

/** Migrations, in order. Add a new file in ./migrations and list it here. */
const migrations: Record<string, Migration> = {
  '0001_items': items,
};

export type Db = Kysely<Database>;

export function createDb(env: Env): Db {
  return new Kysely<Database>({
    dialect: new PostgresDialect({ pool: new Pool({ connectionString: env.DATABASE_URL }) }),
  });
}

/** Runs pending migrations. Called on boot; throws if any migration fails. */
export const migrate = (db: Db): Promise<void> => runMigrations(db, migrations);
