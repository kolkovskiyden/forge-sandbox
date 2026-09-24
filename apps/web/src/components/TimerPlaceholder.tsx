// Not from Tailkit: static placeholder for the timer, which arrives in a later story.
import type { Task } from '@pomodoro/shared';

export function TimerPlaceholder({ currentTask }: { currentTask: Task | null }) {
  return (
    <section
      aria-label="Timer"
      className="flex flex-col items-center gap-6 rounded-xl bg-white px-6 py-10 shadow-xs dark:bg-gray-800"
    >
      <div className="relative w-full max-w-sm">
        <svg viewBox="0 0 200 200" className="w-full" aria-hidden="true">
          <circle cx="100" cy="112" r="80" className="fill-red-500" />
          <circle cx="72" cy="80" r="18" className="fill-white/15" />
          <path
            d="M100 36c-10-18-34-20-42-8 16-1 28 4 42 16 14-12 26-17 42-16-8-12-32-10-42 8z"
            className="fill-emerald-600"
          />
          <rect x="96" y="18" width="8" height="22" rx="4" className="fill-emerald-700" />
        </svg>
        <span className="absolute inset-x-0 top-[56%] -translate-y-1/2 text-center text-6xl font-bold tracking-tight text-white tabular-nums sm:text-7xl">
          25:00
        </span>
      </div>
      {currentTask ? (
        <p className="max-w-full text-center text-2xl font-semibold break-words">
          {currentTask.name}
        </p>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Pick a Task or create one to get started.
        </p>
      )}
    </section>
  );
}
