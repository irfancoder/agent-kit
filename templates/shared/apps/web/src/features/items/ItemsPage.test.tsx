import { afterEach, describe, expect, test } from '@rstest/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { I18nProvider } from '@/i18n/index.tsx';
import { ItemsPage } from './ItemsPage.tsx';
import { itemsQuery } from './queries.ts';

function renderWithItems(names: string[]) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, gcTime: Infinity } },
  });
  queryClient.setQueryData(itemsQuery.queryKey, {
    items: names.map((name) => ({
      id: crypto.randomUUID(),
      name,
      createdAt: '2026-01-01T00:00:00.000Z',
    })),
  });
  return render(
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <ItemsPage />
      </QueryClientProvider>
    </I18nProvider>,
  );
}

afterEach(cleanup);

describe('ItemsPage', () => {
  test('names the form controls', () => {
    renderWithItems([]);
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Add item' })).toBeTruthy();
  });

  test('shows the empty state', () => {
    renderWithItems([]);
    expect(screen.getByRole('heading', { name: 'No items yet' })).toBeTruthy();
  });

  test('lists the items', () => {
    renderWithItems(['Rice', 'Sugar']);
    const list = screen.getByRole('list', { name: 'Items' });
    expect(list.querySelectorAll('li')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: '2 items' })).toBeTruthy();
  });
});
