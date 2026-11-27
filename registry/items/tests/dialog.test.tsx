import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Dialog', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => (
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Delete item</DialogTitle>
            <DialogDescription>This can't be undone.</DialogDescription>
          </DialogContent>
        </Dialog>
      ),
      async () => {
        expect(screen.getByRole('dialog', { name: 'Delete item' })).toBeDefined();
      },
    );
  });
});
