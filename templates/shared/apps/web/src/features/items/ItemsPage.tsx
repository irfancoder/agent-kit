import { useQuery } from '@tanstack/react-query';
import { Button } from '@ui-sdk/react/button';
import { Field, FieldError, FieldLabel } from '@ui-sdk/react/field';
import { Input } from '@ui-sdk/react/input';
import { toast } from '@ui-sdk/react/toast';
import { useState, type FormEvent } from 'react';
import { Card } from '@/components/Card.tsx';
import { EmptyState } from '@/components/EmptyState.tsx';
import { useI18n } from '@/i18n/index.tsx';
import { itemsQuery, useCreateItem } from './queries.ts';

export function ItemsPage() {
  const { t } = useI18n();
  const createItem = useCreateItem();
  const [name, setName] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createItem.mutate(
      { name },
      {
        onSuccess: () => setName(''),
        onError: (error) => toast.error(t('items.createError', { message: error.message })),
      },
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-bold">{t('items.heading')}</h1>

      <form onSubmit={onSubmit} className="flex items-end gap-4">
        <Field name="name" className="grow">
          <FieldLabel>{t('items.nameLabel')}</FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('items.namePlaceholder')}
            required
            maxLength={120}
          />
          <FieldError />
        </Field>
        <Button type="submit" disabled={createItem.isPending} data-variant="solid">
          {createItem.isPending ? t('items.adding') : t('items.add')}
        </Button>
      </form>

      <ItemsList />
    </div>
  );
}

function ItemsList() {
  const { t, tCount } = useI18n();
  const items = useQuery(itemsQuery);

  if (items.isPending) {
    return <output className="text-muted">{t('items.loading')}</output>;
  }
  if (items.isError) {
    return (
      <div role="alert" className="flex items-center gap-4 text-error">
        <p>{t('items.loadError')}</p>
        <Button onClick={() => items.refetch()}>{t('items.retry')}</Button>
      </div>
    );
  }
  if (items.data.items.length === 0) {
    return <EmptyState title={t('items.emptyTitle')} description={t('items.emptyBody')} />;
  }
  return (
    <Card title={tCount('items.count', items.data.items.length)}>
      <ul aria-label={t('items.heading')} className="divide-y divide-rule">
        {items.data.items.map((item) => (
          <li key={item.id} className="py-4">
            {item.name}
          </li>
        ))}
      </ul>
    </Card>
  );
}
