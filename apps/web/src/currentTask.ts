import type { Task } from '@pomodoro/shared';
import { useCallback, useState } from 'react';

const STORAGE_KEY = 'pomodoro.currentTaskId';

function readStoredId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredId(id: string | null): void {
  try {
    if (id === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage unavailable (private mode, blocked site data): the choice lasts for this page only.
  }
}

/** The Current Task id, kept in the browser so it survives reloads and browser restarts. */
export function useCurrentTaskId(): [string | null, (id: string | null) => void] {
  const [id, setId] = useState(readStoredId);
  const update = useCallback((next: string | null) => {
    writeStoredId(next);
    setId(next);
  }, []);
  return [id, update];
}

/** The Current Task is only valid while it is one of the listed Open Tasks. */
export function resolveCurrentTask(openTasks: readonly Task[], id: string | null): Task | null {
  if (id === null) return null;
  return openTasks.find((task) => task.id === id && task.state === 'open') ?? null;
}
