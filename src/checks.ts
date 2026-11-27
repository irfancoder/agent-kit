import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Options } from './options.ts';
import { fail, KIT_DIR, output, warn } from './util.ts';

/** Paths of the template layers for these options, in copy order. */
export function layers(o: Options): string[] {
  return [
    join(KIT_DIR, 'templates/shared'),
    join(KIT_DIR, 'templates', o.variant, 'base'),
    ...(o.db ? [join(KIT_DIR, 'templates', o.variant, `db-${o.db}`)] : []),
  ];
}

/** Everything that can fail before a file is written. Returns the GitHub owner for --github. */
export function checkMachine(o: Options): string | undefined {
  if (existsSync(o.dir)) fail(`${o.dir} already exists`);

  for (const cmd of ['git', 'pnpm', 'node']) {
    if (output(cmd, ['--version']) === null) fail(`${cmd} is not installed`);
  }
  // The versions the template declares.
  const pkg = JSON.parse(readFileSync(join(KIT_DIR, 'templates/shared/package.json'), 'utf8'));
  const [needMajor, needMinor = 0] = String(pkg.engines.node).replace(/[^0-9.]/g, '').split('.').map(Number);
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < needMajor || (major === needMajor && minor < needMinor))
    fail(`Node.js ${pkg.engines.node} is needed (found ${process.version})`);
  const pnpmMajor = String(pkg.packageManager).split('@')[1].split('.')[0];
  const pnpm = output('pnpm', ['--version']) ?? '';
  if (pnpm.split('.')[0] !== pnpmMajor) fail(`pnpm ${pnpmMajor} is needed (found ${pnpm})`);

  // Variants with a local database run it in Docker.
  if (layers(o).some((layer) => existsSync(join(layer, 'docker-compose.yml'))) && output('docker', ['info']) === null)
    fail("Docker isn't running (the project's database needs it)");

  let owner: string | undefined;
  if (o.github) {
    owner = o.owner ?? output('gh', ['api', 'user', '-q', '.login']) ?? fail("gh isn't installed or signed in (gh auth login)");
    if (output('gh', ['repo', 'view', `${owner}/${o.name}`]) !== null) fail(`github.com/${owner}/${o.name} already exists`);
    // The first push runs the pre-push e2e hook, which replays agent steps from the cache.
    const cache = join(KIT_DIR, 'templates/shared/packages/e2e/.e2e/cache');
    if (!readdirSync(cache).some((f) => f.endsWith('.json')))
      fail("agent-kit's e2e replay cache isn't recorded yet, so the first push would fail (irfancoder/agent-kit#1)");
  }

  if (!/"loggedIn":\s*true/.test(output('claude', ['auth', 'status']) ?? ''))
    warn("Claude Code isn't signed in; the Builder can't record e2e steps until you run `claude` and sign in");
  return owner;
}
