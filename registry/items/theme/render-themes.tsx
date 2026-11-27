import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { applyTheme, themeNames, type ThemeName } from '@/styles/themes';
import '@/styles/tokens.css';
import '@/styles/tokens.stylex';

/**
 * Renders `ui` under each theme in turn and runs `check` on it, so one test
 * covers light and dark. The theme is pinned on <html>, as the app does, so
 * portalled popups see it too. Each render is unmounted before the next, so
 * `screen` queries see one copy at a time.
 */
export async function forEachTheme(
  ui: () => ReactElement,
  check: (result: RenderResult, theme: ThemeName) => void | Promise<void>,
): Promise<void> {
  for (const theme of themeNames) {
    applyTheme(theme);
    const result = render(ui());
    try {
      await check(result, theme);
    } finally {
      result.unmount();
      applyTheme('system');
    }
  }
}
