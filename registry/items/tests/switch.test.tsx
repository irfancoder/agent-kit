import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Switch } from '@/components/ui/switch';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Switch', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => <Switch aria-label="Notifications" />,
      async () => {
        expect(screen.getByRole('switch', { name: 'Notifications' })).toBeDefined();
      },
    );
  });
});
