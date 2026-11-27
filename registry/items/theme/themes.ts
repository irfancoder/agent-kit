/*
 * Light and dark come from tokens.css. 'system' (no data-theme) follows the OS;
 * applyTheme pins a theme by setting data-theme on <html>, so portalled popups
 * (dialogs, menus, toasts) follow it too.
 */
export const themeNames = ['light', 'dark'] as const;
export type ThemeName = (typeof themeNames)[number];
export type ThemeChoice = ThemeName | 'system';

export const isThemeName = (value: unknown): value is ThemeName =>
  (themeNames as readonly unknown[]).includes(value);

export function applyTheme(choice: ThemeChoice): void {
  const root = document.documentElement;
  if (choice === 'system') delete root.dataset.theme;
  else root.dataset.theme = choice;
}

/** The theme on screen now: the pinned one, else the OS setting. */
export function effectiveTheme(): ThemeName {
  const pinned = document.documentElement.dataset.theme;
  if (isThemeName(pinned)) return pinned;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
