import * as stylex from '@stylexjs/stylex';
import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { themes, type ThemeName } from '@/styles/themes';
// Loads the token defaults; see the note in src/main.tsx.
import '@/styles/tokens.stylex';

/**
 * Renders `ui` inside each theme in turn and runs `check` on it, so one test
 * covers light and dark. Each render is unmounted before the next, so
 * `screen` queries (including portalled popups) see one copy at a time.
 */
export async function forEachTheme(
  ui: () => ReactElement,
  check: (result: RenderResult, theme: ThemeName) => void | Promise<void>,
): Promise<void> {
  for (const theme of Object.keys(themes) as ThemeName[]) {
    const result = render(<div {...stylex.props(themes[theme])}>{ui()}</div>);
    try {
      await check(result, theme);
    } finally {
      result.unmount();
    }
  }
}
