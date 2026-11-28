# Components: ui-sdk

The headless library is [ui-sdk](https://ui-sdk.dev) (`@ui-sdk/react`, a beta). It
handles behaviour, focus and ARIA, and renders no styles of its own;
`@ui-sdk/core/web.css` gives every component its default look.

- **Use the wrappers.** Pages import from `@/components/ui/*` (button, field, input,
  toggle, toast), which re-export ui-sdk's parts.
- **A new component:** read `node_modules/@ui-sdk/react/docs/llms.txt`, then the
  component's page; ui-sdk's own skill is at
  `node_modules/@ui-sdk/core/skills/ui-sdk/SKILL.md`. Import it from its own entry
  (`@ui-sdk/react/select`) and re-export it from `src/components/ui/`. Never hand-roll a
  listbox, menu, dialog or tabs.
- **Styling:** web.css reads only `--ui-*` variables, which `src/styles/global.css` points
  at the token roles. Restyle a part in `global.css`, in `@layer components`, by its
  `data-slot` and state attributes (`[data-slot="button"][data-pressed]`), never with
  `!important` or generated ids. A solid button is `<Button variant="solid">`.
- **Control height** is `--ui-spacing` × 8 (32px), set by web.css.

## For the design ticket

- Keep the `--ui-*` block in `global.css` pointing at token roles: change what a
  `--ui-*` points at (`--ui-radius: var(--radius-pill)` for a pill theme), never give it
  a raw value.
- If a review flags a missing focus, pressed or disabled state, check the running app
  first: those styles are in web.css, in `node_modules`, where a source scan can't see
  them. Restate a state that's really missing for `[data-slot]` in `global.css`, from the
  tokens.
