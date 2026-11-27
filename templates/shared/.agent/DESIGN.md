# Design

Read by the Builder and the Evaluator before any UI work.

## Tokens

All styling is StyleX and every value comes from the IRFANCODER tokens. Never
hard-code a colour, size, radius or shadow in a component.

- Token file: `apps/web/src/styles/tokens.stylex.ts` (`stylex.defineVars`)
  - `colors`: background, foreground, surface, muted, border, input, ring, accent, secondary, danger, success, overlay (each with a `*Foreground` / `*Hover` where needed)
  - `fonts`: sans, mono
  - `text`: type scale and weights
  - `space`: 4px grid plus control heights
  - `radii`, `shadows`, `motion`, `layers`
- Themes: `apps/web/src/styles/themes.ts` (`stylex.createTheme`): `light` and `dark`. Without one, tokens follow the OS setting.
- Components: `apps/web/src/components/ui/`, from the IRFANCODER registry. Add more with
  `pnpm --dir apps/web exec shadcn add @irfancoder/<name>`. A component the registry lacks goes into the
  registry (agent-kit/registry), not copied between projects.

## Type and spacing scale

| Token                                                   | Value                            | Use                               |
| ------------------------------------------------------- | -------------------------------- | --------------------------------- |
| `text.xs`                                               | 0.75rem                          | badges, captions                  |
| `text.sm`                                               | 0.875rem                         | body in dense UI, labels, buttons |
| `text.base`                                             | 1rem                             | body                              |
| `text.lg`                                               | 1.2rem                           | card titles                       |
| `text.xl`                                               | 1.44rem                          | section headings                  |
| `text.xxl`                                              | 1.728rem                         | page headings                     |
| `text.xxxl`                                             | 2.074rem                         | hero                              |
| `space.xs` / `sm` / `md` / `lg` / `xl` / `xxl` / `xxxl` | 4 / 8 / 12 / 16 / 24 / 32 / 48px | gaps and padding                  |

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
