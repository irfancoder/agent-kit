/** Tables as D1 (SQLite) stores them. Migrations: apps/api/migrations/*.sql */
export interface ItemsTable {
  id: string;
  name: string;
  /** ISO 8601 timestamp */
  created_at: string;
}

export interface Database {
  items: ItemsTable;
}
