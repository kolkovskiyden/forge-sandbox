import type { Task } from '@pomodoro/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { createTask, fetchTasks, renameTask, tasksQueryKey } from './api';
import { AppShell } from './components/AppShell';
import { EmptyState } from './components/EmptyState';
import { SectionHeading } from './components/SectionHeading';
import { TaskNameForm } from './components/TaskNameForm';
import { TaskPicker } from './components/TaskPicker';
import { TimerPlaceholder } from './components/TimerPlaceholder';
import { resolveCurrentTask, useCurrentTaskId } from './currentTask';

export function App() {
  const queryClient = useQueryClient();
  // Keep retrying while the server is unreachable; the list is useless without it.
  const tasksQuery = useQuery({ queryKey: tasksQueryKey, queryFn: fetchTasks, retry: true });
  const [currentTaskId, setCurrentTaskId] = useCurrentTaskId();
  const createInputRef = useRef<HTMLInputElement>(null);

  const tasks = tasksQuery.data;
  const currentTask = tasks ? resolveCurrentTask(tasks, currentTaskId) : null;

  // Forget a remembered Task that no longer exists or is not Open. Only once the list has
  // loaded, so an unreachable server does not wipe the choice.
  useEffect(() => {
    if (tasks && currentTaskId !== null && !currentTask) setCurrentTaskId(null);
  }, [tasks, currentTaskId, currentTask, setCurrentTaskId]);

  // Show a created or renamed Task at once. Before the first list has loaded there is nothing to
  // update: seeding the cache with a partial list would look like a loaded one.
  const putInCache = (task: Task) =>
    queryClient.setQueryData<Task[]>(tasksQueryKey, (old) =>
      old === undefined
        ? undefined
        : old.some((t) => t.id === task.id)
          ? old.map((t) => (t.id === task.id ? task : t))
          : [...old, task],
    );

  const create = useMutation({
    mutationFn: createTask,
    onSuccess: putInCache,
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
  });
  const rename = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => renameTask(id, name),
    onSuccess: putInCache,
    onSettled: () => queryClient.invalidateQueries({ queryKey: tasksQueryKey }),
  });

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="lg:col-span-3">
          <TimerPlaceholder currentTask={currentTask} />
        </div>

        <section aria-label="Tasks" className="lg:col-span-2">
          <SectionHeading title="Tasks" />
          <div className="space-y-4">
            <TaskNameForm
              label="New Task name"
              submitLabel="Add"
              resetOnSuccess
              inputRef={createInputRef}
              onSubmit={(name) => create.mutateAsync(name)}
            />
            {!tasks && tasksQuery.failureCount === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading Tasks…</p>
            )}
            {!tasks && tasksQuery.failureCount > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Can't reach the server. Trying again…
              </p>
            )}
            {tasks && tasks.length === 0 && (
              <EmptyState onCreate={() => createInputRef.current?.focus()} />
            )}
            {tasks && tasks.length > 0 && (
              <TaskPicker
                tasks={tasks}
                currentTaskId={currentTask?.id ?? null}
                onPick={setCurrentTaskId}
                onRename={(id, name) => rename.mutateAsync({ id, name })}
              />
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
