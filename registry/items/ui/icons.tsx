import type { ComponentProps } from 'react';

/* Small inline icons used by the components, so the registry needs no icon library. */
type IconProps = ComponentProps<'svg'>;
const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
} as const;

export function CheckIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} {...props}>
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function ChevronDownIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} {...props}>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function XIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...base} {...props}>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
