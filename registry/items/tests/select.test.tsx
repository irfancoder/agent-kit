import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Select', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => (
        <Select defaultValue="a" items={{ a: 'Apple', b: 'Banana' }}>
          <SelectTrigger aria-label="Fruit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Apple</SelectItem>
            <SelectItem value="b">Banana</SelectItem>
          </SelectContent>
        </Select>
      ),
      async () => {
        expect(screen.getByRole('combobox', { name: 'Fruit' }).textContent).toContain('Apple');
      },
    );
  });
});
