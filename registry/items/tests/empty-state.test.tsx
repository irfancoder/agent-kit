import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { EmptyState } from '@/components/ui/empty-state';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('EmptyState', () => {
  test('renders title, description and action in both themes', async () => {
    await forEachTheme(
      () => (
        <EmptyState
          title="Nothing here"
          description="Add one"
          action={<button type="button">Add</button>}
        />
      ),
      async () => {
        expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeDefined();
        expect(screen.getByText('Add one')).toBeDefined();
        expect(screen.getByRole('button', { name: 'Add' })).toBeDefined();
      },
    );
  });
});
