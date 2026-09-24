// Adapted from Tailkit (free): Application UI → Components → Form Layouts → Inline,
// with the text input of Form Elements → Inputs and the link of Form Actions → With Link.
// https://tailkit.com/free-tailwind-components — © pixelcave, used under the Tailkit license.
// Changes: one field, an error state (blue focus colours swapped for red) with an inline message,
// and an optional Cancel link.
import { checkTaskName } from '@pomodoro/shared';
import { useId, useState, type FormEvent, type Ref } from 'react';

type Props = {
  label: string;
  submitLabel: string;
  initialName?: string;
  /** Saves the trimmed name; throws with a user-facing message when the server rejects it. */
  onSubmit: (name: string) => Promise<unknown>;
  /** Clear the field after a successful submit (create), rather than keeping it (rename). */
  resetOnSuccess?: boolean;
  onCancel?: () => void;
  inputRef?: Ref<HTMLInputElement>;
  autoFocus?: boolean;
};

const inputBase =
  'block w-full rounded-lg border px-3 py-2 leading-6 placeholder-gray-500 focus:ring-3 dark:bg-gray-800 dark:placeholder-gray-400';
const inputNormal =
  'border-gray-200 focus:border-blue-500 focus:ring-blue-500/50 dark:border-gray-600 dark:focus:border-blue-500';
const inputError =
  'border-red-500 focus:border-red-500 focus:ring-red-500/50 dark:border-red-500 dark:focus:border-red-500';

export function TaskNameForm({
  label,
  submitLabel,
  initialName = '',
  onSubmit,
  resetOnSuccess = false,
  onCancel,
  inputRef,
  autoFocus,
}: Props) {
  const id = useId();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (pending) return;
    const check = checkTaskName(name);
    if (!check.ok) {
      setError(check.message);
      return;
    }
    setPending(true);
    try {
      await onSubmit(check.name);
      setError(null);
      if (resetOnSuccess) setName('');
    } catch (err) {
      // Keep what was typed so it can be corrected.
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full dark:text-gray-100">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        <div className="grow">
          <label htmlFor={id} className="sr-only">
            {label}
          </label>
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && onCancel && !pending) onCancel();
            }}
            placeholder={label}
            autoFocus={autoFocus}
            autoComplete="off"
            aria-invalid={error !== null}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`${inputBase} ${error ? inputError : inputNormal}`}
          />
        </div>
        <div className="flex flex-none items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-700 px-4 py-2 leading-6 font-semibold text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring-3 focus:ring-blue-400/50 active:border-blue-700 active:bg-blue-700 disabled:opacity-60 dark:focus:ring-blue-400/90"
          >
            {submitLabel}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={pending}
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-400 disabled:opacity-60 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
