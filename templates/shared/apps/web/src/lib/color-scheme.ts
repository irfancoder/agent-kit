import { useSyncExternalStore } from 'react';
import { COLOR_SCHEME_KEY } from './color-scheme-script.ts';

// data-color-scheme on <html>: "system" follows the OS, "light" and "dark" pin it. The
// head script sets it from the saved choice before the first paint; app.css reads it.
export type ColorScheme = 'system' | 'light' | 'dark';

const listeners = new Set<() => void>();
let darkQuery: MediaQueryList | undefined;
const prefersDark = () => (darkQuery ??= window.matchMedia('(prefers-color-scheme: dark)'));

export function setColorScheme(scheme: ColorScheme): void {
  try {
    if (scheme === 'system') localStorage.removeItem(COLOR_SCHEME_KEY);
    else localStorage.setItem(COLOR_SCHEME_KEY, scheme);
  } catch {
    // Storage can be blocked; the choice still applies until the page reloads.
  }
  document.documentElement.dataset.colorScheme = scheme;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  prefersDark().addEventListener('change', listener);
  return () => {
    listeners.delete(listener);
    prefersDark().removeEventListener('change', listener);
  };
}

/** Whether the page shows dark right now: a Dark choice, or System on a dark device. */
export function useIsDark(): boolean {
  return useSyncExternalStore(subscribe, () => {
    const scheme = document.documentElement.dataset.colorScheme;
    return scheme === 'dark' || (scheme !== 'light' && prefersDark().matches);
  });
}
