import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { Kysely, SqliteDialect, type SqliteDatabase } from 'kysely';
import type { Migration } from 'kysely/migration';
import type { Env } from '../env.ts';
import { runMigrations } from './migrate.ts';
import * as items from './migrations/0001_items.ts';
import type { Database } from './schema.ts';

/** Migrations, in order. Add a new file in ./migrations and list it here. */
const migrations: Record<string, Migration> = {
  '0001_items': items,
};

export type Db = Kysely<Database>;

/** Node's built-in SQLite, in the shape Kysely's SqliteDialect expects. */
function openSqlite(path: string): SqliteDatabase {
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  return {
    close: () => db.close(),
    prepare(sql) {
      const statement = db.prepare(sql);
      // Kysely passes the values it compiled from the query: all valid SQLite inputs.
      const values = (params: readonly unknown[]) => params as SQLInputValue[];
      return {
        reader: statement.columns().length > 0,
        all: (params) => statement.all(...values(params)),
        run: (params) => statement.run(...values(params)),
        iterate: (params) => statement.iterate(...values(params)),
      };
    },
  };
}

export function createDb(env: Env): Db {
  return new Kysely<Database>({ dialect: new SqliteDialect({ database: openSqlite(env.DATABASE_PATH) }) });
}

/** Runs pending migrations. Called on boot; throws if any migration fails. */
export const migrate = (db: Db): Promise<void> => runMigrations(db, migrations);
