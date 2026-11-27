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
import { basename, join, relative, sep } from 'node:path';
import { layers } from './checks.ts';
import type { Options } from './options.ts';
import { E2E_CACHE, KIT_VERSION, run, step } from './util.ts';

const SKIP = new Set(['node_modules', '.turbo', 'dist']);

/** Copies the templates and replaces the kitapp / Kit App placeholders in paths and contents. */
function copyTemplates(o: Options): void {
  mkdirSync(o.dir, { recursive: true });
  for (const layer of layers(o)) {
    cpSync(layer, o.dir, { recursive: true, filter: (src) => !SKIP.has(basename(src)) });
  }
  // Deepest first, so a folder is renamed only after everything inside it is handled.
  const entries = readdirSync(o.dir, { recursive: true, withFileTypes: true })
    .map((entry) => ({ path: join(entry.parentPath, entry.name), isDir: entry.isDirectory() }))
    .filter(({ path }) => !relative(o.dir, path).startsWith(E2E_CACHE))
    .sort((a, b) => b.path.split(sep).length - a.path.split(sep).length);
  for (const { path, isDir } of entries) {
    const name = basename(path);
    if (!isDir) {
      const buffer = readFileSync(path);
      const text = buffer.includes(0) ? '' : buffer.toString('utf8'); // skip binary files
      if (text.includes('kitapp') || text.includes('Kit App')) {
        // Title first: it is the only placeholder with a capital letter.
        writeFileSync(path, text.replaceAll('Kit App', o.title).replaceAll('kitapp', o.name));
      }
      // The project's scripts are run directly (./.agent/init.sh), whatever mode the kit arrived with.
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
