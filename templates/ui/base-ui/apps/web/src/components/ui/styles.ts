// Class lists shared by the controls below. Every value comes from a token utility.
import type { ComponentProps, ElementType } from 'react';

/** A Base UI part's props, with className narrowed to a string so it can be merged. */
export type WithClass<T extends ElementType> = Omit<ComponentProps<T>, 'className'> & {
  className?: string;
};

/** Joins class names, skipping empty ones. */
export function cx(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/** The focus ring: instant, and at 3:1 against the paper. */
export const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

/** Buttons and toggles share one shape. */
export const control = cx(
  'inline-flex h-8 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap',
  'rounded-control border border-control-edge bg-paper px-3 text-sm font-medium text-ink',
  'hover:bg-paper-3 active:bg-paper-3 data-disabled:cursor-not-allowed data-disabled:opacity-50',
  focusRing,
);
