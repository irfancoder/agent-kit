import * as v from 'valibot';

/** Database bindings (wrangler.jsonc). */
export const dbBindings = {
  DB: v.custom<D1Database>(
    (value) => typeof value === 'object' && value !== null && 'prepare' in value,
    'DB binding is missing: check "d1_databases" in wrangler.jsonc',
  ),
};
