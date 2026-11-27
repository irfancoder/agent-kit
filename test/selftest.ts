// Builds the CLI (and checks the committed dist/ matches), scaffolds every variant with
// it into a temp folder (its first commit runs pre-commit), runs pre-push in each, and
// checks that no placeholder is left. Exits non-zero on any failure.
//
//   pnpm test                          all variants
//   pnpm test node-postgres            one variant[:db][+ui]: hono-cloudflare:d1 picks a
//                                      database, node-postgres+ui-sdk a component library
//   KEEP=1 pnpm test                   keep the projects to look at
//
// Needs the e2e browser (pnpm --dir <project>/packages/e2e exec e2e-web install
// chromium) and, for the Postgres variants, DATABASE_URL set to a Postgres you run
// (for example postgres://localhost/agentkit). Its role needs CREATEDB for the e2e
// database.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { UIS } from '../src/options.ts';
import { E2E_CACHE, KIT_DIR } from '../src/util.ts';

const variants = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['node-postgres', 'hono-cloudflare:hyperdrive+ui-sdk', 'hono-cloudflare:d1'];
// Every variant but D1 uses Postgres.
if (!process.env.DATABASE_URL && variants.some((spec) => !spec.includes(':d1'))) {
  console.log('selftest: set DATABASE_URL to a Postgres you run (see the top of test/selftest.ts)');
  process.exit(1);
}
const work = mkdtempSync(join(tmpdir(), 'agent-kit-selftest-'));
const failed: string[] = [];

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

/** Files and folders that still carry one of the needles (the placeholders by default), outside the e2e cache. */
function leftovers(dir: string, needles = ['kitapp', 'Kit App']): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((path) => !/(^|\/)(node_modules|\.git)(\/|$)/.test(relative(dir, path)))
    .filter((path) => !relative(dir, path).startsWith(E2E_CACHE))
    .filter((path) => {
      if (needles.some((needle) => relative(dir, path).includes(needle))) return true;
      try {
        const text = readFileSync(path, 'utf8');
        return needles.some((needle) => text.includes(needle));
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
    // variant[:db][+ui]; no +ui tests the CLI's default library.
    const [layers, ui] = spec.split('+');
    const [variant, db] = layers.split(':');
    const name = `selftest-${variant}${db ? `-${db}` : ''}${ui ? `-${ui}` : ''}`;
    const dir = join(work, name);

    console.log(`==> ${spec}: scaffold`);
    // node-postgres also gets a brief, as a bot passes it (stdin).
    const brief = variant === 'node-postgres' ? ['--brief-file', '-', '--reason', 'selftest'] : [];
    const args = [join(KIT_DIR, 'dist/agent-kit.mjs'), dir, '--name', name, '--variant', variant, ...(db ? ['--db', db] : []), ...(ui ? ['--ui', ui] : []), ...brief, '--yes'];
    const log = join(work, `${name}.log`);
    if (!sh('node', args, work, log, 'A brief, word for word.\n')) {
      fail(`${spec}:scaffold`, log);
      continue;
    }
    if (brief.length && !readFileSync(join(dir, '.agent/BRIEF.md'), 'utf8').includes('A brief, word for word.'))
      fail(`${spec}:brief`);
    if (!existsSync(join(dir, '.gitignore'))) fail(`${spec}:gitignore (from _gitignore)`);
    // Only the chosen component library may appear in the project.
    const chosen = ui ?? UIS[0];
    const packages: Record<string, string> = { 'base-ui': '@base-ui/', 'ui-sdk': '@ui-sdk/' };
    const manifests = ['apps/web/package.json', 'pnpm-workspace.yaml', 'renovate.json'].map((f) => readFileSync(join(dir, f), 'utf8'));
    if (!manifests[0].includes(packages[chosen])) fail(`${spec}:${chosen} isn't in apps/web/package.json`);
    for (const other of UIS.filter((u) => u !== chosen)) {
      const leaked = manifests.some((text) => text.includes(packages[other])) || leftovers(join(dir, 'apps/web/src'), [packages[other]]).length;
      if (leaked) fail(`${spec}:${other} leaked into a ${chosen} project`);
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
  if (failed.length || process.env.KEEP === '1') console.log(`Kept ${work}`);
  else rmSync(work, { recursive: true, force: true });
}

if (failed.length) {
  console.log(`selftest FAILED: ${failed.join(' ')}`);
  process.exit(1);
}
console.log(`selftest passed: ${variants.join(' ')}`);
