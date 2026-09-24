// Not from Tailkit: its Empty States category is not in the free set. Hand-written in the same style.
export function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 bg-white px-4 py-8 text-center dark:border-gray-700 dark:bg-gray-900">
      <p className="font-semibold">No Tasks yet</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Name what you are working on, then pick it to focus on.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
      >
        Create your first Task
      </button>
    </div>
  );
}
