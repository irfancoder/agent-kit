# agent-kit

IRFANCODER's project template and scaffold command. One deterministic command
starts a project in Irfan's standard stack, with the files a Rakazo agent team
(Lead, Planner, Builder, Evaluator) needs to work on its own.

Everything here is built from each open-source tool's own documentation. It
doesn't use, copy or link to any MOF code or assets.

## Usage

```bash
./scaffold.sh ~/projects/budget-tracker --name budget-tracker --title "Budget Tracker"
```

| Option | Default | |
| --- | --- | --- |
| `<dir>` | | Must not exist |
| `--name` | | kebab-case; becomes the package scope (`@budget-tracker/web`) |
| `--title` | from `--name` | The app's display name |
| `--variant` | `node-postgres` | `node-postgres` or `hono-cloudflare` |
| `--db` | `hyperdrive` | `hono-cloudflare` only: `hyperdrive` (Postgres) or `d1` |

The script copies the template, replaces the `kitapp` / `@kitapp` / `Kit App`
placeholders in file contents and paths, installs dependencies, and makes one
commit, `chore: scaffold via agent-kit <version>`, through the pre-commit hook.
Then, in the new project:

```bash
./.agent/init.sh
pnpm --dir packages/e2e exec e2e-web install chromium   # once per machine
```

Requirements: Node.js 24.8+, pnpm 12, git, Docker (for Postgres), rsync.

## Design language

Scaffolded projects start with a neutral look. Each project defines its own design
language later, with the **design-language** skill it ships with
(`.claude/skills/design-language`). The skill drives [Hallmark](https://github.com/nutlope/hallmark),
an MIT-licensed design skill, and locks the result in the project's `DESIGN.md`.

Install Hallmark once per machine, at the version agent-kit pins:

```bash
./scripts/install-hallmark.sh
```

Every value lives in the project's `apps/web/src/styles/tokens.css`, in Hallmark's token
names and its Tailwind v4 layout. The same file points ui-sdk's `--ui-*` variables at those
roles. A new design language is therefore a new `tokens.css`, and components don't change. To move to a newer Hallmark, change
`HALLMARK_PIN` in the script on purpose, as you would bump a dependency.

## Variants

| | `node-postgres` | `hono-cloudflare --db hyperdrive` | `hono-cloudflare --db d1` |
| --- | --- | --- | --- |
| API | Fastify 5, Pino | Hono on Cloudflare Workers (`wrangler dev`) | same |
| Database | Postgres (docker-compose), Kysely, migrations on boot | Postgres through Hyperdrive, same Kysely migrations, run on the first request | D1 (SQLite), kysely-d1, SQL migrations applied before `wrangler dev` |
| Shared | contracts, error shape, `GET /healthz`, `/openapi.json` + Scalar `/docs`, web app, e2e, hooks, `.agent/` | | |

No variant has deploy scripts or real credentials: agents never deploy.

## What a project gets

- pnpm workspace with catalogs (every third-party version pinned once), Turborepo, Renovate
- `apps/web`: React 19, Rsbuild, TanStack Router + Query, ky, [ui-sdk](https://ui-sdk.dev) components styled with Tailwind v4, typed `t()` in English and Bahasa Melayu
- `apps/api`: the variant's api, validated against `packages/contracts` (Valibot), which also generates the OpenAPI document
- `packages/e2e`: e2e tests (agent steps + `expect` assertions) with a committed replay cache
- Oxlint + oxfmt, Rstest, lefthook (pre-commit: format, lint, `.agent/` check, types, unit tests; pre-push: e2e with `--strict-cache`)
- `AGENTS.md`, `.agent/` coordination files, `DESIGN.md` with the design rubric, `SECURITY_CHECKLIST.md`
- The `design-language` skill (Hallmark) and design tokens in Hallmark's names

## Layout

| Path | |
| --- | --- |
| `scaffold.sh`, `selftest.sh`, `VERSION` | The command, its test, and the version stamped into each scaffold commit |
| `templates/shared/` | Files every variant gets |
| `templates/node-postgres/base/` | The Fastify api, docker-compose, e2e serve script, `init.sh` |
| `templates/hono-cloudflare/base/` and `db-*/` | The Hono api, plus the files for each database |
| `scripts/record-e2e-cache.sh` | Records the e2e replay cache that ships in the template |
| `scripts/install-hallmark.sh` | Installs the Hallmark design skill at a pinned commit |
| `FINDINGS.md` | Research behind the tool choices |

## Updating the template

1. Change files under `templates/`. Templates must stay valid as they are:
   the `kitapp` placeholder is a real package name, so don't use `__NAME__`-style tokens.
2. If the example UI or the e2e tests changed, re-record the replay cache:
   `ANTHROPIC_API_KEY=… ./scripts/record-e2e-cache.sh`, and commit
   `templates/shared/packages/e2e/.e2e/cache`.
3. Run `./selftest.sh`. It must pass before an update is merged. It scaffolds every
   variant, runs both hooks with no model
   credentials, and fails on any leftover placeholder.
4. Bump `VERSION`.
