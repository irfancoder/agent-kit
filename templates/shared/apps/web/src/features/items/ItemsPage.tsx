import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { useI18n } from '@/i18n/index.tsx';
import { colors, space, text } from '@/styles/tokens.stylex';
import { itemsQuery, useCreateItem } from './queries.ts';

export function ItemsPage() {
  const { t } = useI18n();
  const toast = useToast();
  const createItem = useCreateItem();
  const [name, setName] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createItem.mutate(
      { name },
      {
        onSuccess: () => setName(''),
        onError: (error) =>
          toast.add({ title: t('items.createError', { message: error.message }), type: 'error' }),
      },
    );
  };

  return (
    <div {...stylex.props(styles.page)}>
      <h1 {...stylex.props(styles.heading)}>{t('items.heading')}</h1>

      <form onSubmit={onSubmit} {...stylex.props(styles.form)}>
        <Field xstyle={styles.grow}>
          <FieldLabel>{t('items.nameLabel')}</FieldLabel>
          <Input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('items.namePlaceholder')}
            required
            maxLength={120}
          />
          <FieldError />
        </Field>
        <Button type="submit" disabled={createItem.isPending} xstyle={styles.submit}>
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
    return <output {...stylex.props(styles.muted)}>{t('items.loading')}</output>;
  }
  if (items.isError) {
    return (
      <div role="alert" {...stylex.props(styles.error)}>
        <p>{t('items.loadError')}</p>
        <Button variant="outline" onClick={() => items.refetch()}>
          {t('items.retry')}
        </Button>
      </div>
    );
  }
  if (items.data.items.length === 0) {
    return <EmptyState title={t('items.emptyTitle')} description={t('items.emptyBody')} />;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tCount('items.count', items.data.items.length)}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul aria-label={t('items.heading')} {...stylex.props(styles.list)}>
          {items.data.items.map((item) => (
            <li key={item.id} {...stylex.props(styles.item)}>
              {item.name}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

const styles = stylex.create({
  page: { display: 'flex', flexDirection: 'column', gap: space.xl },
  heading: { margin: 0, fontSize: text.xxl, fontWeight: text.weightBold },
  form: { display: 'flex', alignItems: 'flex-start', gap: space.md },
  grow: { flexGrow: 1 },
  submit: { marginTop: '1.625rem' },
  muted: { color: colors.mutedForeground },
  error: { display: 'flex', alignItems: 'center', gap: space.md, color: colors.danger },
  list: { margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' },
  item: {
    paddingBlock: space.md,
    borderBottomWidth: { default: space.px, ':last-child': 0 },
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border,
  },
});
