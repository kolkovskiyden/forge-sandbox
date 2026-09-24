import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { migrations } from './migrations.js';

export type Database = DatabaseSync;

/** Opens (or creates) the SQLite database and brings its schema up to date. */
export function openDatabase(path: string): Database {
  if (path !== ':memory:') {
    mkdirSync(dirname(path), { recursive: true });
  }
  const db = new DatabaseSync(path);
  // Wait for another process holding the write lock instead of failing at once.
  db.exec('PRAGMA busy_timeout = 5000');
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
  migrate(db);
  return db;
}

export function schemaVersion(db: Database): number {
  const row = db.prepare('PRAGMA user_version').get() as { user_version: number };
  return row.user_version;
}

/**
 * Applies every migration newer than `user_version`, each in its own transaction. The version is
 * read under the write lock, so two processes starting on a new file cannot both apply one.
 */
export function migrate(db: Database): void {
  for (;;) {
    db.exec('BEGIN IMMEDIATE');
    try {
      const version = schemaVersion(db);
      if (version > migrations.length) {
        throw new Error(
          `Database schema version ${version} is newer than this build supports (${migrations.length}). Update the app.`,
        );
      }
      if (version === migrations.length) {
        db.exec('COMMIT');
        return;
      }
      db.exec(migrations[version]!);
      db.exec(`PRAGMA user_version = ${version + 1}`);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }
}

const SQLITE_CONSTRAINT_UNIQUE = 2067;

/** True for a violation of the Open-Task name index, and only that index. */
export function isOpenNameViolation(error: unknown): boolean {
  return (
    error instanceof Error &&
    'errcode' in error &&
    error.errcode === SQLITE_CONSTRAINT_UNIQUE &&
    error.message.includes('tasks_open_name_unique')
  );
}
