import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Checkbox } from '@/components/ui/checkbox';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Checkbox', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => <Checkbox aria-label="Accept" defaultChecked />,
      async () => {
        expect(screen.getByRole('checkbox', { name: 'Accept' }).getAttribute('aria-checked')).toBe(
          'true',
        );
      },
    );
  });
});
