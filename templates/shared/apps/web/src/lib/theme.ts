import { applyTheme, effectiveTheme, isThemeName, type ThemeChoice } from '@/styles/themes';

const STORAGE_KEY = 'kitapp.theme';

function savedTheme(): ThemeChoice {
  const saved = localStorage.getItem(STORAGE_KEY);
  return isThemeName(saved) ? saved : 'system';
}

/** Applies the saved choice. Called once before the first render, so there is no flash. */
export function initTheme(): void {
  applyTheme(savedTheme());
}

/** Flips between light and dark and remembers the choice. */
export function toggleTheme(): void {
  const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
}
