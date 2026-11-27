import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Label', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => <Label htmlFor="x">Email</Label>,
      async () => {
        expect(screen.getByText('Email').tagName).toBe('LABEL');
      },
    );
  });
});
