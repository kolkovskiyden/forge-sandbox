// Adapted from Tailkit (free): Application UI → Layouts → Stacked → Light Header and Heading.
// https://tailkit.com/free-tailwind-components — © pixelcave, used under the Tailkit license.
// Changes: navigation, notifications, user dropdown (Headless UI), page heading and footer removed.
import type { ReactNode } from 'react';
import { TomatoIcon } from './TomatoIcon';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      id="page-container"
      className="mx-auto flex min-h-dvh w-full min-w-80 flex-col bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
    >
      <header
        id="page-header"
        className="z-1 flex flex-none items-center bg-white shadow-xs dark:bg-gray-800"
      >
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
          <div className="flex justify-between py-4">
            <span className="inline-flex items-center gap-2 text-lg font-bold tracking-wide text-gray-900 dark:text-gray-100">
              <TomatoIcon className="size-6" />
              <span>Pomodoro tracker</span>
            </span>
          </div>
        </div>
      </header>

      <main id="page-content" className="flex max-w-full flex-auto flex-col">
        <div className="container mx-auto p-4 lg:p-8 xl:max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
