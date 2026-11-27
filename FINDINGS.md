# WP0 findings

Research behind the template, recorded on 2026-11-27. Each answer was checked by
running the tool in a scaffolded project, not only by reading docs. e2e's docs
ship inside the package (`node_modules/e2e/docs`), which is where the e2e
answers were read.

## Decisions on the open questions

| Question | Answer |
| --- | --- |
| Brand palette and type | None in agent-kit: projects start neutral (greys, system type, the 1.2 app scale) and set their own design language with the design-language skill (Hallmark). Values live in the template's `apps/web/src/styles/tokens.css`. |
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

## Components and styling: ui-sdk and Tailwind v4

Docs: [ui-sdk](https://ui-sdk.dev/docs) (also shipped in `node_modules/@ui-sdk/react/docs`), [Tailwind v4](https://tailwindcss.com/docs).

An earlier version used StyleX components on Base UI, from a private shadcn registry in
this repo. After the Hallmark trial run they were replaced, for three reasons:
Hallmark's linter reads plain CSS and Tailwind class strings but not `stylex.create`
objects, so the Floor rules went unchecked in components; Hallmark's CSS had to be
rewritten into StyleX by hand; and StyleX's compiler gotchas (dropped token imports,
hashed cross-file constants) cost every run time.

- **ui-sdk** (`@ui-sdk/react` + `@ui-sdk/core`, Apache-2.0, vercel-labs/ui), pinned at
  `0.1.0-beta.17`: it's in beta and its APIs may change. It has its own behaviours (no
  Base UI, Radix or React Aria), renders no styles, and imports one entry per component.
  Its docs and an agent skill ship inside the package, matching the installed version.
  Its agent bridge (`createAgent`, WebMCP) isn't wired in yet.
- **Default look:** `@ui-sdk/core/web.css`, imported after Tailwind with
  `layer(components)`, under `@layer ui-sdk;` declared first. It reads only `--ui-*`
  variables, which `tokens.css` points at Hallmark's roles. Its focus ring is
  `--ui-ring`, mapped to `--color-focus` (solid) so it clears 3:1.
- **Tailwind v4** through `@tailwindcss/postcss` (Rsbuild picks up `postcss.config.mjs`).
  `tokens.css` uses Hallmark's Tailwind layout (`@theme static` for colours, fonts, text,
  radii, shadows and eases), with `--color-*: initial` so Tailwind's palette doesn't exist.
  No `--spacing-*` names, as Hallmark advises.
- **Colour scheme:** ui-sdk's `createColorScheme` writes `data-color-scheme` on `<html>`
  (`system`, `light`, `dark`) and stores the choice in localStorage. `preferencesScript`
  is injected into `index.html` by `rsbuild.config.ts`, so the saved scheme applies before
  the first paint. Rsbuild's Lightning CSS rewrites `light-dark()` into its
  `--lightningcss-light/dark` fallback and adds the matching variables to each
  `color-scheme` rule, so switching works.
- **Hallmark's linter on the neutral template:** it flags no stamp (added by the Hallmark
  run) and no `:focus-visible`/`:active`/`:disabled` styling, because web.css is in
  `node_modules`. The design-language skill restates those states in `global.css`.
- **Gotcha:** ui-sdk's solid button is `data-variant="solid"`, not `primary`.

## Hallmark (design language)

Source: [nutlope/hallmark](https://github.com/nutlope/hallmark), MIT, pinned at `04977e1` (v2.0.0).

- **What it is:** a design skill for Claude Code and Codex. It has a "Floor" of rules a
  build can't break (every colour and font through a token, focus-visible on every
  control, reduced-motion fallbacks, no invented metrics). It deals a theme from about 50
  so projects don't converge on one look, and has an app-screen scope for tools and
  dashboards. Its linter is `scripts/sloplint.mjs` (a static tier, plus a render tier
  that needs puppeteer-core and Chrome).
