# Design

Read by the Builder and the Evaluator before any UI work.

## The look

The project starts with agent-kit's neutral look. It gets its own look once, in the
design ticket the Planner opens before any UI feature, with the
[impeccable](https://github.com/pbakaus/impeccable) skill (steps below). Impeccable
treats `apps/web` as its project and keeps two records there: `apps/web/PRODUCT.md` (who
the product is for and what it does) and `apps/web/DESIGN.md` (the visual system it
built), plus its shared files in `apps/web/.impeccable/`.

- Once `apps/web/DESIGN.md` exists, the look is locked: every UI ticket follows it.
  Only a ticket that says so changes it.
- Values live in `apps/web/src/styles/tokens.css`. They are Tailwind utilities
  (`bg-paper`, `text-ink`, `rounded-card`); Tailwind's own palette is off. Nothing
  hard-codes a colour, size, radius or shadow.
- Components: the wrappers in `apps/web/src/components/ui/`, around the headless library
  described in `.agent/COMPONENTS.md`. Look a component up in the library's docs before
  building one; never hand-roll a listbox, menu, dialog or tabs.

## Type and spacing scale

The app-screen scale (ratio 1.2 from 16px), in `tokens.css`:

| Token                         | Value                            | Use                        |
| ----------------------------- | -------------------------------- | -------------------------- |
| `--text-xs` / `-sm`           | 0.75 / 0.875rem                  | labels, captions, dense UI |
| `--text-md`                   | 1rem                             | body                       |
| `--text-lg` / `-xl`           | 1.2 / 1.44rem                    | card and section titles    |
| `--text-2xl` / `-3xl`         | 1.728 / 2.074rem                 | page headings              |
| `--space-2xs` … `--space-2xl` | 4 / 8 / 12 / 16 / 24 / 40 / 64px | gaps and padding           |
| control height                | 32px                             | buttons, inputs, toggles   |

## Reference screenshots

<!-- 2–3 screenshots of the app's main screen, light and dark, once it has its look. Add them under .agent/design-examples/ and link them here. -->

## Mood

<!-- One or two sentences: how the product should feel, for example "calm and precise, like a well-kept ledger". -->

## Design review

The Evaluator runs both of impeccable's reviews on every UI ticket, against the running
app, once per screen the ticket changes, in light. Colours are single `light-dark()`
tokens, so a screenshot in dark (`data-color-scheme="dark"` on `<html>`) checks the other
scheme:

- `/impeccable audit <screen>`: accessibility, performance, theming, responsive
  behaviour and anti-patterns, scored out of 20, with P0–P3 findings.
- `/impeccable critique <screen>`: a scored UX review against Nielsen's heuristics, with
  a design-specificity verdict and P0–P3 findings.

The ticket fails if any of these hold:

- a P0 or P1 finding is open in either review;
- the audit scores below 14/20, or the critique below Good (70% of its maximum);
- the critique finds the screen generic: a template any unrelated product could use;
- the screen breaks `apps/web/DESIGN.md` (once it exists): a raw value, or a colour, font or
  control style it doesn't list.

Put both scores and any open P2 findings in the PR review. Critique ends by asking what
to improve next: answer `Questions skipped: Evaluator review`.

## Setting the look (the design ticket)

### Before you start

1. You need the **impeccable** skill (agent-kit's steps are written for v4.11.1). In Rakazo it's
   in the bot's skill list; on your own machine,
   `npx impeccable@4.11.1 install --providers=claude --global --no-hooks` installs it.
   If you don't have it, log a line with `pnpm agent log` saying so and stop. Don't
   improvise a design without it.
2. Read `.agent/BRIEF.md` and `.agent/GOAL.md`. They are the owner's answers to
   impeccable's questions (who it's for, the job, the constraints, the tone): don't ask
   the owner. When impeccable asks, answer from those files and tell it to proceed; it
   labels what it inferred.
3. Start the app: `./.agent/init.sh`.
4. Run impeccable from `apps/web` (`cd apps/web`, or pass `--target apps/web/...`). From
   the repo root it stops to ask which app to use.

### Steps

1. **`/impeccable init`.** It writes `apps/web/PRODUCT.md` from the brief. The
   platform is `web`. Skip its live-mode setup.
2. **`/impeccable shape the main screen`** (`apps/web/src/routes/index.tsx` and its
   feature). It's an app screen (impeccable's Operate mode), not a marketing page:
   tables, forms and controls. impeccable reads agent-kit's neutral starter as an
   existing look; it's a placeholder, so tell it this is a replacement world, not a
   refinement. Shape runs the direction round, a visual world and a
   concept, and returns a brief. Check the brief against `.agent/BRIEF.md` yourself, and
   put it in the PR description.
3. **Build it.** Ask impeccable to build the shaped direction for the main screen. At
   the finish it writes `apps/web/DESIGN.md` from what it built. Hold it to this
   project's constraints; where they conflict, they win over its defaults:
   - **Tokens go in `apps/web/src/styles/tokens.css`**, keeping its names and
     structure: every colour as one `light-dark(<light>, <dark>)` declaration (a
     light-only world needs dark values too); `--color-*: initial` first in
     `@theme static`, so Tailwind's palette stays off; and the project's extra tokens
     (`--color-paper-2/3`, `--color-error-ink`, `--color-control-edge`,
     `--shadow-color`, `--radius-inner`, `--radius-control`, `--weight-*`,
     `--leading-*`). Change values, and add a role only when the world needs one; never
     a second token file.
   - **The primary action's colour is `--color-primary`** (default: the accent). If the
     world's primary button isn't the accent (an ink-filled one, say), set
     `--color-primary: var(--color-ink)` and `--color-primary-ink: var(--color-paper)`.
     Solid buttons (`<Button variant="solid">`), checked boxes and switches follow it.
   - **Styling is Tailwind utilities on the token names.** A look tokens can't express
     (a different control shape, say) goes where `.agent/COMPONENTS.md` says, once, not
     in each page. Never `!important`, never a raw value.
   - **Fonts:** self-host them, never a font CDN link. The simplest way is the
     `@fontsource/<family>` package (pin it in the pnpm catalog) imported per weight in
     `global.css`, for example `@import '@fontsource/epilogue/700.css';`. Record the
     licence in `DECISIONS.md`.
   - **Copy and flows stay as they are.** Labels, headings and roles drive the e2e
     replay cache; restyling must not rename them.
4. **Check it.** While fixing, rerun the cheap detector
   (`npx impeccable@4.11.1 detect apps/web/src`); run the review above once at the end,
   and fix until it passes. Then the repo's hooks: `pnpm exec lefthook run pre-commit --all-files`
   and `pnpm e2e --strict-cache`.
5. **Lock it.** Commit `apps/web/PRODUCT.md`, `apps/web/DESIGN.md`, `tokens.css` (and
   fonts), and impeccable's shared files in `apps/web/.impeccable/` (`.gitignore` keeps
   its runtime files out). Fill in the Mood
   and Reference screenshots above, add a line to `.agent/DECISIONS.md`, and log the run.

Work on a branch (`feat/design`) and open a PR, as for any ticket.
