# WP0 findings

Research behind the template, recorded on 2026-11-27. Each answer was checked by
running the tool in a scaffolded project, not only by reading docs. e2e's docs
ship inside the package (`node_modules/e2e/docs`), which is where the e2e
answers were read.

## Decisions on the open questions

| Question | Answer |
| --- | --- |
| Brand palette and type | None in agent-kit: projects start neutral (greys, system type, the 1.2 app scale) and get their own look in a design ticket, with the impeccable skill. Values live in the template's `apps/web/src/styles/tokens.css`. |
| Default UI language | English and Bahasa Melayu from day one: `en.ts` (source of truth) and `ms.ts`, typed `t()` and `tCount()` (Intl.PluralRules). |
| Cloudflare database | Both, chosen at scaffold time: `--db hyperdrive` (default: Postgres through Hyperdrive, same Kysely migrations as the Node variant) or `--db d1` (D1/SQLite with kysely-d1 and SQL migrations). |
| SECURITY_CHECKLIST.md | A starter version is in `templates/shared/.agent/SECURITY_CHECKLIST.md`. Irfan supplies the final text. |
| e2e model provider | Claude Code over ACP (`@e2e-dev/acp`), signed in with the owner's `claude` login, so recording uses the Claude Max plan. No API key: `ANTHROPIC_API_KEY` is blanked for the agent so it can't take over from the login. |
| Hosting | Public repo `irfancoder/agent-kit` (it started private); only Irfan can push. Projects it creates are private repos. |

## Pinned versions

Every third-party version is pinned once, in the `catalog:` of
`templates/shared/pnpm-workspace.yaml`. pnpm 12 refuses versions younger than
its `minimumReleaseAge` (24 hours), so versions published in the last day were
pinned to the release before. Renovate waits 3 days (`minimumReleaseAge`).

## e2e

Docs: [Quickstart](https://e2e.com/docs/quickstart), [Cache](https://e2e.com/docs/cache), [Web](https://e2e.com/docs/web), [Models](https://e2e.com/docs/models), [Coding agents](https://e2e.com/docs/coding-agents), [Subscriptions](https://e2e.com/docs/subscriptions), [Config reference](https://e2e.com/docs/reference/config).

- **What `npx e2e init` creates:** `e2e.config.ts`, an example test, `.gitignore` entries, the e2e agent skill, a line in `AGENTS.md`/`CLAUDE.md`, and MCP config. The template writes its own `packages/e2e/e2e.config.ts` instead of running `init`.
- **Where the replay cache lives:** `.e2e/cache/` next to the config (`cache.dir`), one JSON file per entry. Committed. Keys include the project id (default: root `package.json` name), the app identity, the test and target names, the instruction and its params. The template fixes `projectId: 'agent-kit-app'` and `identity: 'web'`, so one recording made in agent-kit replays in every scaffolded project whatever its name.
- **How the app under test is started:** `app.command` on the target. The runner starts it, waits for `app.url` (or `readyUrl`), and stops it at the end. It starts only that one command and passes only `PATH`, `HOME`, temp dirs, `inheritEnv` and `env`, so `packages/e2e/scripts/serve.sh` starts the database, the api (on a free port) and the web dev server. Port `0` in `app.url` makes the runner pick the web port and pass it as `{port}`.
- **`--strict-cache`:** a recorded step that no longer matches fails with `REPLAY_STALE` (exit 2, not retried) and never falls back to the model; a strict run never writes the cache. A step that was **never recorded still runs live**, so it needs the agent; with Claude Code signed out it fails. Recorded steps replay without starting the agent, so the config's only agent is the `claudeCode()` executor, and no model provider (`ai`, `@ai-sdk/anthropic`) is installed.
- **When a recording is written:** in `read-write` mode (the default outside CI), at the end of an attempt, for each `agent.act` that a later locator/engine assertion or `agent.assert` confirmed. Values that change per run go through `unique()`.
- **Telemetry switch:** `E2E_TELEMETRY_DISABLED=1` (set in the package scripts), or `npx e2e telemetry disable`.
- **Browsers:** `pnpm --dir packages/e2e exec e2e-web install chromium` (about 100 MB, cached per machine).

## Components and styling

Docs: [Base UI](https://base-ui.com) and [ui-sdk](https://ui-sdk.dev/docs) (both also ship their docs in `node_modules`), [Tailwind v4](https://tailwindcss.com/docs).

Components are styled with Tailwind on the tokens (not CSS-in-JS), and every colour, font
and radius comes from `tokens.css`.

**Two headless libraries, chosen with `--ui`.** Pages import wrappers from
`@/components/ui/*` (button, field, input, toggle, toast) with the same props either way,
so only `templates/ui/<library>/` differs: its `ui.json` (packages, catalog versions and
Renovate rule, which the CLI merges into the project, so a project carries only the
library it chose), `global.css`, the wrappers and `.agent/COMPONENTS.md`. The colour-scheme
rules and base styles are in a shared `app.css`, so `tokens.css` holds only design values.

- **Base UI** (`@base-ui/react` 1.9.0, MIT) is the default: stable, from the Radix and
  Material UI teams. It renders no styles; the wrappers carry Tailwind classes, with the
  shared control shape and focus ring in `styles.ts`. It wraps every Base UI component;
  the shared app code uses only the five above, which ui-sdk also has. Classes merge with
  shadcn's [`cn`](https://github.com/shadcn-ui/cn) (`cn` 0.5.2, MIT, no dependencies; it
  replaces clsx + tailwind-merge), set up in `styles.ts` with the token radius and shadow
  names it can't tell apart on its own. Its toasts use a global manager
  (`Toast.createToastManager()`), so `toast.error()` works from anywhere. It doesn't set
  `data-slot`.
- **ui-sdk** (`@ui-sdk/react` + `@ui-sdk/core` 0.1.0-beta.17, Apache-2.0) is the option:
  in beta and shipping often. Its `web.css` gives every component a look and reads only
  `--ui-*` variables, which `global.css` points at the tokens. It puts `data-slot` on
  every part, and a source scan can't see its focus or pressed styles in `node_modules`. Its agent bridge (`createAgent`,
  WebMCP) isn't wired in.

