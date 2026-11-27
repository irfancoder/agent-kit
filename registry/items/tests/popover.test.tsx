import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Popover', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => (
        <Popover defaultOpen>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Details</PopoverTitle>
          </PopoverContent>
        </Popover>
      ),
      async () => {
        expect(screen.getByText('Details')).toBeDefined();
      },
    );
  });
});
