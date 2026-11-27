-- Migration number: 0001 	 items
CREATE TABLE items (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX items_created_at ON items (created_at DESC);
