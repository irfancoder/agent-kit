import type { Kysely } from 'kysely';
import { Migrator, type Migration } from 'kysely/migration';

/** Runs pending migrations. Called on boot; throws if any migration fails. */
export async function runMigrations<DB>(
  db: Kysely<DB>,
  migrations: Record<string, Migration>,
): Promise<void> {
  const migrator = new Migrator({ db, provider: { getMigrations: async () => migrations } });
  const { error, results } = await migrator.migrateToLatest();
  const failed = results?.find((r) => r.status === 'Error');
  if (error || failed) {
    throw new Error(`Migration ${failed?.migrationName ?? ''} failed`, { cause: error });
  }
}
