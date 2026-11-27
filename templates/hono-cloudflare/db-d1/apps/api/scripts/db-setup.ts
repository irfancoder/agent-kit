// Applies D1 migrations (apps/api/migrations) to the local database before
// `wrangler dev` starts. Set D1_PERSIST_TO to use another local state dir.
import { execFileSync } from 'node:child_process';

const persist = process.env.D1_PERSIST_TO ? ['--persist-to', process.env.D1_PERSIST_TO] : [];
execFileSync('wrangler', ['d1', 'migrations', 'apply', 'DB', '--local', ...persist], {
  stdio: ['ignore', 'inherit', 'inherit'],
  env: { ...process.env, CI: '1' },
});
