# agent-kit

IRFANCODER's project template and scaffold command. One command starts a new project in
Irfan's standard stack, with everything a Rakazo agent team (Lead, Planner, Builder,
Evaluator) needs to build it on its own: the app skeleton, git hooks that check every
commit and push, e2e tests, and the `.agent/` files the bots coordinate through.

Everything here is built from each open-source tool's own documentation. It doesn't use,
copy or link to any MOF code or assets.

## Contents

- [Before you start](#before-you-start)
- [Start a project](#start-a-project)
- [Run it](#run-it)
- [A project's life with an agent team](#a-projects-life-with-an-agent-team)
- [Everyday commands](#everyday-commands)
- [Design language](#design-language)
- [Variants](#variants)
- [What a project gets](#what-a-project-gets)
- [Troubleshooting](#troubleshooting)
- [Maintaining agent-kit](#maintaining-agent-kit)

## Before you start

You need these on the machine, once:

| Tool | Version | Why |
| --- | --- | --- |
| Node.js | 24.8 or newer | Runs TypeScript files directly (type stripping) |
| pnpm | 12 | Workspaces and the dependency catalog |
| git, rsync | any recent | The scaffold copies the template and makes the first commit |
| Claude Code | signed in with `claude` | Records e2e agent steps, on your Claude Max plan |
| Docker | running | Local Postgres (not needed for `--db d1`) |

Then get agent-kit itself. It's a private repo:

```bash
gh repo clone irfancoder/agent-kit ~/agent-kit
```

If projects will get a design language (most will), install the Hallmark design skill once
per machine, at the version agent-kit pins:

```bash
~/agent-kit/scripts/install-hallmark.sh
```

## Start a project

```bash
~/agent-kit/scaffold.sh ~/projects/budget-tracker --name budget-tracker --title "Budget Tracker"
```

| Option | Default | |
| --- | --- | --- |
| `<dir>` | | Where the project goes. It must not exist yet |
| `--name` | | kebab-case. It becomes the package scope (`@budget-tracker/web`) |
| `--title` | from `--name` | The app's display name |
| `--variant` | `node-postgres` | `node-postgres` or `hono-cloudflare` (see [Variants](#variants)) |
| `--db` | `hyperdrive` | `hono-cloudflare` only: `hyperdrive` (Postgres) or `d1` (SQLite) |

The command:
1. copies the template;
2. puts your name and title in place of the `kitapp` / `Kit App` placeholders;
3. creates `.env` from `.env.example`;
4. installs dependencies;
5. makes one commit, `chore: scaffold via agent-kit <version>`, on `main`.

That commit goes through the project's own pre-commit hook, so a fresh project always
starts green. Nothing is pushed: add a remote yourself when you're ready, for example:

```bash
cd ~/projects/budget-tracker
gh repo create irfancoder/budget-tracker --private --source . --push
```

## Run it

In the new project:

```bash
./.agent/init.sh
```

It starts the database, the api and the web app, and waits until the api answers. It's
safe to run again; it reuses whatever is already running. Then open:

- the web app: http://127.0.0.1:3000
- the api's docs: http://127.0.0.1:3001/docs (Scalar), from `/openapi.json`

To stop the dev servers: `kill $(cat .agent/logs/dev.pid)`. To stop Postgres:
`docker compose down`.

Ports are set in `.env` (`WEB_PORT`, `PORT`, `POSTGRES_PORT`). Change them there if
3000, 3001 or 5432 are taken, and keep `API_URL` and `DATABASE_URL` in step.

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
- **A component:** import it from [ui-sdk](https://ui-sdk.dev), one entry each
  (`import { Select } from '@ui-sdk/react/select'`). Its docs for the installed version are
  in `node_modules/@ui-sdk/react/docs` (start at `llms.txt`). Style with Tailwind utilities
  on the token names (`bg-paper`, `text-muted`, `rounded-card`). Shared pieces ui-sdk
  doesn't ship (`Card`, `EmptyState`) are in `apps/web/src/components`.
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

A new project looks neutral on purpose: greys, system fonts, and ui-sdk's default
component styles. Each project gets its own look once, through the **design-language**
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
- The same file points ui-sdk's `--ui-*` variables at the tokens, so the components follow
  too. A new design language is a new `tokens.css`; components and pages don't change.
- Light and dark follow the OS. The Dark mode toggle in the header pins one, and the
  choice is saved.

Hallmark is installed per machine, not shipped in each project. To move to a newer
version, change `HALLMARK_PIN` in `scripts/install-hallmark.sh` on purpose, as you would
bump a dependency, and rerun it.

## Variants

| | `node-postgres` (default) | `hono-cloudflare --db hyperdrive` | `hono-cloudflare --db d1` |
| --- | --- | --- | --- |
| Pick it for | A Node server you host yourself | Cloudflare Workers with Postgres | Cloudflare Workers with SQLite |
| API | Fastify 5, Pino | Hono on Workers (`wrangler dev`) | same |
| Database | Postgres (docker-compose), Kysely, migrations on boot | Postgres through Hyperdrive, same Kysely migrations, run on the first request | D1, kysely-d1, SQL migrations applied before `wrangler dev` |

Everything else is the same in all three: the web app, `packages/contracts`, the error
shape, `GET /healthz`, `/openapi.json` with Scalar at `/docs`, the e2e tests, the hooks and
`.agent/`.

## What a project gets

- **Workspace:** a pnpm workspace with catalogs (every third-party version pinned once),
  Turborepo and Renovate.
- **`apps/web`:**
  - React 19, Rsbuild, TanStack Router and Query, ky;
  - [ui-sdk](https://ui-sdk.dev) components styled with Tailwind v4;
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
  are a port already in use (change it in `.env`) or Docker not running.
- **Postgres won't start on 5432:** set `POSTGRES_PORT` and the port in `DATABASE_URL` in
  `.env`, then run `docker compose up -d`.
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
| `scaffold.sh`, `selftest.sh`, `VERSION` | The command, its test, and the version stamped into each scaffold commit |
| `templates/shared/` | Files every variant gets |
| `templates/node-postgres/base/` | The Fastify api, docker-compose, e2e serve script |
| `templates/hono-cloudflare/base/` and `db-*/` | The Hono api, plus the files for each database |
| `scripts/record-e2e-cache.sh` | Records the e2e replay cache that ships in the template |
| `scripts/install-hallmark.sh` | Installs the Hallmark design skill at a pinned commit |
| `FINDINGS.md` | Research behind the tool choices |

To change the template:

1. Edit files under `templates/`. Templates must stay valid as they are: the `kitapp`
   placeholder is a real package name, so don't use `__NAME__`-style tokens.
2. If the example UI or the e2e tests changed, re-record the replay cache with
   `./scripts/record-e2e-cache.sh` (signed in with `claude`), and commit
   `templates/shared/packages/e2e/.e2e/cache`.
3. Run `./selftest.sh`, or `./selftest.sh node-postgres` for one variant. It scaffolds
   each variant, runs both hooks with Claude Code signed out, and fails on any leftover
   placeholder. It must pass before an update is merged. `KEEP=1` keeps the scaffolded
   projects so you can look at them.
4. Bump `VERSION`.

Projects don't update themselves from agent-kit. A fix that existing projects need is
applied to them by hand or through an agent ticket.
