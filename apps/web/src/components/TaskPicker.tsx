// Adapted from Tailkit (free): Application UI → Components → List Groups → With Text.
// https://tailkit.com/free-tailwind-components — © pixelcave, used under the Tailkit license.
// Changes: rows are Open Tasks; the row text picks the Task, the right side shows Current and a
// Rename action; a row in rename mode shows the Task name form instead.
import type { Task } from '@pomodoro/shared';
import { useState } from 'react';
import { TaskNameForm } from './TaskNameForm';

type Props = {
  tasks: readonly Task[];
  currentTaskId: string | null;
  onPick: (id: string) => void;
  onRename: (id: string, name: string) => Promise<unknown>;
};

export function TaskPicker({ tasks, currentTaskId, onPick, onRename }: Props) {
  const [renamingId, setRenamingId] = useState<string | null>(null);

  return (
    <ul
      aria-label="Task Picker"
      className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
    >
      {tasks.map((task) => {
        const isCurrent = task.id === currentTaskId;
        if (task.id === renamingId) {
          return (
            <li key={task.id} className="p-4">
              <TaskNameForm
                label={`New name for ${task.name}`}
                submitLabel="Save"
                initialName={task.name}
                autoFocus
                onSubmit={async (name) => {
                  await onRename(task.id, name);
                  // Close this row only; another row may have been opened meanwhile.
                  setRenamingId((open) => (open === task.id ? null : open));
                }}
                onCancel={() => setRenamingId(null)}
              />
            </li>
          );
        }
        return (
          <li
            key={task.id}
            className={`flex items-center justify-between gap-3 p-4 ${isCurrent ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
          >
            <button
              type="button"
              onClick={() => onPick(task.id)}
              aria-current={isCurrent ? 'true' : undefined}
              className="mr-1 min-w-0 grow text-left text-sm font-semibold break-words hover:text-blue-600 dark:hover:text-blue-400"
            >
              {task.name}
            </button>
            <span className="flex flex-none items-center gap-3">
              {isCurrent && (
                <span className="text-sm font-medium text-emerald-500">Current</span>
              )}
              <button
                type="button"
                onClick={() => setRenamingId(task.id)}
                className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                Rename
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
