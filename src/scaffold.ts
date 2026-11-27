import {
  appendFileSync,
  chmodSync,
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, relative, sep } from 'node:path';
import { layers } from './checks.ts';
import { dbEnvVar, describe, type Options } from './options.ts';
import { E2E_CACHE, KIT_DIR, KIT_VERSION, run, step } from './util.ts';

const SKIP = new Set(['node_modules', '.turbo', 'dist']);

/**
 * A component library's ui.json adds its packages to the web app and the catalog, and
 * its Renovate rules, so a project carries only the library it chose.
 */
function addComponentLibrary(o: Options): void {
  const ui: { catalog: Record<string, string>; renovate: object[] } = JSON.parse(
    readFileSync(join(KIT_DIR, 'templates/ui', o.ui ?? '', 'ui.json'), 'utf8'),
  );
  const webPath = join(o.dir, 'apps/web/package.json');
  const web = JSON.parse(readFileSync(webPath, 'utf8'));
  for (const name of Object.keys(ui.catalog)) web.dependencies[name] = 'catalog:';
  web.dependencies = Object.fromEntries(Object.entries(web.dependencies).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(webPath, `${JSON.stringify(web, null, 2)}\n`);

  const workspacePath = join(o.dir, 'pnpm-workspace.yaml');
  const pins = Object.entries(ui.catalog).map(([name, version]) => `  '${name}': ${version}`);
  const workspace = readFileSync(workspacePath, 'utf8').replace(
    /^ {2}# component library: .*$/m,
    [`  # component library: ${o.ui}`, ...pins].join('\n'),
  );
  writeFileSync(workspacePath, workspace);

  if (ui.renovate.length) {
    const renovatePath = join(o.dir, 'renovate.json');
    const renovate = JSON.parse(readFileSync(renovatePath, 'utf8'));
    renovate.packageRules.push(...ui.renovate);
    writeFileSync(renovatePath, `${JSON.stringify(renovate, null, 2)}\n`);
  }
}

/** Copies the templates and replaces the kitapp / Kit App placeholders in paths and contents. */
function copyTemplates(o: Options): void {
  mkdirSync(o.dir, { recursive: true });
  for (const layer of layers(o)) {
    cpSync(layer, o.dir, {
      recursive: true,
      filter: (src) => !SKIP.has(basename(src)) && src !== join(layer, 'ui.json'),
    });
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
  appendFileSync(join(agent, 'DECISIONS.md'), `${today} — stack: ${describe(o)} — ${o.reason ?? 'the defaults'}\n`);
  appendFileSync(
    join(agent, 'PROGRESS.md'),
    `${today} | lead | kickstart | scaffolded via agent-kit ${KIT_VERSION} with the brief | Planner: GOAL, SPEC and feature list\n`,
  );
}

/** .env from .env.example, pointed at the caller's Postgres when DATABASE_URL is set. */
function writeEnv(o: Options): void {
  const url = process.env.DATABASE_URL;
  const key = dbEnvVar(o);
  let env = readFileSync(join(o.dir, '.env.example'), 'utf8');
  if (url && key) env = env.replace(new RegExp(`^${key}=.*$`, 'm'), () => `${key}=${url}`);
  writeFileSync(join(o.dir, '.env'), env);
}

/** Creates the project and makes its first commit, through its own pre-commit hook. */
export function scaffold(o: Options): void {
  step(`Scaffolding ${o.name} (${describe(o)}) into ${o.dir}`);
  copyTemplates(o);
  addComponentLibrary(o);
  writeEnv(o);
  recordBrief(o);
  const here = { cwd: o.dir };
  run('git', ['init', '-q', '-b', 'main'], here);
  run('pnpm', ['install'], here);
  run('pnpm', ['exec', 'oxfmt'], { ...here, stdio: ['ignore', 'ignore', 'inherit'] });
  run('git', ['add', '-A'], here);
  run('git', ['commit', '-q', '-m', `chore: scaffold via agent-kit ${KIT_VERSION}`], here);
}
