import * as v from 'valibot';

/** The database's env vars (.env). */
export const dbEnv = {
  /** The SQLite file, relative to the api's working directory. */
  DATABASE_PATH: v.optional(v.pipe(v.string(), v.nonEmpty()), 'data/kitapp.sqlite'),
};
