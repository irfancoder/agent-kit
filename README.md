# agent-kit

IRFANCODER's project template and scaffold command. One command starts a new project in
Irfan's standard stack, with everything a Rakazo agent team (Lead, Planner, Builder,
Evaluator) needs to build it on its own: the app skeleton, git hooks that check every
commit and push, e2e tests, and the `.agent/` files the bots coordinate through.

Everything here is built from each open-source tool's own documentation. It doesn't use,
copy or link to any MOF code or assets.

## Contents

- [Setting it up](#setting-it-up)
- [Start a project](#start-a-project)
  - [With a bot: the agent-kit skill](#with-a-bot-the-agent-kit-skill)
  - [From the command line](#from-the-command-line)
- [Run it](#run-it)
- [A project's life with an agent team](#a-projects-life-with-an-agent-team)
- [Everyday commands](#everyday-commands)
- [Design language](#design-language)
- [Variants](#variants)
- [What a project gets](#what-a-project-gets)
- [Troubleshooting](#troubleshooting)
- [Maintaining agent-kit](#maintaining-agent-kit)

## Setting it up

agent-kit is a CLI, run straight from this GitHub repo with `pnpm dlx`. Nothing is
installed:

```bash
pnpm --config.dlx-cache-max-age=0 dlx github:irfancoder/agent-kit#semver:^0
```

`#semver:^0` runs the newest `v0.x.x` release tag. `--config.dlx-cache-max-age=0` makes
pnpm look that tag up every time; without it, pnpm reuses the version it fetched on an
earlier run (for a day by default) and you miss new releases. Pin an exact tag
(`#v0.1.0`) for a repeatable run, or a branch to try a change before it's released.

Every machine or bot environment that runs it needs:

| Tool | Version | Why |
| --- | --- | --- |
| Node.js | 24.8 or newer | Runs the CLI; the projects run TypeScript directly |
| pnpm | 12 | Fetches and runs the CLI; workspaces and the catalog in projects |
| git | any recent | pnpm fetches the CLI with it; it makes the project's first commit |
| gh | signed in (only for `--github`) | Creates the project's private repo and its first issue |
| Postgres | a URL in `DATABASE_URL` (not for `node-sqlite` or `--db d1`) | The project's database. You provide it: a local install, a container or a hosted database. Its role needs `CREATEDB`, for the e2e database. Required with `--github`, since the first push runs e2e |
| Claude Code | signed in with `claude` | Records e2e agent steps, on your Claude Max plan |

**In Rakazo,** add two skills to the bot's skill list:

| Skill | Copy |
| --- | --- |
| `agent-kit` | `SKILL.md` from this repo. It only holds instructions, and runs the CLI with `pnpm dlx`. Recopy it only when `SKILL.md` itself changes |
| `hallmark` | `skills/hallmark` from [nutlope/hallmark](https://github.com/nutlope/hallmark). agent-kit was tested with **v2.0.0** (commit `04977e1`); install that version |

**On your own machine,** install Hallmark yourself if you want design runs locally:
`npx skills add nutlope/hallmark` (that's the latest version, not necessarily the tested
one).

## Start a project

### With a bot: the agent-kit skill

Ask the bot to start a project ("kick off a new project", or invoke the `agent-kit`
skill). The bot:

1. **asks for your brief**, in your own words, and keeps it word for word;
2. **proposes** a name, a title and a variant (with a one-line reason), where the
   component library (Base UI unless you ask for ui-sdk), where the project goes (default
   `~/projects/<name>`) and the GitHub owner, then **waits for you to confirm or change
   them**;
3. **runs the CLI** with `--github`, passing your brief through stdin. The CLI:
   - checks the machine;
   - scaffolds the project, with your brief in `.agent/BRIEF.md` in its first commit;
   - creates the private repo `github.com/<you>/<name>` and pushes;
   - opens a `ready` issue, **Plan the project from the brief**, for the Planner;
4. **reports back** the repo and issue links, its choices and any warnings.

From there the team takes over (see
[A project's life with an agent team](#a-projects-life-with-an-agent-team)).

### From the command line

Run it in a terminal and it asks for anything you don't pass as a flag:

```bash
pnpm --config.dlx-cache-max-age=0 dlx github:irfancoder/agent-kit#semver:^0 ~/projects/kedai-stock
```

```text
agent-kit [dir] [options]

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
```

With `--yes`, or when nobody is at a terminal (a bot, CI), it uses the defaults instead
of asking. It:
1. checks the machine and stops before creating anything if it isn't ready (wrong Node
   or pnpm, a taken folder or repo name, or `--github` on a Postgres variant without
   `DATABASE_URL`);
2. copies the template, putting your name and title in place of the `kitapp` /
   `Kit App` placeholders;
3. creates `.env` from `.env.example` (pointing it at `DATABASE_URL` when that's set),
   writes the brief if you gave one, and installs
   dependencies;
4. makes one commit, `chore: scaffold via agent-kit <version>`, on `main`, through the
   project's own pre-commit hook, so a fresh project always starts green;
5. with `--github`: creates the private repo, pushes (through the pre-push hook), adds the
   `ready` and `needs-decision` labels, and opens the Planner's issue.

`--github` refuses to run until agent-kit's e2e cache is recorded, because the first push
would fail ([irfancoder/agent-kit#1](https://github.com/irfancoder/agent-kit/issues/1)).
The last lines printed are `PROJECT_DIR=`, `PROJECT_REPO=` and `PROJECT_ISSUE=`.

## Run it

In the new project:

```bash
./.agent/init.sh
```

It starts the api and the web app against the database in `.env`, and waits until the api answers. It's
safe to run again; it reuses whatever is already running. Then open:

- the web app: http://127.0.0.1:3000
- the api's docs: http://127.0.0.1:3001/docs (Scalar), from `/openapi.json`

To stop the dev servers: `kill $(cat .agent/logs/dev.pid)`.

`node-sqlite` keeps its database in a file (`DATABASE_PATH` in `.env`) and needs nothing
running; e2e runs use a fresh file in a temp dir. agent-kit never starts a Postgres. The
Postgres variants read its URL from `.env`:
`DATABASE_URL` for `node-postgres`,
`CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` for `--db hyperdrive`, where
Wrangler requires a password in the URL. The e2e tests drop and recreate `<database>_e2e` on the same server on each run.

Ports are set in `.env` (`WEB_PORT`, `PORT`). Change them there if 3000 or 3001 are
taken, and keep `API_URL` in step.

The e2e tests drive a real browser. Install it once per machine:

```bash
pnpm --dir packages/e2e exec e2e-web install chromium
```

## A project's life with an agent team

The scaffold gives the team a skeleton; the bots fill it in. `AGENTS.md` in the project
holds the full rules. In short:

1. **Brief.** The Lead pastes your brief, word for word, into `.agent/BRIEF.md`.
2. **Plan.** The Planner writes `.agent/GOAL.md` (then frozen), `.agent/SPEC.md` and
   `.agent/feature_list.json`: one entry per feature, each with user-level test steps.
   `pnpm check:agent` (also run by the pre-commit hook) validates the list against its
   schema.
3. **Design language first.** The Planner's first ticket gives the app its look with the
   `design-language` skill (see [Design language](#design-language)). Every UI ticket after
   it follows the locked `DESIGN.md`.
4. **Build.** The Builder works on one feature per short-lived branch (`feat/F-012`) and
   opens a PR. A change to the api starts in `packages/contracts`, and each feature gets an
   e2e test.
5. **Review.** The Evaluator checks the PR against the feature's steps,
   `.agent/DESIGN.md`'s rubric and `.agent/SECURITY_CHECKLIST.md`. Only the Evaluator flips
   a feature's `passes`.
6. **Track.** Each run appends one line to `.agent/PROGRESS.md`, and decisions go in
   `.agent/DECISIONS.md`. The Lead sets `.agent/STATUS` (`RUNNING`, `PAUSED_LIMIT`, `DONE`
   or `BLOCKED`).

The hooks are the guard rails, and nobody skips them (`--no-verify` is against the rules):

- **pre-commit:** format, lint, `.agent/` check, type check, unit tests.
- **pre-push:** e2e tests with `--strict-cache`. Agent steps replay from the committed
  cache (`packages/e2e/.e2e/cache`), so pushing needs no model and no network. A step that
  no longer matches the UI fails the push. When a change alters a flow on purpose,
  re-record that test with `pnpm --filter @<name>/e2e e2e:record` and commit the cache
  in the same PR. Recording runs the step on Claude Code, signed in with your `claude`
  login, so it uses your Claude Max plan; no API key is involved.

Agents never deploy: no variant has deploy scripts or real credentials.

## Everyday commands

Run these in the project:

| Command | Does |
| --- | --- |
| `pnpm dev` | Web on :3000 and api on :3001 (`init.sh` runs this for you) |
| `pnpm test` | Unit tests (Rstest) |
| `pnpm typecheck` / `pnpm lint` / `pnpm format` | Types, Oxlint, oxfmt (writes) |
| `pnpm e2e` | e2e tests. Starts its own database, api and web |
| `pnpm build` | Production build |
| `pnpm exec lefthook run pre-commit --all-files` | Run a hook by hand |

Adding things:

- **A screen:** a file in `apps/web/src/routes/` (TanStack Router, file-based; the dev
  server updates the route tree). Feature code goes in `apps/web/src/features/<feature>/`.
- **A component:** pages import from `@/components/ui/*`, wrappers around the project's
  headless library. `.agent/COMPONENTS.md` says where that library's docs are and how to
  add a wrapper. Style with Tailwind utilities on the token names (`bg-paper`,
  `text-muted`, `rounded-card`). Shared pieces (`Card`, `EmptyState`) are in
  `apps/web/src/components`.
- **Text:** add the key to `apps/web/src/i18n/en.ts` and `ms.ts`, then use `t('key')`.
- **An api route:** add it to `packages/contracts/src/routes.ts` (Valibot schemas), then
  register it in the api with `defineRoute`. Requests and responses are validated against
  the contract, and `/openapi.json` picks the route up.
- **A table:** add a migration file in the api's `migrations` folder and list it in the
  migrations map. Migrations run on boot.
- **An env var:** add it to the api's env schema (`apps/api/src/env.ts`) and to
  `.env.example`. The api refuses to start on a missing or bad value.
- **A dependency:** pin it once in the `catalog:` of `pnpm-workspace.yaml` and use
  `"catalog:"` in the package. Renovate keeps the catalog up to date.

## Design language

A new project looks neutral on purpose: greys, system fonts, plain controls. Each project gets its own look once, through the **design-language**
skill it ships with (`.claude/skills/design-language`). Ask an agent to run the
design-language skill, or make it the Planner's first ticket.

The skill:
1. reads `.agent/BRIEF.md` and `.agent/GOAL.md` for audience, use and tone;
2. runs [Hallmark](https://github.com/nutlope/hallmark) (MIT), which deals a theme from
   about 50, or designs a custom one if the brief asks;
3. writes its values into `apps/web/src/styles/tokens.css`;
4. checks the result with Hallmark's linter and screenshots in light and dark;
5. locks the system in `DESIGN.md` at the project root.

From then on, every UI ticket follows `DESIGN.md`.

How it fits together:

- `tokens.css` holds every colour, font, size, radius and shadow, in Hallmark's token names
  and its Tailwind v4 layout. Each colour is written once as `light-dark(<light>, <dark>)`.
- The tokens are Tailwind utilities (`bg-paper`, `text-ink`, `rounded-card`). Tailwind's
  own palette is switched off, so raw colours like `bg-zinc-100` don't exist.
- The components read the same tokens (through Tailwind, or ui-sdk's `--ui-*` variables),
  so a new design language is a new `tokens.css`; components and pages don't change.
- Light and dark follow the OS. The Dark mode toggle in the header pins one, and the
  choice is saved.

Hallmark isn't part of agent-kit or of any project: it's a skill of the environment,
installed in Rakazo's skill list (or `~/.claude/skills` on your own machine). The
design-language skill relies on Hallmark's scaffold command, its linter and its waiver
format, so move Rakazo to a newer Hallmark on purpose, as you would bump a dependency.
Try a design run on a scratch project first, then update the tested version above.

## Variants

| | `node-postgres` (default) | `node-sqlite` | `hono-cloudflare --db hyperdrive` | `hono-cloudflare --db d1` |
| --- | --- | --- | --- | --- |
| Pick it for | A Node server you host yourself | A Node server with no database to run: one file on disk | Cloudflare Workers with Postgres | Cloudflare Workers with SQLite |
| API | Fastify 5, Pino | same | Hono on Workers (`wrangler dev`) | same |
| Database | Postgres (yours, from `DATABASE_URL`), Kysely, migrations on boot | SQLite through Node's built-in `node:sqlite` (no dependency), Kysely, migrations on boot. The file is `DATABASE_PATH` (`apps/api/data/<name>.sqlite`) | Postgres through Hyperdrive, same Kysely migrations, run on the first request | D1, kysely-d1, SQL migrations applied before `wrangler dev` |

Everything else is the same in all four: the web app, `packages/contracts`, the error
shape, `GET /healthz`, `/openapi.json` with Scalar at `/docs`, the e2e tests, the hooks and
`.agent/`.

### Component library

The web app's components are headless: a library handles behaviour, focus and ARIA, and
the project styles them with Tailwind on its tokens. Pages import small wrappers from
`@/components/ui/*`, so they read the same whichever library is underneath.

| `--ui` | Library | Styled by |
| --- | --- | --- |
| `base-ui` (default) | [Base UI](https://base-ui.com) `@base-ui/react`, stable | Tailwind classes in the wrappers |
| `ui-sdk` | [ui-sdk](https://ui-sdk.dev) `@ui-sdk/react`, in beta and changing quickly | ui-sdk's `web.css`, through `--ui-*` variables that point at the tokens |

Each project's `.agent/COMPONENTS.md` says which one it has, where its docs are, and how
to add a component.

## What a project gets

- **Workspace:** a pnpm workspace with catalogs (every third-party version pinned once),
  Turborepo and Renovate.
- **`apps/web`:**
  - React 19, Rsbuild, TanStack Router and Query, ky;
  - headless components styled with Tailwind v4, from your choice of library (below);
  - typed `t()` in English and Bahasa Melayu.
- **`apps/api`:** the variant's api, validated against `packages/contracts` (Valibot),
  which also generates the OpenAPI document.
- **`packages/e2e`:** e2e tests (agent steps plus `expect` assertions), with a committed
  replay cache.
- **Checks:** Oxlint, oxfmt, Rstest and lefthook.
- **Guides for agents:** `AGENTS.md`, the `.agent/` coordination files, `.agent/DESIGN.md`
  (the design rubric) and `.agent/SECURITY_CHECKLIST.md`.
- **Design:** the `design-language` skill.

## Troubleshooting

- **`init.sh` says the api didn't answer:** read `.agent/logs/dev.log`. The usual causes
  are a port already in use (change it in `.env`) or a database URL in `.env` that
  doesn't reach a running Postgres.
- **e2e fails with `permission denied to create database`:** the role in the database
  URL needs `CREATEDB`, since each run recreates `<database>_e2e`.
- **pnpm refuses a version as too new:** pnpm 12 won't install anything published in the
  last 24 hours. Pin the release before it in the catalog.
- **pre-push fails with `REPLAY_STALE`:** a flow changed under a recorded agent step.
  Re-record that test (`e2e:record`) and commit the cache.
- **pre-push fails with `MODEL_PROVIDER_FAILED … Authentication required`:** a test has an agent step that was never
  recorded and Claude Code isn't signed in. Run `claude` and sign in, record the step
  (`e2e:record`) and commit the cache. agent-kit's
  own example test is still unrecorded
  ([irfancoder/agent-kit#1](https://github.com/irfancoder/agent-kit/issues/1)), so a fresh
  project's first push fails this way until that's done.

## Maintaining agent-kit

The kit itself:

| Path | |
| --- | --- |
| `src/`, `dist/agent-kit.mjs` | The CLI's TypeScript source, and its bundle. `dist/` is committed: `pnpm dlx` runs it without a build step |
| `package.json` | The CLI's name, `bin`, version (stamped into each scaffold commit) and the files it ships (`dist`, `templates`) |
| `templates/shared/` | Files every variant gets. `_gitignore` becomes `.gitignore`, since packing drops `.gitignore` files |
| `templates/node/base/` and `db-*/` | The Fastify api and e2e serve script, plus the files for each database (`node-postgres`, `node-sqlite`) |
| `templates/hono-cloudflare/base/` and `db-*/` | The Hono api, plus the files for each database |
| `templates/ui/base-ui/`, `templates/ui/ui-sdk/` | Each component library's `ui.json` (its packages, catalog versions and Renovate rule, merged in by the CLI), `global.css`, `components/ui` wrappers and `.agent/COMPONENTS.md` |
| `SKILL.md` | The agent-kit skill: asks for the brief and choices, then runs the CLI |
| `test/selftest.ts` | `pnpm test`: builds the CLI and scaffolds every variant with it |
| `scripts/record-cache.ts` | `pnpm record-cache`: records the e2e replay cache that ships in the template |
| `FINDINGS.md` | Research behind the tool choices |

Working on it:

```bash
pnpm install
pnpm dev -- /tmp/try-it      # run the CLI from source
pnpm check                   # type checks, and bundle to dist/agent-kit.mjs (commit it)
pnpm test                    # the selftest (below)
```

To change the template or the CLI:

1. Edit files under `templates/` or `src/`. Templates must stay valid as they are: the
   `kitapp` placeholder is a real package name, so don't use `__NAME__`-style tokens.
2. If the example UI or the e2e tests changed, re-record the replay cache with
   `pnpm record-cache` (signed in with `claude`), and commit
   `templates/shared/packages/e2e/.e2e/cache`.
3. Run `pnpm test`, or `pnpm test node-postgres` for one variant, with `DATABASE_URL`
   set to a Postgres you run (not needed for `node-sqlite` or `hono-cloudflare:d1` alone). It builds the CLI
   (and fails if the committed `dist/` is out of date), scaffolds each variant, runs
   the hooks with Claude Code signed out, and fails on any leftover placeholder. It must
   pass before an update is merged. `KEEP=1 pnpm test` keeps the scaffolded projects so
   you can look at them.
4. Commit `dist/` with the change.

Releasing:

1. Bump `version` in `package.json` and run `pnpm check`.
2. Commit, including `dist/`.
3. Tag and push: `git tag v0.2.0 && git push --tags`. `#semver:^0` picks it up straight
   away.

Use a major bump when the generated layout changes in a way that breaks existing
projects, or the CLI's flags change in a way that breaks the skill.

Projects don't update themselves from agent-kit. A fix that existing projects need is
applied to them by hand or through an agent ticket.
