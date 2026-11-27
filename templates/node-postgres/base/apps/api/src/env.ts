import * as v from 'valibot';
import { parseEnvWith } from './validate.ts';

/** Every env var the api reads. A new one goes here and in .env.example. */
export const EnvSchema = v.object({
  NODE_ENV: v.optional(v.picklist(['development', 'test', 'production']), 'development'),
  HOST: v.optional(v.string(), '127.0.0.1'),
  PORT: v.optional(v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1)), '3001'),
  LOG_LEVEL: v.optional(
    v.picklist(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
    'info',
  ),
  DATABASE_URL: v.pipe(
    v.string('DATABASE_URL is required'),
    v.url('DATABASE_URL must be a URL, for example postgres://user:pass@localhost:5432/db'),
  ),
});
export type Env = v.InferOutput<typeof EnvSchema>;

/** Validates the environment, or throws one error that lists every bad or missing value. */
export const parseEnv = (source: Record<string, string | undefined>): Env =>
  parseEnvWith(EnvSchema, source);
