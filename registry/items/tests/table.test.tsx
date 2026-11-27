import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Table', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ada</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
      async () => {
        expect(screen.getByRole('columnheader', { name: 'Name' })).toBeDefined();
        expect(screen.getByRole('cell', { name: 'Ada' })).toBeDefined();
      },
    );
  });
});
