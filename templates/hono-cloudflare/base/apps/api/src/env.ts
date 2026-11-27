import * as v from 'valibot';
import { dbBindings } from './db/env.ts';
import { parseEnvWith } from './validate.ts';

/** Plain vars, from .env locally and wrangler.jsonc "vars" or secrets when deployed. */
export const VarsSchema = v.object({
  LOG_LEVEL: v.optional(v.picklist(['error', 'warn', 'info', 'debug']), 'info'),
});

/**
 * Every env var and binding the api reads. A new var goes in VarsSchema and
 * .env.example; a new binding goes in wrangler.jsonc and db/env.ts.
 */
export const EnvSchema = v.object({ ...VarsSchema.entries, ...dbBindings });
export type Env = v.InferOutput<typeof EnvSchema>;

/** Validates the Worker's env (vars and bindings), or throws one error listing every problem. */
export const parseEnv = (source: unknown): Env => parseEnvWith(EnvSchema, source);

/** The same check for the plain vars only, run before `wrangler dev` starts. */
export const parseVars = (source: unknown) => parseEnvWith(VarsSchema, source);
