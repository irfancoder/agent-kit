/** Tables as SQLite stores them. Migrations: ./migrations */
export interface ItemsTable {
  id: string;
  name: string;
  /** ISO 8601 timestamp */
  created_at: string;
}

export interface Database {
  items: ItemsTable;
}
