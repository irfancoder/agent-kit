import * as v from 'valibot';

/** Database bindings (wrangler.jsonc). */
export const dbBindings = {
  HYPERDRIVE: v.object(
    { connectionString: v.string() },
    'HYPERDRIVE binding is missing: check "hyperdrive" in wrangler.jsonc',
  ),
};
