import { buildApp } from './app.ts';
import { connect } from './db/index.ts';
import { parseEnv, type Env } from './env.ts';

let checked: Env | undefined;

/** Validates the Worker's env once per isolate; a bad env fails each request with a clear log. */
function env(source: unknown): Env {
  checked ??= parseEnv(source);
  return checked;
}

export default buildApp((source) => connect(env(source)));
