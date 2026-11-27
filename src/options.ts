import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';
import { fail } from './util.ts';

const USAGE = `agent-kit [dir] [options]

Creates a project in IRFANCODER's stack, ready for an agent team.

  --name <name>            Project name in kebab-case (defaults to the folder name)
  --title <title>          Display name (defaults to the name in Title Case)
  --variant <variant>      node-postgres (default), node-sqlite or hono-cloudflare
  --db <db>                hono-cloudflare only: hyperdrive (default) or d1
  --ui <library>           Headless components: base-ui (default, stable) or ui-sdk (beta)
  --brief-file <path|->    The owner's brief, word for word, for .agent/BRIEF.md ("-": stdin)
  --reason <text>          Why this variant, logged in .agent/DECISIONS.md
  --github                 Create the private GitHub repo, push, and open the Planner's issue
  --owner <owner>          GitHub owner for --github (default: the signed-in gh user)
  --check                  Check the options and the machine, then stop
  -y, --yes                Don't ask: use the defaults for anything not given
  -h, --help               Show this

[dir] defaults to ./<name>. Anything not given is asked for, unless --yes is set or
nobody is at a terminal (a bot, CI). The last lines printed are PROJECT_DIR=,
PROJECT_REPO= and PROJECT_ISSUE=.`;

/**
 * Each variant's templates: templates/<stack>/base, then templates/<stack>/db-<db>. A
 * variant without a fixed db takes --db. The first is the default.
 */
export const VARIANT_LAYERS = {
  'node-postgres': { stack: 'node', db: 'postgres' },
  'node-sqlite': { stack: 'node', db: 'sqlite' },
  'hono-cloudflare': { stack: 'hono-cloudflare', db: undefined },
} as const;
export type Variant = keyof typeof VARIANT_LAYERS;
export const VARIANTS = Object.keys(VARIANT_LAYERS) as Variant[];
export type Db = 'hyperdrive' | 'd1';
/** Headless component libraries, one per templates/ui/<name>. The first is the default. */
export const UIS = ['base-ui', 'ui-sdk'] as const;
export type Ui = (typeof UIS)[number];

export interface Options {
  dir: string;
  name: string;
  title: string;
  variant: Variant;
  db?: Db;
  ui?: Ui;
  brief?: string;
  reason?: string;
  github: boolean;
  owner?: string;
  check: boolean;
}

const NAME = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

function titleFromName(name: string): string {
  return name.replace(/(^|-)([a-z0-9])/g, (_, dash: string, c: string) => (dash ? ' ' : '') + c.toUpperCase());
}

function validate(o: Options): Options & { ui: Ui } {
  if (!NAME.test(o.name)) fail('--name must be kebab-case (for example budget-tracker)');
  if (o.name === 'kitapp') fail("--name can't be the template placeholder 'kitapp'");
  if (o.name.length > 50) fail('--name must be 50 characters or fewer');
  // The title lands inside TS and JSON string literals.
  if (/['"\\\n]/.test(o.title)) fail("--title can't contain quotes, backslashes or newlines");
  if (!VARIANTS.includes(o.variant)) fail(`--variant must be ${VARIANTS.join(', ')}`);
  if (o.variant !== 'hono-cloudflare' && o.db) fail('--db only applies to --variant hono-cloudflare');
  if (o.variant === 'hono-cloudflare') {
    o.db ??= 'hyperdrive';
    if (o.db !== 'hyperdrive' && o.db !== 'd1') fail('--db must be hyperdrive or d1');
  }
  o.ui ??= UIS[0];
  if (!UIS.includes(o.ui)) fail(`--ui must be ${UIS.join(' or ')}`);
  if (o.brief !== undefined && !o.brief.trim()) fail('the brief is empty');
  return o as Options & { ui: Ui };
}

/**
 * The .env key that holds the URL of the Postgres the user provides (the kit never
 * starts one), or null for SQLite and D1. Wrangler names Hyperdrive's after its binding.
 */
export function dbEnvVar(o: Options): string | null {
  if (o.variant === 'node-postgres') return 'DATABASE_URL';
  return o.db === 'hyperdrive' ? 'CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE' : null;
}

/** "node-postgres, base-ui" or "hono-cloudflare with d1, ui-sdk" */
export function describe(o: Options): string {
  return `${o.db ? `${o.variant} with ${o.db}` : o.variant}, ${o.ui}`;
}

function readBrief(path: string): string {
  try {
    return readFileSync(path === '-' ? 0 : path, 'utf8');
  } catch {
    return fail(`can't read the brief from ${path === '-' ? 'stdin' : path}`);
  }
}

/** Parses the command line, then asks for whatever is missing when someone is at a terminal. */
export async function getOptions(argv: string[]): Promise<(Options & { ui: Ui }) | null> {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      name: { type: 'string' },
      title: { type: 'string' },
      variant: { type: 'string' },
      db: { type: 'string' },
      ui: { type: 'string' },
      'brief-file': { type: 'string' },
      reason: { type: 'string' },
      github: { type: 'boolean', default: false },
      owner: { type: 'string' },
      check: { type: 'boolean', default: false },
      yes: { type: 'boolean', short: 'y', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });
  if (values.help) {
    console.log(USAGE);
    return null;
  }
  if (positionals.length > 1) fail('only one [dir] is allowed');
  const briefFile = values['brief-file'];
  const interactive = !values.yes && briefFile !== '-' && process.stdin.isTTY && process.stdout.isTTY;

  let dirArg = positionals[0];
  let name = values.name ?? (dirArg ? basename(resolve(dirArg)) : undefined);
  let title = values.title;
  let variant = values.variant;
  let db = values.db;
  let ui = values.ui;
  let brief = briefFile ? readBrief(briefFile) : undefined;
  let github = values.github;

  if (interactive) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const ask = async (question: string, fallback?: string) =>
      (await rl.question(fallback ? `${question} (${fallback}) ` : `${question} `)).trim() || fallback || '';
    try {
      name ??= await ask('Project name, kebab-case:');
      title ??= await ask('Display name:', titleFromName(name));
      variant ??= await ask(`Variant, ${VARIANTS.join(', ')}:`, VARIANTS[0]);
      if (variant === 'hono-cloudflare') db ??= await ask('Database, hyperdrive or d1:', 'hyperdrive');
      ui ??= await ask('Components, base-ui (stable) or ui-sdk (beta):', UIS[0]);
      dirArg ??= await ask('Folder:', `./${name}`);
      if (!briefFile) {
        const path = await ask("Path to the owner's brief (blank to add it later):");
        if (path) brief = readBrief(path);
      }
      github ||= /^y/i.test(await ask('Create the private GitHub repo and push? y/N', 'N'));
    } finally {
      rl.close();
    }
  }

  if (!name) fail('pass a [dir] or --name');
  return validate({
    // The shell expands ~ in arguments; a typed answer needs it done here.
    dir: resolve((dirArg ?? `./${name}`).replace(/^~(?=\/|$)/, homedir())),
    name,
    title: title || titleFromName(name),
    variant: (variant ?? VARIANTS[0]) as Variant,
    db: db as Db | undefined,
    ui: (ui || undefined) as Ui | undefined,
    brief,
    reason: values.reason,
    github,
    owner: values.owner,
    check: values.check,
  });
}
