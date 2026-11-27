import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { dbEnvVar, type Options } from './options.ts';
import { E2E_CACHE, fail, KIT_DIR, output, warn } from './util.ts';

/** Paths of the template layers for these options, in copy order. */
export function layers(o: Options): string[] {
  return [
    join(KIT_DIR, 'templates/shared'),
    join(KIT_DIR, 'templates', o.variant, 'base'),
    ...(o.db ? [join(KIT_DIR, 'templates', o.variant, `db-${o.db}`)] : []),
    join(KIT_DIR, 'templates/ui', o.ui ?? ''),
  ];
}

/** "24.8.1" or ">=24.8" -> [24, 8] */
function majorMinor(version: string): [number, number] {
  const [, major = '0', minor = '0'] = /(\d+)(?:\.(\d+))?/.exec(version) ?? [];
  return [Number(major), Number(minor)];
}

/** Everything that can fail before a file is written. Fills in o.owner for --github. */
export function checkMachine(o: Options): void {
  if (existsSync(o.dir)) fail(`${o.dir} already exists`);
  if (output('git', ['--version']) === null) fail('git is not installed');

  // The versions the template declares. pnpm 10 and older can't switch to the declared major.
  const pkg = JSON.parse(readFileSync(join(KIT_DIR, 'templates/shared/package.json'), 'utf8'));
  const [needMajor, needMinor] = majorMinor(pkg.engines.node);
  const [major, minor] = majorMinor(process.versions.node);
  if (major < needMajor || (major === needMajor && minor < needMinor))
    fail(`Node.js ${pkg.engines.node} is needed (found ${process.version})`);
  const pnpm = output('pnpm', ['--version']) ?? fail('pnpm is not installed');
  const [pnpmMajor] = majorMinor(pkg.packageManager);
  if (majorMinor(pnpm)[0] !== pnpmMajor) fail(`pnpm ${pnpmMajor} is needed (found ${pnpm})`);

  if (dbEnvVar(o) && !process.env.DATABASE_URL) {
    // The first push runs e2e, which needs the database.
    if (o.github) fail('set DATABASE_URL to a Postgres you provide (the first push runs e2e against it)');
    warn("DATABASE_URL isn't set; point the database URL in the project's .env at a Postgres you provide");
  }

  if (o.github) {
    o.owner ??= output('gh', ['api', 'user', '-q', '.login']) ?? fail("gh isn't installed or signed in (gh auth login)");
    if (output('gh', ['repo', 'view', `${o.owner}/${o.name}`]) !== null) fail(`github.com/${o.owner}/${o.name} already exists`);
    // The first push runs the pre-push e2e hook, which replays agent steps from the cache.
    if (!readdirSync(join(KIT_DIR, 'templates/shared', E2E_CACHE)).some((f) => f.endsWith('.json')))
      fail("agent-kit's e2e replay cache isn't recorded yet, so the first push would fail (irfancoder/agent-kit#1)");
  }

  if (!/"loggedIn":\s*true/.test(output('claude', ['auth', 'status']) ?? ''))
    warn("Claude Code isn't signed in; the Builder can't record e2e steps until you run `claude` and sign in");
}
