// Builds the CLI (and checks the committed dist/ matches), scaffolds every variant with
// it into a temp folder (its first commit runs pre-commit), runs pre-push in each, and
// checks that no placeholder is left. Exits non-zero on any failure.
//
//   pnpm test                          all variants
//   pnpm test node-postgres            one (hono-cloudflare:d1 picks a database)
//   KEEP=1 pnpm test                   keep the projects to look at
//
// Needs Docker running and the e2e browser (pnpm --dir <project>/packages/e2e exec
// e2e-web install chromium).
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { E2E_CACHE, KIT_DIR } from '../src/util.ts';

const variants = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['node-postgres', 'hono-cloudflare:hyperdrive', 'hono-cloudflare:d1'];
const work = mkdtempSync(join(tmpdir(), 'agent-kit-selftest-'));
const failed: string[] = [];
const projects: string[] = [];

// Hooks must pass with no agent: an empty Claude Code config has no login, so a step
// that isn't recorded fails instead of spending the plan's usage.
const noLogin = join(work, 'no-claude-login');
mkdirSync(noLogin);
const env: NodeJS.ProcessEnv = { ...process.env, CLAUDE_CONFIG_DIR: noLogin };
delete env.ANTHROPIC_API_KEY;

/** Runs a command, logging its output to a file. Returns whether it passed. */
function sh(cmd: string, args: string[], cwd: string, log: string, input?: string): boolean {
  const result = spawnSync(cmd, args, { cwd, env, input, encoding: 'utf8' });
  writeFileSync(log, `${result.stdout ?? ''}${result.stderr ?? ''}`);
  return result.status === 0;
}

function fail(what: string, log?: string): void {
  console.log(`    FAIL: ${what}${log ? ` (log: ${log})` : ''}`);
  if (log) console.log(readFileSync(log, 'utf8').split('\n').slice(-30).join('\n'));
  failed.push(what);
}

function freePort(): Promise<number> {
  return new Promise((done) => {
    const server = createServer().listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number };
      server.close(() => done(port));
    });
  });
}

/** Files and folders that still carry a placeholder, outside the e2e cache. */
function leftovers(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((path) => !/(^|\/)(node_modules|\.git)(\/|$)/.test(relative(dir, path)))
    .filter((path) => !relative(dir, path).startsWith(E2E_CACHE))
    .filter((path) => {
      if (path.includes('kitapp')) return true;
      try {
        const text = readFileSync(path, 'utf8');
        return text.includes('kitapp') || text.includes('Kit App');
      } catch {
        return false; // a folder
      }
    });
}

try {
  console.log('==> Building the CLI');
  const buildLog = join(work, 'build.log');
  if (!sh('pnpm', ['install', '--frozen-lockfile'], KIT_DIR, buildLog) || !sh('pnpm', ['check'], KIT_DIR, buildLog))
    fail('build', buildLog);
  // pnpm dlx runs dist/ as committed, so it must match the source.
  else if (spawnSync('git', ['diff', '--quiet', 'HEAD', '--', 'dist'], { cwd: KIT_DIR }).status !== 0)
    fail("dist/ doesn't match src/; commit the rebuilt dist/");

  for (const spec of variants) {
    const [variant, db] = spec.split(':');
    const name = `selftest-${variant}${db ? `-${db}` : ''}`;
    const dir = join(work, name);
    projects.push(dir);

    console.log(`==> ${spec}: scaffold`);
    // node-postgres also gets a brief, as a bot passes it (stdin).
    const brief = variant === 'node-postgres' ? ['--brief-file', '-', '--reason', 'selftest'] : [];
    const args = [join(KIT_DIR, 'dist/agent-kit.mjs'), dir, '--name', name, '--variant', variant, ...(db ? ['--db', db] : []), ...brief, '--yes'];
    const log = join(work, `${name}.log`);
    if (!sh('node', args, work, log, 'A brief, word for word.\n')) {
      fail(`${spec}:scaffold`, log);
      continue;
    }
    if (brief.length && !readFileSync(join(dir, '.agent/BRIEF.md'), 'utf8').includes('A brief, word for word.'))
      fail(`${spec}:brief`);
    if (!existsSync(join(dir, '.gitignore'))) fail(`${spec}:gitignore (from _gitignore)`);

    // Avoid clashing with anything already listening on the default Postgres port.
    const envFile = join(dir, '.env');
    const dotenv = readFileSync(envFile, 'utf8');
    if (/^POSTGRES_PORT=/m.test(dotenv)) {
      const port = await freePort();
      writeFileSync(envFile, dotenv.replace(/^POSTGRES_PORT=.*/m, `POSTGRES_PORT=${port}`).replace(/127\.0\.0\.1:\d+\//, `127.0.0.1:${port}/`));
    }

    console.log(`==> ${spec}: leftover placeholders`);
    const left = leftovers(dir);
    if (left.length) fail(`${spec}:placeholders in ${left.map((p) => relative(dir, p)).join(', ')}`);

    // The scaffold's own commit already ran pre-commit, so only pre-push is left.
    console.log(`==> ${spec}: pre-push`);
    const hookLog = join(work, `${name}.pre-push.log`);
    if (!sh('pnpm', ['exec', 'lefthook', 'run', 'pre-push', '--all-files'], dir, hookLog)) fail(`${spec}:pre-push`, hookLog);
  }
} finally {
  for (const dir of projects) {
    if (existsSync(join(dir, 'docker-compose.yml'))) spawnSync('docker', ['compose', 'down', '-v'], { cwd: dir, stdio: 'ignore' });
  }
  if (failed.length || process.env.KEEP === '1') console.log(`Kept ${work}`);
  else rmSync(work, { recursive: true, force: true });
}

if (failed.length) {
  console.log(`selftest FAILED: ${failed.join(' ')}`);
  process.exit(1);
}
console.log(`selftest passed: ${variants.join(' ')}`);
