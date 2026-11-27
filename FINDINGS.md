# WP0 findings

Research behind the template, recorded on 2026-11-27. Each answer was checked by
running the tool in a scaffolded project, not only by reading docs. e2e's docs
ship inside the package (`node_modules/e2e/docs`), which is where the e2e
answers were read.

## Decisions on the open questions

| Question | Answer |
| --- | --- |
| Brand palette and type | Neutral starter set: greys plus one indigo accent, Inter/system type on a 1.2 scale, 4px spacing grid. All in `registry/items/theme/tokens.stylex.ts`; swap values there. |
| Default UI language | English and Bahasa Melayu from day one: `en.ts` (source of truth) and `ms.ts`, typed `t()` and `tCount()` (Intl.PluralRules). |
| Cloudflare database | Both, chosen at scaffold time: `--db hyperdrive` (default: Postgres through Hyperdrive, same Kysely migrations as the Node variant) or `--db d1` (D1/SQLite with kysely-d1 and SQL migrations). |
| SECURITY_CHECKLIST.md | A starter version is in `templates/shared/.agent/SECURITY_CHECKLIST.md`. Irfan supplies the final text. |
| e2e model provider | Anthropic API key (`ANTHROPIC_API_KEY`) by default, as recommended. `E2E_AGENT=claude-code` switches to the local Claude Code login over ACP. |
| Hosting | Private repo `irfancoder/agent-kit`; only Irfan can push. |

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
- **`--strict-cache`:** a recorded step that no longer matches fails with `REPLAY_STALE` (exit 2, not retried) and never falls back to the model; a strict run never writes the cache. A step that was **never recorded still runs live**, so it needs a model; with none it fails with `MODEL_PROVIDER_FAILED`. The `agent` fixture needs a model configured even when every step replays, so the config always sets one (Anthropic), which is only called if a step has to run live.
- **When a recording is written:** in `read-write` mode (the default outside CI), at the end of an attempt, for each `agent.act` that a later locator/engine assertion or `agent.assert` confirmed. Values that change per run go through `unique()`.
- **Telemetry switch:** `E2E_TELEMETRY_DISABLED=1` (set in the package scripts), or `npx e2e telemetry disable`.
- **Browsers:** `pnpm --dir packages/e2e exec e2e-web install chromium` (about 100 MB, cached per machine).

## StyleX toolchain

Docs: [Rsbuild CSS-in-JS](https://rsbuild.rs/guide/styling/css-in-js), [@stylexjs/unplugin](https://www.npmjs.com/package/@stylexjs/unplugin), [@stylexswc/unplugin](https://www.npmjs.com/package/@stylexswc/unplugin).

- **Rsbuild plugin:** StyleX's own `@stylexjs/unplugin` (0.19), through its `rspack` adapter in `tools.rspack.plugins`. It now ships an Rspack adapter, so the third-party `unplugin-stylex` isn't needed. `@stylexjs/unplugin` uses Babel; `@stylexswc/unplugin` (Rust) is the faster option if builds get slow.
- **Rstest:** Rstest is Rsbuild-based and takes the same `tools.rspack.plugins`, so `apps/web/stylex.config.ts` exports one plugin factory used by both `rsbuild.config.ts` and `rstest.config.ts`. Component tests render with real StyleX class names in happy-dom.
- **Gotcha found:** StyleX compiles token references to plain `var(--x…)` strings and removes the import, so the bundler never loads `tokens.stylex.ts` and its variable defaults never reach the CSS. `themes.ts` keeps a side-effect `import './tokens.stylex'` to fix it.
- **Gotcha found:** Rsbuild's `loadEnv` copies the whole `.env` into `process.env` by default, which leaked `NODE_ENV=development` into production builds. The config passes `processEnv: {}`.
- **Oxlint and StyleX's lint rules:** works. Oxlint 1.95's `jsPlugins` loads `@stylexjs/eslint-plugin`; `valid-styles`, `no-unused`, `valid-shorthands` and `no-legacy-contextual-styles` run in the `react` preset. No gap.

## shadcn without Tailwind

Docs: [Registry](https://ui.shadcn.com/docs/registry), [Namespaces](https://ui.shadcn.com/docs/registry/namespace), [Authentication](https://ui.shadcn.com/docs/registry/authentication), [components.json](https://ui.shadcn.com/docs/components-json).

- **No Tailwind installed:** `shadcn add` works. `components.json` still needs a `tailwind` block, so it has one with an empty `config` and `cssVariables: false`; registry items carry no `cssVars` or Tailwind config, so nothing Tailwind is written or installed.
- **Private registry:** `components.json` declares `@irfancoder` with `url: ${IRFANCODER_REGISTRY_URL}/{name}.json` and two headers: `Authorization: Bearer ${IRFANCODER_REGISTRY_TOKEN}` and `Accept: application/vnd.github.raw+json`. shadcn expands `${VAR}` from the environment and refuses to run if one is empty. The built JSON is committed in `registry/public/r` and read through GitHub's [contents API](https://docs.github.com/en/rest/repos/contents) (`https://api.github.com/repos/irfancoder/agent-kit/contents/registry/public/r`, default branch), which returns the raw file for a token that can read the repo. `raw.githubusercontent.com` returned 404 for the private repo with the same token, so it isn't used. `scripts/add-starter-components.sh` falls back to `gh auth token`.
- **Registry dependencies:** items list `@irfancoder/theme` etc. as `registryDependencies`. They list no npm `dependencies`: the template already has `@base-ui/react` and `@stylexjs/stylex` in its catalog, and letting shadcn run `pnpm add` would bypass the catalog.

## lefthook

Docs: [lefthook](https://lefthook.dev/).

- `pre-push` is configured like `pre-commit`; `pnpm exec lefthook run pre-push` runs it by hand, and `--all-files` applies to file-filtered commands. Hooks are installed by the root `prepare` script (`lefthook install`) on `pnpm install`.
- pnpm 12 blocks install scripts unless listed in `allowBuilds`; lefthook's postinstall isn't needed since `prepare` installs the hooks.

## pnpm 12

- `allowBuilds` replaces `onlyBuiltDependencies`.
- `minimumReleaseAge` is on by default (24 hours) and also checks the lockfile before `pnpm exec`.
