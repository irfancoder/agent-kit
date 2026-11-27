import * as stylex from '@stylexjs/stylex';

/*
 * IRFANCODER design tokens: a neutral starter set (greys plus one accent).
 * Swap values here to rebrand. Every component style reads these vars;
 * no component hard-codes a colour, size or radius.
 * Light is the default; dark applies with the OS setting, or explicitly via
 * the themes in themes.ts.
 */
const DARK = '@media (prefers-color-scheme: dark)';

export const colors = stylex.defineVars({
  background: { default: '#ffffff', [DARK]: '#0b0b0f' },
  foreground: { default: '#18181b', [DARK]: '#f4f4f5' },
  surface: { default: '#ffffff', [DARK]: '#141418' },
  surfaceForeground: { default: '#18181b', [DARK]: '#f4f4f5' },
  muted: { default: '#f4f4f5', [DARK]: '#1f1f25' },
  mutedForeground: { default: '#5f5f6b', [DARK]: '#a1a1aa' },
  border: { default: '#e4e4e7', [DARK]: '#2b2b33' },
  input: { default: '#d4d4d8', [DARK]: '#3a3a44' },
  ring: { default: '#4f46e5', [DARK]: '#818cf8' },
  accent: { default: '#4f46e5', [DARK]: '#818cf8' },
  accentHover: { default: '#4338ca', [DARK]: '#a5b4fc' },
  accentForeground: { default: '#ffffff', [DARK]: '#0b0b0f' },
  secondary: { default: '#f4f4f5', [DARK]: '#26262d' },
  secondaryHover: { default: '#e4e4e7', [DARK]: '#30303a' },
  secondaryForeground: { default: '#18181b', [DARK]: '#f4f4f5' },
  danger: { default: '#dc2626', [DARK]: '#f87171' },
  dangerHover: { default: '#b91c1c', [DARK]: '#fca5a5' },
  dangerForeground: { default: '#ffffff', [DARK]: '#0b0b0f' },
  success: { default: '#15803d', [DARK]: '#4ade80' },
  overlay: { default: 'rgba(24, 24, 27, 0.4)', [DARK]: 'rgba(0, 0, 0, 0.6)' },
});

export const fonts = stylex.defineVars({
  sans: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
});

/** Type scale (1.2 ratio from a 16px body). */
export const text = stylex.defineVars({
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.2rem',
  xl: '1.44rem',
  xxl: '1.728rem',
  xxxl: '2.074rem',
  lineTight: '1.25',
  lineNormal: '1.5',
  weightNormal: '400',
  weightMedium: '500',
  weightSemibold: '600',
  weightBold: '700',
});

/** 4px spacing grid. */
export const space = stylex.defineVars({
  px: '1px',
  xxs: '0.125rem',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  xxl: '2rem',
  xxxl: '3rem',
  control: '2.25rem',
  controlSm: '2rem',
  controlLg: '2.5rem',
});

export const radii = stylex.defineVars({
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  full: '9999px',
});

export const shadows = stylex.defineVars({
  sm: { default: '0 1px 2px rgba(24, 24, 27, 0.06)', [DARK]: '0 1px 2px rgba(0, 0, 0, 0.5)' },
  md: {
    default: '0 4px 12px rgba(24, 24, 27, 0.08), 0 1px 3px rgba(24, 24, 27, 0.06)',
    [DARK]: '0 4px 12px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.4)',
  },
  lg: {
    default: '0 12px 32px rgba(24, 24, 27, 0.14)',
    [DARK]: '0 12px 32px rgba(0, 0, 0, 0.6)',
  },
});

export const motion = stylex.defineVars({
  fast: '120ms',
  normal: '200ms',
  ease: 'cubic-bezier(0.2, 0, 0, 1)',
});

export const layers = stylex.defineVars({
  popover: '50',
  dialog: '60',
  toast: '70',
  tooltip: '80',
});
