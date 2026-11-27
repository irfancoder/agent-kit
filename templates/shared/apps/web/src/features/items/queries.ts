import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateItem } from '@kitapp/contracts';
import { call } from '@/lib/api.ts';

export const itemsQuery = queryOptions({
  queryKey: ['items'],
  queryFn: () => call('listItems'),
});

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateItem) => call('createItem', { body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsQuery.queryKey }),
  });
}
