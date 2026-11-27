// Class lists and types the wrappers share. Every value comes from a token utility.
import type { Popover } from '@base-ui/react/popover';
import { createCn } from 'cn/config';
import type { ComponentProps, ElementType } from 'react';

/** A Base UI part's props, with className narrowed to a string so it can be merged. */
export type WithClass<T extends ElementType> = Omit<ComponentProps<T>, 'className'> & {
  className?: string;
};

/** A part that shows only an icon, so the page must name it. */
export type IconOnly<T extends ElementType> = WithClass<T> & { 'aria-label': string };

/** Where a panel sits against its trigger. Base UI flips it when there's no room. */
export type Placement = Pick<
  Popover.Positioner.Props,
  'side' | 'align' | 'sideOffset' | 'alignOffset' | 'collisionPadding'
>;

/**
 * Joins class names (strings, conditionals, objects) and resolves Tailwind conflicts, so a
 * className passed to a wrapper wins over its defaults: cn('px-3', 'px-4') is 'px-4'.
 * The theme lists the token names cn can't tell apart from other utilities on its own
 * (see tokens.css): keep them in step when the design language renames a radius or shadow.
 */
export const cn = createCn({
  extend: {
    theme: {
      radius: ['card', 'control', 'inner', 'pill'],
      shadow: ['card', 'modal', 'pop'],
    },
  },
});

/** The focus ring: instant, and at 3:1 against the paper. */
export const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

/** The focus ring on a box, drawn while a control inside it has keyboard focus. */
export const focusWithinRing =
  'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus';

/** A disabled part: faded, with a not-allowed cursor. */
export const disabled = 'data-disabled:cursor-not-allowed data-disabled:opacity-50';

/** A button's shape with no border or background: menubar and tab triggers, toolbar buttons. */
export const ghostControl = cn(
  'inline-flex h-8 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap',
  'rounded-control px-3 text-sm font-medium text-ink',
  'hover:bg-paper-3 active:bg-paper-3 data-popup-open:bg-paper-3',
  disabled,
  focusRing,
);

/** Buttons, toggles and triggers: the ghost shape with a border and background. */
export const control = cn(ghostControl, 'border border-control-edge bg-paper');

/** The box every text input shares: Input, Select, Combobox, NumberField and OTP slots. */
export const inputBox = cn(
  'h-8 rounded-control border border-control-edge bg-paper px-2.5 text-sm text-ink placeholder:text-muted',
  'data-invalid:border-error',
  disabled,
);

/** The box of a Checkbox and a Radio. Each adds its own corners. */
export const box = cn(
  'inline-flex size-4 shrink-0 cursor-pointer items-center justify-center',
  'border border-control-edge bg-paper text-primary-ink',
  'transition-colors duration-(--dur-micro) ease-(--ease-out) motion-reduce:transition-none',
  'data-checked:border-primary data-checked:bg-primary data-invalid:border-error',
  disabled,
  focusRing,
);

/** A control's name: field, select, combobox, slider, meter and progress labels. */
export const label = 'text-sm font-medium text-ink';

/** A number shown beside a control, such as a slider's or a meter's value. */
export const valueText = 'text-sm text-muted tabular-nums';

/** Meter and Progress: a label and value on one line, with the bar below. */
export const barGrid = 'grid w-full grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1.5';

/** The value in a barGrid, at the end of the first line. */
export const barValue = cn(valueText, 'col-start-2 text-right');

/** The chevron that turns when an accordion or collapsible section opens. */
export const disclosureChevron = cn(
  'text-muted transition-transform duration-(--dur-short) ease-(--ease-out)',
  'group-data-panel-open:rotate-180 motion-reduce:transition-none',
);

/** The look of a floating panel: popups, tooltips and toasts. */
export const surface = 'rounded-card border border-rule bg-paper-2 text-ink shadow-pop';

/** How a floating panel opens and closes: it scales and fades from its trigger. */
export const popupMotion = cn(
  'origin-(--transform-origin) transition duration-(--dur-short) ease-(--ease-out) motion-reduce:transition-none',
  'data-starting-style:scale-95 data-starting-style:opacity-0',
  'data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none',
);

/** A panel anchored to its trigger: popovers, menus, selects, comboboxes and preview cards. */
export const popup = cn(
  surface,
  popupMotion,
  'max-h-(--available-height) overflow-y-auto text-sm outline-none',
);

/** The panel of a menu and a context menu. */
export const menuPopup = cn(popup, 'min-w-40 p-1');

/** The scrolling list inside a popup. */
export const list = 'overflow-y-auto overscroll-contain p-1 scroll-py-1 outline-none';

/**
 * One row in a menu or a list of options. The highlighted row inverts, so it reads at 3:1;
 * a row whose submenu is open stays shaded.
 */
export const listItem = cn(
  'flex h-8 cursor-default select-none items-center gap-2 rounded-inner px-2 text-sm text-ink outline-none',
  'data-highlighted:bg-ink data-highlighted:text-paper data-popup-open:bg-paper-3',
  disabled,
);

/** A heading over a group of options or menu rows. */
export const groupLabel = 'px-2 pt-2 pb-1 text-xs font-medium text-muted';

/** A line between groups of options or menu rows. */
export const separator = 'mx-1 my-1 h-px bg-rule';

/** The dimmed layer behind a dialog, alert dialog or drawer. */
export const modalBackdrop = cn(
  'fixed inset-0 z-(--z-modal) bg-overlay transition-opacity duration-(--dur-short) ease-(--ease-out)',
  'data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none',
);

/** The layer that centres a dialog or an alert dialog in the window. */
export const modalViewport = 'fixed inset-0 z-(--z-modal) flex items-center justify-center p-4';

/** The panel of a dialog or an alert dialog: it fades and scales in. */
export const modalPopup = cn(
  popupMotion,
  'relative flex max-h-full w-full max-w-md flex-col gap-4 overflow-y-auto',
  'rounded-card border border-rule bg-paper p-6 text-ink shadow-modal outline-none',
);

/** An icon-only close button in the top corner of a dialog or a drawer. */
export const closeIcon = cn(
  'absolute top-3 right-3 inline-flex size-8 cursor-pointer items-center justify-center',
  'rounded-control text-muted hover:bg-paper-3 hover:text-ink',
  focusRing,
);