- **Where it plugs in:** Hallmark's source of truth is a `tokens.css` of CSS variables with
  fixed role names (`--color-paper`, `--color-ink`, `--color-accent`, `--font-body`,
  `--text-*`, `--space-*`, …). Its rule for an existing project is to map onto the
  project's token names, not add a parallel set. So the template's `tokens.css` uses
  Hallmark's names and its Tailwind v4 layout, and maps ui-sdk's `--ui-*` variables onto
  them. A Hallmark run replaces values in one file and everything follows.
- **Locking:** "lock the system" writes `DESIGN.md` at the repo root. Hallmark's
  pre-flight treats a root `DESIGN.md` as locked and makes every later run follow it.
  That is why the template keeps its own rubric in `.agent/DESIGN.md` and ships no root
  `DESIGN.md`.
- **App scale:** Hallmark's app-screen type scale (0.75 / 0.875 / 1 / 1.2 / 1.44 / 1.728 /
  2.074rem) is the template's existing scale, so nothing moves.
- **Network:** only `theme.mjs photos --save` (Wikimedia downloads) and `imagegen.mjs`
  (Together AI, only with `TOGETHER_API_KEY`) call out. The scaffold, the deal and the
  linter are local.
- **Install:** `npx skills add nutlope/hallmark` installs whatever is latest, so
  agent-kit's `scripts/install-hallmark.sh` fetches the pinned commit and copies
  `skills/hallmark` into `~/.claude/skills` and `~/.agents/skills` on a local machine.
  In Rakazo, Hallmark is copied into the bot's skill list at the same commit. Hallmark's
  optional edit-time hook edits Claude Code settings, so it isn't installed.

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
  `.env.example`, `.e2e/cache/`) packs fine; `selftest.sh` compares nothing here, but a
  `pnpm pack` listing matched every tracked template file.
- **Executable bits:** the CLI marks the project's `.sh` files executable after copying.
- **No temp files:** the skill pipes the brief to `--brief-file -`, and pnpm manages its
  own download cache.

### Trial run (2026-11-27)

I gave a scaffolded "Stock Ledger" project a design language with the skill. Hallmark
dealt Ink, Vellum and Coral and Ink was picked. The run went through Hallmark's
scaffold, a merge into `tokens.css` with dark values derived from its recipe, a ruled
ledger list as the signature, and `sloplint` (0 FAIL, the zero-chroma gate waived as
Ink asks). DESIGN.md was locked and the commit passed pre-commit. What it changed in
the template:

- **`data-slot` clash:** Hallmark's `base.css` styles every `[data-slot]` as a photo
  slot, but the components (shadcn-style then, ui-sdk now) put `data-slot` on every
  part. The skill deletes those rules.
- **Primary colour:** Hallmark's `--color-accent` is a signal colour, but Ink's primary
  button is ink-filled. Components now paint primary actions with a
  `--color-primary` role, which defaults to the accent.
- **Waivers:** need the exact `/* Hallmark · waive <gate> · <evidence> · <reason> */`
  form, with a reason that uses words from the page.
- **`WEB_PORT`:** `init.sh` exported it but Turborepo drops shell env, so the web
  server ignored it. Rsbuild now reads it from `.env`.
- **Icons:** sloplint gate 33 can't see `aria-hidden` spread from an object, so the
  icons set it inline.
- **Not run:** Hallmark's render tier (screenshots, contrast in the browser) needs
  `npm i -g puppeteer-core` and Chrome. I checked both themes in a browser by hand
  instead.

## lefthook

Docs: [lefthook](https://lefthook.dev/).

- `pre-push` is configured like `pre-commit`; `pnpm exec lefthook run pre-push` runs it by hand, and `--all-files` applies to file-filtered commands. Hooks are installed by the root `prepare` script (`lefthook install`) on `pnpm install`.
- pnpm 12 blocks install scripts unless listed in `allowBuilds`; lefthook's postinstall isn't needed since `prepare` installs the hooks.

## pnpm 12

- `allowBuilds` replaces `onlyBuiltDependencies`.
- `minimumReleaseAge` is on by default (24 hours) and also checks the lockfile before `pnpm exec`.
