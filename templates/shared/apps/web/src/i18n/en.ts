/** English messages. The keys here are the source of truth for every locale. */
export const en = {
  'app.title': 'Kit App',
  'nav.items': 'Items',
  'nav.language': 'Language',
  'items.heading': 'Items',
  'items.nameLabel': 'Name',
  'items.namePlaceholder': 'What do you want to add?',
  'items.add': 'Add item',
  'items.adding': 'Adding…',
  'items.loading': 'Loading items…',
  'items.loadError': "We couldn't load your items.",
  'items.retry': 'Try again',
  'items.createError': "We couldn't add that item: {message}",
  'items.emptyTitle': 'No items yet',
  'items.emptyBody': 'Add your first item with the form above.',
  'items.count.one': '{count} item',
  'items.count.other': '{count} items',
  'theme.dark': 'Dark mode',
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
