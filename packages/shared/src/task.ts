import { z } from 'zod';
import { ERROR_MESSAGES } from './errors.js';

export const TASK_NAME_MAX_LENGTH = 100;

export const TaskState = z.enum(['open', 'done']);
export type TaskState = z.infer<typeof TaskState>;

export const Task = z.object({
  id: z.uuid(),
  name: z.string(),
  state: TaskState,
  /** UTC epoch milliseconds. */
  createdAt: z.number().int(),
  /** UTC epoch milliseconds. */
  updatedAt: z.number().int(),
  /** Number of Completed Pomodoros on this Task. */
  completedCount: z.number().int().nonnegative(),
});
export type Task = z.infer<typeof Task>;

/** Body of both create and rename; the name rules are applied by `checkTaskName`. */
export const TaskNameBody = z.object({ name: z.string() });
export type TaskNameBody = z.infer<typeof TaskNameBody>;

export const TaskResponse = z.object({ task: Task });
export const TaskListResponse = z.object({ tasks: z.array(Task) });

export type TaskNameCheck =
  | { ok: true; name: string }
  | { ok: false; code: 'name_required' | 'name_too_long'; message: string };

/**
 * Normalizes the name the same way on both sides: Unicode NFC, control characters (newlines,
 * tabs) turned into spaces, zero-width spaces removed, then trimmed.
 */
function normalizeTaskName(raw: string): string {
  return raw
    .normalize('NFC')
    .replace(/\p{Cc}/gu, ' ')
    .replace(/[\u200B\u2060\uFEFF]/g, '')
    .trim();
}

/** Normalizes the name and applies the length rules shared by create and rename. */
export function checkTaskName(raw: string): TaskNameCheck {
  const name = normalizeTaskName(raw);
  // A name made only of invisible characters counts as empty.
  if (name.replace(/[\p{Cf}\s]/gu, '').length === 0) {
    return { ok: false, code: 'name_required', message: ERROR_MESSAGES.name_required };
  }
  // Count characters (code points), not UTF-16 units.
  if ([...name].length > TASK_NAME_MAX_LENGTH) {
    return { ok: false, code: 'name_too_long', message: ERROR_MESSAGES.name_too_long };
  }
  return { ok: true, name };
}

/** Task names are unique among Open Tasks, ignoring letter case. */
export function sameTaskName(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
