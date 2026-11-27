import {
  appendFileSync,
  chmodSync,
  copyFileSync,
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { basename, join } from 'node:path';
import { layers } from './checks.ts';
import type { Options } from './options.ts';
import { KIT_VERSION, run, step } from './util.ts';

// The e2e replay cache is keyed by fixed ids, so it keeps the placeholders.
const CACHE = `${join('packages', 'e2e', '.e2e', 'cache')}`;
const SKIP = new Set(['node_modules', '.turbo', 'dist']);

/** Every file and folder under dir, children before their folder, so renaming a folder
 * comes after everything inside it has been handled. */
function walk(dir: string): { path: string; isDir: boolean }[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? [...walk(path), { path, isDir: true }] : [{ path, isDir: false }];
  });
}

/** Copies the templates and replaces the kitapp / Kit App placeholders in paths and contents. */
function copyTemplates(o: Options): void {
  mkdirSync(o.dir, { recursive: true });
  for (const layer of layers(o)) {
    cpSync(layer, o.dir, { recursive: true, filter: (src) => !SKIP.has(basename(src)) });
  }
  for (const { path, isDir } of walk(o.dir)) {
    if (path.includes(CACHE)) continue;
    const name = basename(path);
    if (!isDir) {
      const buffer = readFileSync(path);
      const text = buffer.includes(0) ? '' : buffer.toString('utf8'); // skip binary files
      if (text.includes('kitapp') || text.includes('Kit App')) {
        // Title first: it is the only placeholder with a capital letter.
        writeFileSync(path, text.replaceAll('Kit App', o.title).replaceAll('kitapp', o.name));
      }
      // A kit fetched by pnpm may have lost its executable bits.
      if (name.endsWith('.sh')) chmodSync(path, 0o755);
    }
    // npm and pnpm drop .gitignore files when they pack the kit, so the templates use _gitignore.
    const renamed = name === '_gitignore' ? '.gitignore' : name.replaceAll('kitapp', o.name);
    if (renamed !== name) renameSync(path, join(path, '..', renamed));
  }
}

/** Writes the owner's brief, word for word, and logs the variant and the run. */
function recordBrief(o: Options): void {
  if (o.brief === undefined) return;
  const today = new Date().toISOString().slice(0, 10);
  const agent = join(o.dir, '.agent');
  writeFileSync(
    join(agent, 'BRIEF.md'),
    `# Brief\n\n<!-- The owner's brief, word for word. Received ${today}. -->\n\n${o.brief}`,
  );
  const variant = o.db ? `${o.variant} with ${o.db}` : o.variant;
  appendFileSync(join(agent, 'DECISIONS.md'), `${today} — variant: ${variant} — ${o.reason ?? 'the default'}\n`);
  appendFileSync(
    join(agent, 'PROGRESS.md'),
    `${today} | lead | kickstart | scaffolded via agent-kit ${KIT_VERSION} with the brief | Planner: GOAL, SPEC and feature list\n`,
  );
}

/** Creates the project and makes its first commit, through its own pre-commit hook. */
export function scaffold(o: Options): void {
  step(`Scaffolding ${o.name} (${o.variant}${o.db ? `, ${o.db}` : ''}) into ${o.dir}`);
  copyTemplates(o);
  copyFileSync(join(o.dir, '.env.example'), join(o.dir, '.env'));
  recordBrief(o);
  const here = { cwd: o.dir };
  run('git', ['init', '-q', '-b', 'main'], here);
  run('pnpm', ['install'], here);
  run('pnpm', ['exec', 'oxfmt'], { ...here, stdio: ['ignore', 'ignore', 'inherit'] });
  run('git', ['add', '-A'], here);
  run('git', ['commit', '-q', '-m', `chore: scaffold via agent-kit ${KIT_VERSION}`], here);
}
