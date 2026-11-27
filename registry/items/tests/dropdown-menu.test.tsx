import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('DropdownMenu', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => (
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Rename</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      async () => {
        expect(screen.getByRole('menuitem', { name: 'Rename' })).toBeDefined();
      },
    );
  });
});
