# Kit App

Guide for people and agents working in this repo. Scaffolded by agent-kit.

## Layout

| Path                                          | What it is                                                                                           |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `apps/web`                                    | React 19 SPA: Rsbuild, TanStack Router (file-based, `src/routes`) and Query, ky, ui-sdk, Tailwind v4 |
| `apps/web/src/styles/tokens.css`              | Design tokens (Hallmark's names), Tailwind utilities, and ui-sdk's `--ui-*` mapping                  |
| `apps/web/src/i18n`                           | Typed `t()` messages: `en.ts` (source of truth) and `ms.ts`                                          |
| `apps/api`                                    | The api (see `apps/api/src/app.ts`), with Valibot validation, Pino logs, Kysely                      |
| `packages/contracts`                          | Valibot schemas and the one route map shared by web and api; generates `/openapi.json`               |
| `packages/e2e`                                | e2e tests (`tests/*.e2e.ts`) and the committed replay cache (`.e2e/cache`)                           |
| `packages/tsconfig`, `packages/oxlint-config` | Shared presets                                                                                       |
| `.agent/`                                     | Agent-team coordination files (see below)                                                            |

## Commands

| Command                                         | Does                                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `./.agent/init.sh`                              | From a fresh clone: install, start the database and both dev servers, wait for `/healthz` |
| `pnpm dev`                                      | Start web (http://127.0.0.1:3000) and api (http://127.0.0.1:3001)                         |
| `pnpm typecheck` / `pnpm lint` / `pnpm format`  | Type checks, Oxlint, oxfmt (write)                                                        |
| `pnpm test`                                     | Unit tests (Rstest)                                                                       |
| `pnpm e2e`                                      | e2e tests. Starts the database, api and web itself                                        |
| `pnpm --filter @kitapp/e2e e2e:record`          | Re-record agent steps (needs a model, see `packages/e2e/e2e.config.ts`)                   |
| `pnpm exec lefthook run pre-commit --all-files` | Run a hook by hand                                                                        |

API docs: http://127.0.0.1:3001/docs (Scalar) and `/openapi.json`.

## Conventions

- **Dependencies:** every third-party version is pinned once, in the `catalog:` of `pnpm-workspace.yaml`. Packages use `"catalog:"`. Renovate updates them.
- **API:** a change starts in `packages/contracts/src/routes.ts` (route + schemas). The api registers it with `defineRoute`, which validates the request and the response against the contract. `/openapi.json` must show the change.
- **Errors:** every api error has the shape `{ "error": { "code", "message", "details"? } }`.
- **Env:** a new env var goes into the env schema (`apps/api/src/env.ts`) and `.env.example`. The api refuses to start on a missing or bad value.
- **Design language:** set once with the `design-language` skill (Hallmark), locked in `DESIGN.md` at the root. The Planner schedules it before any UI feature; after that, every UI ticket follows `DESIGN.md`.
- **UI:** components from [ui-sdk](https://ui-sdk.dev), one entry each (`import { Select } from '@ui-sdk/react/select'`); its docs for the installed version are in `node_modules/@ui-sdk/react/docs` (start at `llms.txt`), and its skill at `node_modules/@ui-sdk/core/skills/ui-sdk/SKILL.md`. Style with Tailwind utilities on the token names (`bg-paper`, `text-muted`, `rounded-card`) and ui-sdk's state attributes (`data-open:`, `aria-pressed:`); there is no Tailwind palette, no raw values and no `dark:` variant (colours are `light-dark()` tokens). Shared app pieces ui-sdk doesn't ship (`Card`, `EmptyState`) live in `src/components`; reuse them rather than repeating their classes. Name every control. Read `.agent/DESIGN.md` first.
- **Copy:** user-facing text goes through `t()`; add the key to `en.ts` and `ms.ts`.
- **Database:** Kysely, no ORM. Add a migration file and list it in the migrations map; migrations run on boot.

## Agent team files (`.agent/`)

| File                    | Rule                                                                                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BRIEF.md`              | The Lead pastes the owner's brief here word for word                                                                                                       |
| `GOAL.md`               | Written by the Planner, then frozen. The Lead may only add clarifications                                                                                  |
| `SPEC.md`               | Written by the Planner                                                                                                                                     |
| `DECISIONS.md`          | Append-only: `YYYY-MM-DD — decision — reason`                                                                                                              |
| `feature_list.json`     | Created by the Planner. Only the Evaluator flips `passes`. Items are never deleted or reworded. Must match `feature_list.schema.json` (`pnpm check:agent`) |
| `PROGRESS.md`           | Append-only, one line per run: `date \| bot \| ticket \| what changed \| what's next`                                                                      |
| `STATUS`                | One of `RUNNING`, `PAUSED_LIMIT`, `DONE`, `BLOCKED`. Only the Lead writes it                                                                               |
| `DESIGN.md`             | Tokens, scale, mood and the design rubric. Read by the Builder and the Evaluator                                                                           |
| `SECURITY_CHECKLIST.md` | Every PR is checked against it                                                                                                                             |
| `init.sh`               | One idempotent command from a fresh clone                                                                                                                  |

## Rules for agents

1. **Never commit or push to `main`.** Every change goes through a short-lived branch (`feat/<id>` or `fix/<id>`) and a PR. Use Conventional Commits (`feat: …`, `fix: …`, `chore: …`).
2. **Never use `--no-verify`** on commit or push, and never disable or edit hooks to get past them. Fix the failure.
3. **e2e tests:** use agent steps (`agent.act`) to get through flows, and `expect` assertions to decide pass or fail. `agent.assert` must never be a test's only check.
4. **If a change alters a flow,** re-record that test's replay cache on purpose (`e2e:record`) and commit the cache in the same PR. Never delete a test to make the suite pass.
5. **API changes start in `packages/contracts`.** `/openapi.json` must show the change.
6. **Every new env var** goes into the env schema and `.env.example`.
7. **Read `.agent/` state before working,** and append a line to `PROGRESS.md` before stopping.
