// Not from Tailkit: the app's own tomato motif.
export function TomatoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="18" r="12" className="fill-red-500" />
      <path d="M16 6c-2-3-6-3-7-1 3 0 5 1 7 3 2-2 4-3 7-3-1-2-5-2-7 1z" className="fill-emerald-600" />
    </svg>
  );
}
