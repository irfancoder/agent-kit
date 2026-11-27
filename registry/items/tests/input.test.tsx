import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Input } from '@/components/ui/input';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Input', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => <Input aria-label="Email" placeholder="you@example.test" />,
      async () => {
        const el = screen.getByRole('textbox', { name: 'Email' });
        expect(el.className).not.toBe('');
      },
    );
  });
});