**Tailwind v4** through `@tailwindcss/postcss` (Rsbuild picks up `postcss.config.mjs`).
`tokens.css` uses Tailwind's `@theme static` layout for colours, fonts, text, radii,
shadows and eases, with `--color-*: initial` so Tailwind's palette doesn't exist, and no
`--spacing-*` names.

**Colour scheme:** a small module of the template's own (`lib/color-scheme.ts`) writes
`data-color-scheme` on `<html>` (`system`, `light`, `dark`) and stores the choice;
`rsbuild.config.ts` puts a one-line script in `index.html` so the saved scheme applies
before the first paint. Rsbuild's Lightning CSS rewrites `light-dark()` into its
`--lightningcss-light/dark` fallback and defines those variables only in rules that
declare `color-scheme`. So `app.css` declares it for every scheme: without that rule every
colour is invalid.

**Gotcha:** Rsbuild 2 compiles dynamic imports lazily in dev by default, and every
code-split route is one. The first visit then sends the component library through an HMR
update it can't accept, and the page reloads mid-e2e. `dev.lazyCompilation` is off.

## impeccable (design)

Source: [pbakaus/impeccable](https://github.com/pbakaus/impeccable), Apache-2.0. The
steps are written for skill v4.11.1 (tag `skill-v4.11.1`, commit `2fc5e14`). It replaced
the design skill agent-kit used through v0.2.

- **What it is:** a design skill of many commands. The ones agent-kit uses: `init`
  writes `PRODUCT.md` (users, purpose, constraints); `shape` plans a screen before code
  and, for a new look, runs a direction round (a visual world, then a concept) into a
  brief; a build request then makes it, and at the finish its documenter writes
  `DESIGN.md` from the built result; `audit` scores accessibility, performance,
  theming, responsive behaviour and anti-patterns; `critique` scores Nielsen's
  heuristics, with a design-specificity verdict. Both rank findings P0–P3. Its
  deterministic detector (`impeccable detect`) runs inside `critique`, and on its own.
- **Where it plugs in:** it reads and writes `PRODUCT.md` and `DESIGN.md` at its
  project root, plus a few shared files under `.impeccable/`. In a scaffolded project
  `impeccable context` finds one UI app, `apps/web`, and from the repo root stops to ask
  which app to use; run from `apps/web`, that's its root. It doesn't look in `.agent/`, so `.agent/DESIGN.md` stays agent-kit's own: the tokens' rules, the
  review gate and the design ticket's steps. The template ships no `DESIGN.md` for it, but
  it reads the neutral starter styles as an incumbent look, so the design ticket tells
  it the look is a replacement world.
- **Modes:** it picks ambition from the surface. App screens are Operate: restraint and
  precision over expression, and always built code-first (no image comp).
- **No one to ask:** `init`, `shape` and the build ask questions. Its rules let it infer
  from the brief when the user says to proceed, labelling what it inferred, so the
  ticket points it at `.agent/BRIEF.md` and `.agent/GOAL.md` and has the bot proceed.
- **Network:** the skill's engine is a binary that ships with it or downloads once into
  `~/.impeccable/bin/`. A new look fetches visual directions from the impeccable.style
  catalog, and sends an anonymous record of which were shown and picked unless
  telemetry is off (`npx impeccable telemetry off`, `DO_NOT_TRACK=1`, or
  `"telemetry": false` in `.impeccable/config.json`). It never sends the project's
  files or `PRODUCT.md`.
- **Install:** a skill of the environment, not of agent-kit (the README says how). Its
  optional edit-time hook writes into Claude Code's settings and runs outside the
  model's approvals, so it isn't used.
- **Not run yet:** a full design ticket on a scaffolded project with impeccable. The
  steps were written from its docs; the first real run should confirm them.

### Trial run with the earlier design skill (2026-11-27)

A scaffolded "Stock Ledger" project got its look with the skill agent-kit used before
impeccable. What it changed in the
template, which still holds:

- **Primary colour:** an accent is a signal colour, but some looks have an ink-filled
  primary button. Components paint primary actions with a `--color-primary` role,
  which defaults to the accent.
- **`WEB_PORT`:** `init.sh` exported it but Turborepo drops shell env, so the web
  server ignored it. Rsbuild now reads it from `.env`.
- **Icons:** a linter can't see `aria-hidden` spread from an object, so the icons set it
  inline.

## Running from Rakazo, and the CLI

Rakazo's bots can only invoke skills from Rakazo's skill list, so agent-kit is used as
one skill, `SKILL.md` at the repo root. It holds only instructions.

The kit itself is a CLI run with `pnpm dlx github:irfancoder/agent-kit#semver:^0`. It's
TypeScript, bundled
by esbuild into a committed `dist/agent-kit.mjs`, so `pnpm dlx` needs no build step. It
has no runtime dependencies: its questions use `node:readline`. Releases are git tags.

- **Public repo:** pnpm resolves `github:` packages with `git ls-remote` over HTTPS and
  never asks for credentials. While the repo was private that failed with
  `ERR_PNPM_GIT_RESOLVE_FAILED … could not read Username` unless git used gh's login
  (`gh auth setup-git`). Public, it needs no login.
- **Dotfiles:** packing drops `.gitignore` files, so the template stores it as
  `_gitignore` and the CLI renames it. Every other template dotfile (`.agent/`, `.claude/`,
  `.env.example`, `.e2e/cache/`) packs fine: a `pnpm pack` listing matched every tracked
  template file, and `pnpm test` checks the generated `.gitignore`.
- **Executable bits:** the CLI marks the project's `.sh` files executable after copying.
- **No temp files:** the skill pipes the brief to `--brief-file -`, and pnpm manages its
  own download cache.

## lefthook

Docs: [lefthook](https://lefthook.dev/).

- `pre-push` is configured like `pre-commit`; `pnpm exec lefthook run pre-push` runs it by hand, and `--all-files` applies to file-filtered commands. Hooks are installed by the root `prepare` script (`lefthook install`) on `pnpm install`.
- pnpm 12 blocks install scripts unless listed in `allowBuilds`; lefthook's postinstall isn't needed since `prepare` installs the hooks.

## pnpm 12

- `allowBuilds` replaces `onlyBuiltDependencies`.
- `minimumReleaseAge` is on by default (24 hours) and also checks the lockfile before `pnpm exec`.
