import type { ReactNode } from 'react';
import { cn } from './styles.ts';

// Small inline icons the wrappers share. Each is hidden from screen readers; the control
// around it carries the name.

type IconProps = {
  /** Size and colour; the default size is 16px. */
  className?: string;
  /** Line weight, in 16ths of the icon's size. Defaults to 1.5. */
  strokeWidth?: number;
};

const base = 'size-4 shrink-0';

/** A 16 × 16 line icon drawn in the text colour. */
function LineIcon({ className, strokeWidth = 1.5, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ? cn(base, className) : base}
    >
      {children}
    </svg>
  );
}

/** Points down. Rotate it with className for open states. */
export function ChevronIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <path d="m4 6 4 4 4-4" />
    </LineIcon>
  );
}

/** A check mark, for selected options and checked boxes. */
export function CheckIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <path d="m3 8.5 3.5 3.5 6.5-8" />
    </LineIcon>
  );
}

/** A cross, for close and clear buttons. */
export function XIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <path d="m4 4 8 8m0-8-8 8" />
    </LineIcon>
  );
}

/** A dash: a decrement button, or a partly checked box. */
export function MinusIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <path d="M3 8h10" />
    </LineIcon>
  );
}

/** A plus sign, for an increment button. */
export function PlusIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <path d="M3 8h10M8 3v10" />
    </LineIcon>
  );
}

/** A solid triangle pointing to the end of the line, for a submenu. It flips in right-to-left text. */
export function SubmenuIcon({ className }: Pick<IconProps, 'className'>) {
  const classes = 'size-4 shrink-0 rtl:-scale-x-100';
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className ? cn(classes, className) : classes}
    >
      <path d="M6 12V4l4.5 4z" />
    </svg>
  );
}
