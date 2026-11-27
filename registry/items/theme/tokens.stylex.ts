import * as stylex from '@stylexjs/stylex';

/*
 * StyleX handles on the design tokens in tokens.css. Every entry is a plain
 * var(--…) pointer (defineVars compiles it straight into each rule), so the
 * values, light/dark and any restyle live in tokens.css alone.
 *
 * This file is the only place where the components' key names are translated to
 * Hallmark's token names (for example space.lg is --space-md); components never
 * use the CSS names directly.
 */
export const colors = stylex.defineVars({
  background: 'var(--color-paper)',
  foreground: 'var(--color-ink)',
  surface: 'var(--color-paper-2)',
  surfaceForeground: 'var(--color-ink)',
  muted: 'var(--color-paper-3)',
  mutedForeground: 'var(--color-muted)',
  border: 'var(--color-rule)',
  input: 'var(--color-rule-2)',
  ring: 'var(--color-focus)',
  accent: 'var(--color-accent)',
  accentHover: 'var(--color-accent-hover)',
  accentForeground: 'var(--color-accent-ink)',
  secondary: 'var(--color-paper-3)',
  secondaryHover: 'var(--color-secondary-hover)',
  secondaryForeground: 'var(--color-ink)',
  danger: 'var(--color-error)',
  dangerHover: 'var(--color-error-hover)',
  dangerForeground: 'var(--color-error-ink)',
  success: 'var(--color-success)',
  overlay: 'var(--color-overlay)',
});

export const fonts = stylex.defineVars({
  sans: 'var(--font-body)',
  mono: 'var(--font-mono)',
});

export const text = stylex.defineVars({
  xs: 'var(--text-xs)',
  sm: 'var(--text-sm)',
  base: 'var(--text-md)',
  lg: 'var(--text-lg)',
  xl: 'var(--text-xl)',
  xxl: 'var(--text-2xl)',
  xxxl: 'var(--text-3xl)',
  lineTight: 'var(--leading-tight)',
  lineNormal: 'var(--leading-normal)',
  weightNormal: 'var(--weight-normal)',
  weightMedium: 'var(--weight-medium)',
  weightSemibold: 'var(--weight-semibold)',
  weightBold: 'var(--weight-bold)',
});

export const space = stylex.defineVars({
  px: 'var(--rule-hair)',
  xxs: 'var(--space-3xs)',
  xs: 'var(--space-2xs)',
  sm: 'var(--space-xs)',
  md: 'var(--space-sm)',
  lg: 'var(--space-md)',
  xl: 'var(--space-lg)',
  xxl: 'var(--space-xl)',
  xxxl: 'var(--space-2xl)',
  control: 'var(--control)',
  controlSm: 'var(--control-sm)',
  controlLg: 'var(--control-lg)',
});

export const radii = stylex.defineVars({
  sm: 'var(--radius-inner)',
  md: 'var(--radius-control)',
  lg: 'var(--radius-card)',
  full: 'var(--radius-pill)',
});

export const shadows = stylex.defineVars({
  sm: 'var(--shadow-card)',
  md: 'var(--shadow-pop)',
  lg: 'var(--shadow-modal)',
});

export const motion = stylex.defineVars({
  fast: 'var(--dur-micro)',
  normal: 'var(--dur-short)',
  ease: 'var(--ease-out)',
});

export const layers = stylex.defineVars({
  popover: 'var(--z-dropdown)',
  dialog: 'var(--z-modal)',
  toast: 'var(--z-toast)',
  tooltip: 'var(--z-tooltip)',
});
