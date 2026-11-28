# Components: Base UI

The headless library is [Base UI](https://base-ui.com) (`@base-ui/react`). It handles
behaviour, focus and ARIA, and renders no styles.

- **Use the wrappers.** Pages import from `@/components/ui/*`: one file per Base UI
  component (accordion, alert-dialog, autocomplete, avatar, button, checkbox,
  checkbox-group, collapsible, combobox, context-menu, dialog, drawer, field, fieldset,
  form, input, menu, menubar, meter, navigation-menu, number-field, otp-field, popover,
  preview-card, progress, radio-group, scroll-area, select, separator, slider, switch,
  tabs, toast, toggle, toolbar, tooltip). Each wrapper styles a Base UI part with
  Tailwind utilities on the token names and takes a `className` that wins over its
  defaults. Popups (dialog, popover, menu, select) already include their Portal and
  Positioner.
- **Shared classes** are in `src/components/ui/styles.ts`, which holds everything two or
  more wrappers share; wrappers don't import from each other except to re-export a part.
  It has `cn` (joins classes and resolves Tailwind conflicts; it's shadcn's
  [`cn`](https://github.com/shadcn-ui/cn)); the shapes `control` (buttons, toggles,
  triggers), `ghostControl` (the same without border or background), `inputBox`, `box`
  (checkbox and radio) and `listItem`; the panels `surface`, `popupMotion`, `popup`,
  `menuPopup`, `list`, `groupLabel`, `separator` and the `modal*` classes; the text
  `label`, `valueText`, `barGrid` and `barValue`; the states `focusRing`,
  `focusWithinRing` and `disabled`; and the types `WithClass`, `IconOnly` and `Placement`.
  Shared icons are in `icons.tsx`: `ChevronIcon`, `CheckIcon`, `XIcon`, `MinusIcon`,
  `PlusIcon` and `SubmenuIcon`. Merge classes with `cn`, never with template strings.
- **Labels:** wrappers hold no text. Icon-only parts (a dialog's ×, a stepper, a
  combobox's trigger) take an `aria-label` from the page, from the i18n messages.
- **A part that isn't wrapped:** read its page in `node_modules/@base-ui/react/docs/react/components/`
  (the docs for the installed version), import it from its own entry
  (`@base-ui/react/select`), and style it the same way, with the shared classes. Never
  hand-roll a listbox, menu, dialog or tabs.
- **State** is on data attributes: `data-pressed`, `data-disabled`, `data-invalid`,
  `data-open`, `data-highlighted`, `data-checked`, `data-popup-open`. Style them with Tailwind variants
  (`data-pressed:bg-paper-3`). Every state must read at 3:1 against its surroundings.
- **Control height** is `h-8` (32px), set in `styles.ts` by `ghostControl`, `inputBox` and
  `listItem`. The number-field group, OTP slots and slider repeat it to line up with them.

## For the design ticket

Every value comes from `tokens.css`, so a new palette, type and radius reach the
components without edits. A look tokens can't express, such as a different control shape
or pressed style, goes in the wrappers' classes in `src/components/ui/`, in one place
(`styles.ts` for what several components share).
