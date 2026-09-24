import type { Task } from '@pomodoro/shared';
import { describe, expect, it } from 'vitest';
import { resolveCurrentTask } from './currentTask.js';

const task = (id: string, state: Task['state'] = 'open'): Task => ({
  id,
  name: id,
  state,
  createdAt: 0,
  updatedAt: 0,
  completedCount: 0,
});

describe('resolveCurrentTask', () => {
  it('returns the remembered Task while it is Open', () => {
    const picked = task('a');
    expect(resolveCurrentTask([task('b'), picked], 'a')).toBe(picked);
  });

  it('returns no Current Task when the remembered Task is gone or not Open', () => {
    expect(resolveCurrentTask([task('b')], 'a')).toBeNull();
    expect(resolveCurrentTask([task('a', 'done')], 'a')).toBeNull();
    expect(resolveCurrentTask([task('a')], null)).toBeNull();
  });
});
