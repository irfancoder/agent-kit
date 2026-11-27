import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Textarea } from '@/components/ui/textarea';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Textarea', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => <Textarea aria-label="Notes" />,
      async () => {
        expect(screen.getByRole('textbox', { name: 'Notes' }).tagName).toBe('TEXTAREA');
      },
    );
  });
});
