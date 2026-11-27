import * as v from 'valibot';
import { dbEnv } from './db/env.ts';
import { parseEnvWith } from './validate.ts';

/**
 * Every env var the api reads. A new one goes here (or, for the database, in
 * db/env.ts) and in .env.example.
 */
export const EnvSchema = v.object({
  NODE_ENV: v.optional(v.picklist(['development', 'test', 'production']), 'development'),
  HOST: v.optional(v.string(), '127.0.0.1'),
  PORT: v.optional(v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1)), '3001'),
  LOG_LEVEL: v.optional(
    v.picklist(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
    'info',
  ),
  ...dbEnv,
});
export type Env = v.InferOutput<typeof EnvSchema>;

/** Validates the environment, or throws one error that lists every bad or missing value. */
export const parseEnv = (source: Record<string, string | undefined>): Env =>
  parseEnvWith(EnvSchema, source);
