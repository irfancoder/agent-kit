import * as v from 'valibot';

/** The database's env vars (.env). */
export const dbEnv = {
  DATABASE_URL: v.pipe(
    v.string('DATABASE_URL is required'),
    v.url('DATABASE_URL must be a URL, for example postgres://user:pass@localhost:5432/db'),
  ),
};
