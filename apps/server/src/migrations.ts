/**
 * Numbered schema migrations. Migration N is `migrations[N - 1]`; the database's
 * `PRAGMA user_version` holds the number of the last one applied. Append only.
 */
export const migrations: readonly string[] = [
  // 1: tasks. Names are unique among Open Tasks, ignoring letter case.
  `
  CREATE TABLE tasks (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    state      TEXT NOT NULL CHECK (state IN ('open', 'done')),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE UNIQUE INDEX tasks_open_name_unique ON tasks (lower(name)) WHERE state = 'open';
  `,
];
