import { randomUUID } from 'node:crypto';
import { sameTaskName, type Task, type TaskState } from '@pomodoro/shared';
import type { Database } from './db.js';

type TaskRow = {
  id: string;
  name: string;
  state: TaskState;
  created_at: number;
  updated_at: number;
};

const COLUMNS = 'id, name, state, created_at, updated_at';

function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    name: row.name,
    state: row.state,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Pomodoro Records arrive in a later story; until then no Task has any.
    completedCount: 0,
  };
}

export function listOpenTasks(db: Database): Task[] {
  const rows = db
    .prepare(`SELECT ${COLUMNS} FROM tasks WHERE state = 'open' ORDER BY created_at, rowid`)
    .all() as TaskRow[];
  return rows.map(toTask);
}

export function getTask(db: Database, id: string): Task | undefined {
  const row = db.prepare(`SELECT ${COLUMNS} FROM tasks WHERE id = ?`).get(id) as
    | TaskRow
    | undefined;
  return row && toTask(row);
}

/**
 * True when an Open Task other than `exceptId` already has this name, ignoring
 * letter case. Compared in JS so that non-ASCII letters fold too; the partial
 * unique index backs this up for ASCII names.
 */
export function openNameTaken(db: Database, name: string, exceptId?: string): boolean {
  const rows = db.prepare(`SELECT id, name FROM tasks WHERE state = 'open'`).all() as Pick<
    TaskRow,
    'id' | 'name'
  >[];
  return rows.some((row) => row.id !== exceptId && sameTaskName(row.name, name));
}

export function insertTask(db: Database, name: string, now: number): Task {
  const row: TaskRow = { id: randomUUID(), name, state: 'open', created_at: now, updated_at: now };
  db.prepare(
    `INSERT INTO tasks (${COLUMNS}) VALUES (:id, :name, :state, :created_at, :updated_at)`,
  ).run(row);
  return toTask(row);
}

export function renameTask(db: Database, id: string, name: string, now: number): Task | undefined {
  db.prepare('UPDATE tasks SET name = ?, updated_at = ? WHERE id = ?').run(name, now, id);
  return getTask(db, id);
}
