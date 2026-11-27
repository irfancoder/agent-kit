# Design

Read by the Builder and the Evaluator before any UI work.

## Design language

The project starts with agent-kit's neutral look. Its own design language is set once,
by the **design-language** skill (`.claude/skills/design-language`), which runs
[Hallmark](https://github.com/nutlope/hallmark) and locks the result in `DESIGN.md` at
the repo root. The Planner makes that the first ticket, before any UI feature.

- Once `DESIGN.md` exists at the root it is the rule: every UI ticket follows it.
- Values live in `apps/web/src/styles/tokens.css`, in Hallmark's token names. They are
  Tailwind utilities (`bg-paper`, `text-ink`, `rounded-card`); Tailwind's own palette is
  off. Nothing hard-codes a colour, size, radius or shadow.
- Components: [ui-sdk](https://ui-sdk.dev), imported per component
  (`@ui-sdk/react/select`), styled by `@ui-sdk/core/web.css` through the `--ui-*` tokens.
  Look a component up in `node_modules/@ui-sdk/react/docs/llms.txt` before building one;
  never hand-roll a listbox, menu, dialog or tabs.

## Type and spacing scale

Hallmark's app-screen scale (ratio 1.2 from 16px), in `tokens.css`:

| Token                         | Value                            | Use                        |
| ----------------------------- | -------------------------------- | -------------------------- |
| `--text-xs` / `-sm`           | 0.75 / 0.875rem                  | labels, captions, dense UI |
| `--text-md`                   | 1rem                             | body                       |
| `--text-lg` / `-xl`           | 1.2 / 1.44rem                    | card and section titles    |
| `--text-2xl` / `-3xl`         | 1.728 / 2.074rem                 | page headings              |
| `--space-2xs` … `--space-2xl` | 4 / 8 / 12 / 16 / 24 / 40 / 64px | gaps and padding           |
| `--ui-spacing` × 8            | 32px                             | control heights (web.css)  |

## Reference screenshots

<!-- 2–3 screenshots of products whose feel this project should match. Add them under .agent/design-examples/ and link them here. -->

## Mood

<!-- One or two sentences: how the product should feel, for example "calm and precise, like a well-kept ledger". -->

## Design rubric

The Evaluator scores each criterion from 1 to 10. A score below 7 on any criterion fails the ticket.

| Criterion      | What a high score means                                                    |
| -------------- | -------------------------------------------------------------------------- |
| Design quality | The screen reads as one coherent whole, with a clear mood.                 |
| Originality    | Deliberate choices, not template defaults or generic "AI-looking" layouts. |
| Craft          | Typography, spacing and contrast follow the design tokens.                 |
| Functionality  | A user can understand the screen and complete the task without help.       |

Scored examples: `.agent/design-examples/` (3–4 screenshots with their scores, added once real ones exist).
