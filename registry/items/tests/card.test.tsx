import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Card', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>Body</CardContent>
        </Card>
      ),
      async () => {
        expect(screen.getByText('Summary')).toBeDefined();
        expect(screen.getByText('Body')).toBeDefined();
      },
    );
  });
});
