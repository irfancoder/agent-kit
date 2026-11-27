import { afterEach, describe, expect, test } from '@rstest/core';
import { cleanup, screen } from '@testing-library/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { forEachTheme } from '@/test/render-themes';

afterEach(cleanup);

describe('Tabs', () => {
  test('renders in both themes', async () => {
    await forEachTheme(
      () => (
        <Tabs defaultValue="one">
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
          </TabsList>
          <TabsContent value="one">First panel</TabsContent>
          <TabsContent value="two">Second panel</TabsContent>
        </Tabs>
      ),
      async () => {
        expect(screen.getByRole('tab', { name: 'One' }).getAttribute('aria-selected')).toBe('true');
        expect(screen.getByText('First panel')).toBeDefined();
      },
    );
  });
});
