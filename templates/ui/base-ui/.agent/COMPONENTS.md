# Components: Base UI

The headless library is [Base UI](https://base-ui.com) (`@base-ui/react`). It handles
behaviour, focus and ARIA, and renders no styles.

- **Use the wrappers.** Pages import from `@/components/ui/*` (button, field, input,
  toggle, toast). Each wrapper styles a Base UI part with Tailwind utilities on the
  token names; the shared classes (`control`, `focusRing`) are in
  `src/components/ui/styles.ts`.
- **A new component:** read its page in `node_modules/@base-ui/react/docs/react/components/`
  (the docs for the installed version), import it from its own entry
  (`@base-ui/react/select`), and add a wrapper in `src/components/ui/` styled the same way.
  Never hand-roll a listbox, menu, dialog or tabs.
- **State** is on data attributes: `data-pressed`, `data-disabled`, `data-invalid`,
  `data-open`, `data-highlighted`. Style them with Tailwind variants
  (`data-pressed:bg-paper-3`). Every state must read at 3:1 against its surroundings.
- **Control height** is `h-8` (32px), set in `styles.ts`.

## For the design language

Every value comes from `tokens.css`, so a new palette, type and radius reach the
components without edits. A look tokens can't express, such as a different control shape
or pressed style, goes in the wrappers' classes in `src/components/ui/`, in one place
(`styles.ts` for what buttons and toggles share). Base UI doesn't set `data-slot`, so
Hallmark's `base.css` slot rules don't touch these components.
