import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Button', () => {
  test('renders in both themes with StyleX classes', async () => {
    await forEachTheme(
      () => <Button variant="outline">Save</Button>,
      async () => {
        const button = screen.getByRole('button', { name: 'Save' });
        expect(button.className).not.toBe('');
      },
    );
  });

  test('disabled buttons are disabled', async () => {
    await forEachTheme(
      () => <Button disabled>Save</Button>,
      () => {
        expect(screen.getByRole('button', { name: 'Save' })).toHaveProperty('disabled', true);
      },
    );
  });
});
