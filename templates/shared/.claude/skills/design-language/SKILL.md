---
name: design-language
description: Define or change this project's design language (palette, type, shape, motion) with the Hallmark skill, then lock it in DESIGN.md. Use for the project's design ticket, which the Planner schedules before any UI feature work, or when the owner asks to change the look. Not for feature tickets: those follow the locked DESIGN.md.
---

# Design language

agent-kit ships a neutral starter look on purpose. This skill gives the project its own,
once, using [Hallmark](https://github.com/nutlope/hallmark) (pinned by agent-kit), and
locks it so every later screen shares it.

## How the styling is wired

- `apps/web/src/styles/tokens.css` holds every value, in **Hallmark's token names**
  (`--color-paper`, `--color-ink`, `--color-accent`, `--font-body`, `--text-*`,
  `--space-*`, `--radius-card`, …). Each colour is written once as
  `light-dark(<light>, <dark>)`; the OS picks one and `data-theme` pins it.
- `apps/web/src/styles/tokens.stylex.ts` only points StyleX at those variables.
  Components (`src/components/ui`) read StyleX tokens and never a raw value.
- So **a new design language is a new `tokens.css`**. Components and pages follow
  without edits.

## Before you start

1. Make sure Hallmark is installed at agent-kit's pinned version: run
   `scripts/install-hallmark.sh` from the agent-kit checkout (`~/agent-kit` on the team
   computer). It does nothing when the pinned version is already there. If it fails,
   append a line to `.agent/PROGRESS.md` saying so and stop. Don't improvise a design
   without it.
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
  - the project's extra tokens (`--color-paper-2/3`, `--color-error-ink`,
    `--shadow-color`, `--radius-inner`, `--radius-control`, `--control*`, `--weight-*`,
    `--leading-*`).

  Hallmark's scaffold writes `tokens.css` and `base.css` beside `global.css`. Merge its
  values into the existing file rather than keeping two token sets. Import `base.css`
  in `global.css` right after `tokens.css`.

- **Styling is StyleX.** No Tailwind, no new CSS files for components. A look that tokens
  can't express (a different control shape, say) changes the component in the
  IRFANCODER registry (agent-kit/registry), not a local copy. Record the request in
  `.agent/DECISIONS.md`.
- **Fonts:** self-host them. Add the files under `apps/web/public/fonts`, put the
  `@font-face` rules in `tokens.css`, and record the licence in `DECISIONS.md`.
- **Copy and flows stay as they are.** Labels, headings and roles drive the e2e replay
  cache; restyling must not rename them.

## Check it

1. Hallmark's sweep, against the running app:
   `node ~/.claude/skills/hallmark/scripts/sloplint.mjs apps/web/src --scope app --render --url http://127.0.0.1:3000/`
   Fix every FAIL; fix or waive (with a reason) every REFLEX. Without puppeteer-core
   and Chrome only the static tier runs; say so, and never claim a render pass.
2. Screenshot the main screen in light and dark (`document.documentElement.dataset.theme`),
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
