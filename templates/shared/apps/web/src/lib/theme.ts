import { useCallback, useEffect, useState } from 'react';
import type { ThemeName } from '@/styles/themes';

const STORAGE_KEY = 'kitapp.theme';

function systemTheme(): ThemeName {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/** The current theme: the saved choice, else the OS setting. */
export function useTheme(): [ThemeName, () => void] {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = typeof localStorage === 'undefined' ? null : localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : systemTheme();
  });
  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);
  return [theme, toggle];
}
