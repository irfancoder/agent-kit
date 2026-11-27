import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Badge', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => <Badge variant="secondary">New</Badge>,
      async () => {
        expect(screen.getByText('New').className).not.toBe('');
      },
    );
  });
});
