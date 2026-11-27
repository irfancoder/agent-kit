---
name: design-language
description: Define or change this project's design language (palette, type, shape, motion) with the Hallmark skill, then lock it in DESIGN.md. Use for the project's design ticket, which the Planner schedules before any UI feature work, or when the owner asks to change the look. Not for feature tickets: those follow the locked DESIGN.md.
---

# Design language

agent-kit ships a neutral starter look on purpose. This skill gives the project its own,
once, using [Hallmark](https://github.com/nutlope/hallmark) (pinned by agent-kit), and
locks it so every later screen shares it.

## How the styling is wired

- Components come from [ui-sdk](https://ui-sdk.dev) (`@ui-sdk/react/<component>`). They
  render no styles; `@ui-sdk/core/web.css` gives them their default look, and it reads
  only `--ui-*` variables.
- `apps/web/src/styles/tokens.css` holds every value, in **Hallmark's token names and its
  Tailwind v4 layout**: colours, fonts, text sizes, radii, shadows and eases in
  `@theme static` (so each is a utility: `bg-paper`, `text-ink`, `rounded-card`), the
  rest in `:root`. Each colour is one `light-dark(<light>, <dark>)`; `data-color-scheme`
  on `<html>` picks one. The same file points ui-sdk's `--ui-*` variables at the roles.
- Pages and features style with Tailwind utilities on those names. Tailwind's own palette
  is switched off (`--color-*: initial`), so `bg-zinc-100` doesn't exist.
- So **a new design language is a new `tokens.css`**. web.css, the components and the
  pages follow without edits.

## Before you start

1. You need the **Hallmark** skill. In Rakazo it's in the bot's skill list; on your own
   machine, agent-kit's `scripts/install-hallmark.sh` installs it. Below, `<hallmark>`
   means its skill folder. If you don't have the skill, append a line to
   `.agent/PROGRESS.md` saying so and stop. Don't improvise a design without it.
2. Read `.agent/BRIEF.md` and `.agent/GOAL.md`. They answer Hallmark's four questions
   (material, audience, use, tone). Don't ask the owner; Hallmark doesn't ask when
   nobody can answer, and it states what it inferred.
3. If `DESIGN.md` exists at the repo root, the system is already locked. Change it only
   if the ticket says to, and then by amending it (Hallmark adds a `## Variants`
   section) rather than starting over.
4. Start the app: `./.agent/init.sh`.

## Run Hallmark

Invoke `/hallmark` (or "use hallmark to …") with a prompt built from the brief, for the
app's main screen (`apps/web/src/routes/index.tsx` and its feature). It is an **app
screen**, not a marketing page: tables, forms and controls, `--scope app`. Hallmark
deals a theme, or designs a custom one if the brief asks for something bespoke.

Hold Hallmark to this project's constraints. Where they conflict, they win over its
defaults:

- **Tokens go in `apps/web/src/styles/tokens.css`**, keeping its names and structure:
  - every colour as one `light-dark(<light>, <dark>)` declaration (Hallmark's light and
    dark values side by side), and the derived colours and shadows that build on them;
  - `--color-*: initial` first in `@theme static`, so Tailwind's palette stays off;
  - the project's extra tokens (`--color-paper-2/3`, `--color-error-ink`,
    `--color-control-edge`, `--shadow-color`, `--radius-inner`, `--radius-control`,
    `--weight-*`, `--leading-*`);
  - the `--ui-*` block, which maps ui-sdk onto the roles. Change what a `--ui-*` points
    at (say `--ui-radius: var(--radius-pill)` for a pill theme), never give it a raw value.

  Run Hallmark's scaffold into a side folder
  (`theme.mjs scaffold <slug> --scope app --dealt "…" --dir .hallmark/scaffold`), then
  merge its values into the existing `tokens.css` rather than keeping two token sets.
  Both use Hallmark's Tailwind layout, so it's a value-for-value merge.
  A light-only theme needs dark values: derive them with Hallmark's
  `references/dark-mode.md` recipe (hue never moves, paper 12–18% L, ink stays the
  theme's chroma). Delete `.hallmark/scaffold` afterwards.

- **The primary action's colour is `--color-primary`** (default: the accent). If the
  theme's primary button isn't the accent (Ink's is ink-filled), set
  `--color-primary: var(--color-ink)` and `--color-primary-ink: var(--color-paper)`.
  Solid buttons (`data-variant="solid"`), checked boxes and switches follow it.
- **`base.css`:** copy Hallmark's `base.css` to `apps/web/src/styles/base.css` and
  import it in `global.css` right after `tokens.css`, as `@import './base.css' layer(base);`
  (unlayered, its element rules would beat every utility). **Delete its `[data-slot]`
  rules** (the photo-slot rules and the "photographs" filter): ui-sdk puts `data-slot`
  on every part, and those rules would give every button and field a gradient
  background and `overflow: hidden`. App screens have no photo slots.
- **The stamp** goes at the top of `apps/web/src/styles/global.css`, before the
  `@import` lines. Waivers sit under it, in the exact form
  `/* Hallmark · waive <gate> · <evidence> · <reason> */`; sloplint rejects a reason
  that shares no word with the page.

- **Styling is Tailwind utilities on the token names**, plus web.css. A look that tokens
  can't express (a different control shape, say) goes in `global.css`, in
  `@layer components`, selecting ui-sdk's `data-slot` and state attributes
  (`[data-slot="button"][data-pressed]`). Never `!important`, never a raw value, never
  generated ids. ui-sdk's own skill (`node_modules/@ui-sdk/core/skills/ui-sdk/SKILL.md`,
  then `references/styles.md`) lists the slots, the icons web.css draws and the sizes it sets.
- **Fonts:** self-host them, never a font CDN link. The simplest way is the
  `@fontsource/<family>` package (pin it in the pnpm catalog) imported per weight in
  `global.css`, for example `@import '@fontsource/epilogue/700.css';`. Record the
  licence in `DECISIONS.md`.
- **Copy and flows stay as they are.** Labels, headings and roles drive the e2e replay
  cache; restyling must not rename them.

## Check it

1. Hallmark's sweep, against the running app:
   `node <hallmark>/scripts/sloplint.mjs apps/web/src --genre <genre> --scope app --render --url http://127.0.0.1:3000/`
   Fix every FAIL; fix or waive (with a reason) every REFLEX. Findings in
   `__tests__/` files are test fixtures, not UI: dismiss them. The static tier can't see
   web.css (it's in `node_modules`), so it reports no `:focus-visible`, `:active` or
   `:disabled` styling: restate the focus ring, pressed and disabled states for
   `[data-slot]` in `global.css` from the tokens, rather than waiving them. Without puppeteer-core
   and Chrome only the static tier runs; say so, and never claim a render pass.
2. Screenshot the main screen in light and dark (`colorScheme.set('light' | 'dark')`, or `data-color-scheme` on `<html>`),
   and score both against the rubric in `.agent/DESIGN.md`. Below 7 on any criterion: revise.
3. The repo's hooks: `pnpm exec lefthook run pre-commit --all-files` and `pnpm e2e --strict-cache`.

## Lock it

Ask Hallmark to **lock the system**. It writes `DESIGN.md` at the repo root (its
format: genre, theme, token roles, controls, motion). From then on every Hallmark run
and every UI ticket treats it as the rule. Then:

- commit `DESIGN.md`, `apps/web/src/styles/tokens.css` (and `base.css`, fonts), and
  `.hallmark/` (Hallmark's log, so later runs remember what was dealt);
- add the picks to `.agent/DESIGN.md` (mood, reference screenshots under
  `.agent/design-examples/`) and a line to `.agent/DECISIONS.md`;
- append to `.agent/PROGRESS.md`.

Work on a branch (`feat/design-language`) and open a PR, as for any ticket.
