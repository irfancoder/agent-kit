import { createFileRoute } from '@tanstack/react-router';
import { ItemsPage } from '@/features/items/ItemsPage.tsx';
import { itemsQuery } from '@/features/items/queries.ts';

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.prefetchQuery(itemsQuery),
  component: ItemsPage,
});
