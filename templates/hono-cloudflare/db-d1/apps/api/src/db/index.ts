import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import type { Env } from '../env.ts';
import type { Database } from './schema.ts';

export type Db = Kysely<Database>;

/**
 * Opens the D1 database for one request. D1 migrations are SQL files in
 * apps/api/migrations, applied with `wrangler d1 migrations apply` before
 * `wrangler dev` starts (scripts/db-setup.ts) and before each deploy.
 */
export async function connect(env: Env): Promise<{ db: Db; close: () => Promise<void> }> {
  const db = new Kysely<Database>({ dialect: new D1Dialect({ database: env.DB }) });
  return { db, close: async () => {} };
}
