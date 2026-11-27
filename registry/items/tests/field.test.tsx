import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Field', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => (
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input />
          <FieldDescription>We never share it.</FieldDescription>
        </Field>
      ),
      async () => {
        expect(screen.getByRole('textbox', { name: 'Email' })).toBeDefined();
        expect(screen.getByText('We never share it.')).toBeDefined();
      },
    );
  });
});
