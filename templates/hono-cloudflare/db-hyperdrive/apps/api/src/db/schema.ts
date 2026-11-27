import type { Generated } from 'kysely';

export interface ItemsTable {
  id: Generated<string>;
  name: string;
  created_at: Generated<Date>;
}

export interface Database {
  items: ItemsTable;
}
