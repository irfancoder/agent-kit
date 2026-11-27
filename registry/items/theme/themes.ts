import * as stylex from '@stylexjs/stylex';
import { colors, shadows } from './tokens.stylex';

/*
 * Explicit light and dark themes. Without one, the tokens follow the OS
 * setting. Apply a theme to the app root to override it:
 *   <div {...stylex.props(darkTheme)}>
 */
export const lightTheme = stylex.createTheme(colors, {
  background: '#ffffff',
  foreground: '#18181b',
  surface: '#ffffff',
  surfaceForeground: '#18181b',
  muted: '#f4f4f5',
  mutedForeground: '#5f5f6b',
  border: '#e4e4e7',
  input: '#d4d4d8',
  ring: '#4f46e5',
  accent: '#4f46e5',
  accentHover: '#4338ca',
  accentForeground: '#ffffff',
  secondary: '#f4f4f5',
  secondaryHover: '#e4e4e7',
  secondaryForeground: '#18181b',
  danger: '#dc2626',
  dangerHover: '#b91c1c',
  dangerForeground: '#ffffff',
  success: '#15803d',
  overlay: 'rgba(24, 24, 27, 0.4)',
});

export const darkTheme = stylex.createTheme(colors, {
  background: '#0b0b0f',
  foreground: '#f4f4f5',
  surface: '#141418',
  surfaceForeground: '#f4f4f5',
  muted: '#1f1f25',
  mutedForeground: '#a1a1aa',
  border: '#2b2b33',
  input: '#3a3a44',
  ring: '#818cf8',
  accent: '#818cf8',
  accentHover: '#a5b4fc',
  accentForeground: '#0b0b0f',
  secondary: '#26262d',
  secondaryHover: '#30303a',
  secondaryForeground: '#f4f4f5',
  danger: '#f87171',
  dangerHover: '#fca5a5',
  dangerForeground: '#0b0b0f',
  success: '#4ade80',
  overlay: 'rgba(0, 0, 0, 0.6)',
});

export const darkShadows = stylex.createTheme(shadows, {
  sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
  md: '0 4px 12px rgba(0, 0, 0, 0.5), 0 1px 3px rgba(0, 0, 0, 0.4)',
  lg: '0 12px 32px rgba(0, 0, 0, 0.6)',
});

export const lightShadows = stylex.createTheme(shadows, {
  sm: '0 1px 2px rgba(24, 24, 27, 0.06)',
  md: '0 4px 12px rgba(24, 24, 27, 0.08), 0 1px 3px rgba(24, 24, 27, 0.06)',
  lg: '0 12px 32px rgba(24, 24, 27, 0.14)',
});

export type ThemeName = 'light' | 'dark';

/** The styles to spread on the app root for a theme. */
export const themes = {
  light: [lightTheme, lightShadows],
  dark: [darkTheme, darkShadows],
} as const;
