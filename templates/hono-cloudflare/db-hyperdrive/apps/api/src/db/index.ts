import { Kysely, PostgresDialect } from 'kysely';
import { Migrator, type Migration } from 'kysely/migration';
import { Pool } from 'pg';
import type { Env } from '../env.ts';
import * as items from './migrations/0001_items.ts';
import type { Database } from './schema.ts';

export type Db = Kysely<Database>;

/** Migrations, in order. Add a new file in ./migrations and list it here. */
const migrations: Record<string, Migration> = {
  '0001_items': items,
};

let migrated: Promise<void> | undefined;

/** Runs pending migrations. Kysely's migration lock makes concurrent isolates safe. */
export async function migrate(db: Db): Promise<void> {
  const migrator = new Migrator({ db, provider: { getMigrations: async () => migrations } });
  const { error, results } = await migrator.migrateToLatest();
  const failed = results?.find((r) => r.status === 'Error');
  if (error || failed)
    throw new Error(`Migration ${failed?.migrationName ?? ''} failed`, { cause: error });
}

/**
 * Opens Postgres through Hyperdrive for one request. Migrations run once per
 * isolate, before its first query (Workers have no boot step).
 */
export async function connect(env: Env): Promise<{ db: Db; close: () => Promise<void> }> {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString: env.HYPERDRIVE.connectionString, max: 1 }),
    }),
  });
  migrated ??= migrate(db).catch((error: unknown) => {
    migrated = undefined;
    throw error;
  });
  await migrated;
  return { db, close: () => db.destroy() };
}
