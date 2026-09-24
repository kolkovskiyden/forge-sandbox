---
title: 'FT-4 Create, rename and pick Tasks'
type: 'feature'
created: '2026-09-24'
status: 'done'
baseline_commit: '63e77432f1686fe0657da1977e11ae40dd9b8d02'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/epic/planning-artifacts/decomposition/story-ft-4-task-picker.md'
  - '{project-root}/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repo has no app code. FT-4 is the first story of epic FT-1: it has to deliver a runnable monorepo, durable Task storage, and a main screen where Tasks are created, renamed and picked as the Current Task.

**Approach:** Scaffold the three npm workspaces from epic-ADR1. Build a Hono Task API on `node:sqlite` with migrations, sharing zod schemas through `packages/shared`. Build a React main screen: a static tomato timer placeholder plus the Task Picker, styled with Tailwind and Tailkit components pasted by the author.

## Boundaries & Constraints

**Always:** Follow the ticket's Deliverables 1–8 and its 5 ACs (see the story file in `context`). Follow these epic ADRs:
- epic-ADR1: layout and run topology
- epic-ADR2: Hono, `@hono/zod-validator`, `{ error: { code, message } }`, `app.request()` tests
- epic-ADR3: `node:sqlite`, WAL, foreign keys, `user_version` migrations, epoch-ms UTC, UUID ids, a partial unique index on `lower(name)` WHERE state='open'
- epic-ADR8: TanStack Query, no router, Tailwind via `@tailwindcss/vite`
- epic-ADR9: Vitest

Name rules live once, in `packages/shared`, and both the server and the web app use them. The server listens on `127.0.0.1`, with `PORT` and `DB_PATH` overridable. Error codes are `name_required`, `name_too_long`, `duplicate_name`, `invalid_request` and `not_found`. Tailkit components are the author's pasted source, adapted into `apps/web/src/components/`, with a source note at the top of each file.

**Ask First:** Any runtime dependency beyond hono, @hono/node-server, @hono/zod-validator, zod, react, react-dom and @tanstack/react-query. Any dev dependency beyond typescript, tsx, vite, @vitejs/plugin-react, tailwindcss, @tailwindcss/vite, vitest and concurrently. Any change to a pasted Tailkit component beyond wiring, props and removing assets.

**Never:** Timer behaviour, Breaks, Alerts, marking Tasks Done or reopening them, Tree drawing, Garden, statistics, Settings, or a Zustand store. Also forbidden:
- a router
- another CSS or UI framework
- runtime loading of fonts, scripts, styles or images from any host but the app's own (system font stack only)
- telemetry
- a `pomodoros` table (the completed count is a literal 0)

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Create, trimmed | POST `{name:"  Write tests  "}` | 201, task name "Write tests", state open, completedCount 0 | N/A |
| Create, 100 chars | 100 chars after trimming | 201 | N/A |
| Empty name | `""` or `"   "` | 400 `name_required`; nothing written | Inline message, typed text kept |
| Too long | 101 chars after trimming | 400 `name_too_long` | Inline message, typed text kept |
| Duplicate | Open "FT-1 PRD" exists; `"ft-1 prd"` or `"  FT-1 PRD  "` | 409 `duplicate_name` | Inline message, typed text kept |
| Bad body | missing or non-string `name` | 400 `invalid_request` | — |
| Case-only rename | rename "Refactor" → "REFACTOR" | 200, same id | N/A |
| Rename duplicate | rename to another Open Task's name | 409 `duplicate_name` | Inline message |
| Rename Done Task | Done task (seeded in test) renamed to an Open Task's name | 409; to a Done-only name: 200 | — |
| Unknown id | PATCH `/api/tasks/<unknown>` | 404 `not_found` | — |
| Stale Current Task | stored id not in the Open list | No Current Task; stored id cleared; prompt to pick or create | — |

</frozen-after-approval>

## Code Map

Greenfield: no existing code. Planned structure:

- `package.json` -- root workspaces and scripts `dev`, `build`, `start`, `test`
- `tsconfig.base.json`, `vitest.config.ts` -- shared TS options; one Vitest config over all workspaces, aliasing `@pomodoro/shared` to its source
- `packages/shared/src/task.ts` -- `checkTaskName` (trim, 1..100 characters), `sameTaskName`, `Task`, `TaskNameBody` (create and rename), `TaskResponse`, `TaskListResponse`
- `packages/shared/src/errors.ts` -- `ErrorCode`, `ErrorResponse`, `ERROR_MESSAGES`
- `apps/server/src/db.ts` -- `openDatabase(path)`: pragmas plus migrations; `migrations.ts` holds ordered SQL
- `apps/server/src/tasks.ts` -- task repository (list open, create, rename, find open duplicate)
- `apps/server/src/app.ts` -- `createApp(db)`: `/api/tasks` routes, error mapping, static serving of `apps/web/dist`
- `apps/server/src/main.ts` -- env config, `serve` on 127.0.0.1
- `apps/web/src/api.ts` -- fetch plus zod parse; `ApiError` carrying the error code
- `apps/web/src/currentTask.ts` -- a localStorage-backed Current Task id hook
- `apps/web/src/App.tsx`, `components/*` -- main screen shell, TimerPlaceholder, TaskPicker (list, create form, inline rename), EmptyState

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `tsconfig.base.json`, `.gitignore` -- set up workspaces and scripts. `dev` builds shared, then runs the shared watch, `tsx watch` and Vite concurrently. Ignore `data/`, `dist/` and `node_modules/`.
- [x] `packages/shared/*` -- add the schemas and name rules; build to `dist` with tsc.
- [x] `apps/server/src/db.ts`, `migrations.ts` -- migration 1: the `tasks` table and the partial unique index; each migration runs in its own transaction and bumps `user_version`.
- [x] `apps/server/src/tasks.ts`, `app.ts` -- GET returns Open Tasks ordered by `created_at`. POST validates, checks duplicates and inserts. PATCH `/api/tasks/:id` renames a Task in any state, ignores the Task's own row in the duplicate check, and updates `updated_at`. Map a UNIQUE-constraint error to 409. `app.onError` returns the same error shape.
- [x] `apps/server/src/main.ts` -- default `PORT=3000`, `DB_PATH=./data/pomodoro.sqlite`; create the parent directory.
- [x] `apps/web/*` -- set up Vite with the React and Tailwind plugins and proxy `/api` to 3000. Use QueryClient; invalidate `['tasks']` after mutations. The Current Task is restored from localStorage and validated against the list. Show the empty state when there are no Tasks.
- [x] `apps/web/src/components/*` -- adapt the pasted Tailkit components.
- [x] `packages/shared/src/task.test.ts`, `apps/server/src/app.test.ts` -- cover every row of the I/O Matrix in-process against `:memory:`. Test that migrations are idempotent: reopening the same file applies nothing again.

**Acceptance Criteria:**
- Given a fresh clone, when the author runs `npm install && npm run build && npm start`, then `http://localhost:3000` serves the main screen and the API from one origin, and `curl http://<LAN-IP>:3000` fails.
- Given Tasks exist, when the server is restarted, then the Task Picker lists them unchanged and `user_version` stays at 1.
- Given a Current Task, when it is renamed, then the Task Picker and main screen show the new name without a reload, and it stays the Current Task.

## Design Notes

Tailkit free components, chosen with the author on 2026-09-24. The React versions are copied from tailkit.com/free-tailwind-components; all are Application UI.
- Layouts → Stacked → Light Header and Heading: the page shell. The mobile menu and its JS are removed, since there is no navigation yet.
- Form Layouts → Inline: the create form, and the rename form inside a row.
- Form Elements → Inputs, error variant: the inline name-rule messages.
- List Groups → With Text: the Task Picker rows. A row click picks the Task; each row has a Rename action.
- Form Actions → With Link: Save and Cancel in rename mode.
- Dividers → With Heading: the "Tasks" heading.

Empty States is a paid Tailkit category. The empty state is therefore hand-written Tailwind in the same style, marked as not from Tailkit.

The tomato placeholder is inline SVG plus the static text `25:00`. There are no controls.

Decisions made during implementation:
- The free Form Actions → With Link is a card with a link, not a pair of form buttons. Rename mode borrows only its link style for Cancel; Save is the Inline layout's button. The free Inputs component has no error variant, so the error state swaps its blue focus classes for red.
- The case-insensitive duplicate check runs in JS (`toLowerCase`), so Cyrillic and other non-ASCII names fold too. SQLite's `lower()` in the partial unique index folds ASCII only and is the database backstop.
- An extra error code, `internal_error` (500), keeps unexpected failures in the one error shape. Malformed JSON maps to `invalid_request`.
- Tasks created or renamed in the UI are written into the TanStack Query cache at once, then refetched.
- The author approved these dev dependencies on 2026-09-24: `@types/node` (pinned to 22 to match the runtime), `@types/react` and `@types/react-dom`.
- Installed versions: TypeScript 7, Vitest 5, Vite 8, Tailwind 4, zod 4, Hono 4, React 19.

## Verification

**Commands:**
- `npm test` -- expected: all pass
- `npm run build` -- expected: exit 0
- `npm start` and then `curl -s localhost:3000/api/tasks` -- expected: `{"tasks":[...]}`

**Manual checks:**
- In Playwright or the browser, the network log shows only `localhost:3000`. The Current Task survives a reload.

## Suggested Review Order

**Name rules and the one contract**

- Start here: one normalize-and-check used by the server and the web form.
  [`task.ts:46`](../../../packages/shared/src/task.ts#L46)

- NFC, control characters to spaces, zero-width spaces dropped, then trimmed.
  [`task.ts:37`](../../../packages/shared/src/task.ts#L37)

- The single error shape every API failure uses.
  [`errors.ts:14`](../../../packages/shared/src/errors.ts#L14)

**Task API**

- Routes, guards and error mapping in one factory, testable with `app.request()`.
  [`app.ts:29`](../../../apps/server/src/app.ts#L29)

- Rename accepts any state; duplicates are checked only against Open Tasks.
  [`app.ts:46`](../../../apps/server/src/app.ts#L46)

- A Host check blocks DNS-rebinding pages from a loopback-only server.
  [`app.ts:23`](../../../apps/server/src/app.ts#L23)

- Hono and SQLite errors mapped into the shape, keeping their real status.
  [`app.ts:82`](../../../apps/server/src/app.ts#L82)

- The case-insensitive duplicate check runs in JS, so non-ASCII names fold too.
  [`tasks.ts:46`](../../../apps/server/src/tasks.ts#L46)

**Storage and migrations**

- `BEGIN IMMEDIATE` plus a re-read version: safe with two processes, refuses newer schemas.
  [`db.ts:31`](../../../apps/server/src/db.ts#L31)

- A partial unique index backs up the Open-name rule in the database.
  [`migrations.ts:15`](../../../apps/server/src/migrations.ts#L15)

- A narrow match, so future unique indexes won't read as a duplicate name.
  [`db.ts:58`](../../../apps/server/src/db.ts#L58)

**Run topology**

- Validated `PORT` and `DB_PATH`, loopback bind, clear port-in-use exit.
  [`main.ts:17`](../../../apps/server/src/main.ts#L17)

- Dev builds shared first, then runs the three watchers together.
  [`package.json:14`](../../../package.json#L14)

**Web client**

- Every failure becomes a readable message; no raw Zod dumps reach the form.
  [`api.ts:22`](../../../apps/web/src/api.ts#L22)

- The cache updates only after the first load, so a saved Current Task survives.
  [`App.tsx:31`](../../../apps/web/src/App.tsx#L31)

- A stale Current Task is cleared only once the Open list is known.
  [`App.tsx:25`](../../../apps/web/src/App.tsx#L25)

- The Current Task rule, kept pure for testing.
  [`currentTask.ts:34`](../../../apps/web/src/currentTask.ts#L34)

- The form keeps typed text on error and shows the shared rule's message.
  [`TaskNameForm.tsx:44`](../../../apps/web/src/components/TaskNameForm.tsx#L44)

- Closes only its own row when a slow rename finishes.
  [`TaskPicker.tsx:37`](../../../apps/web/src/components/TaskPicker.tsx#L37)

**Tests**

- Rename cases: case-only change, duplicate, Done Task, unknown id.
  [`app.test.ts:81`](../../../apps/server/src/app.test.ts#L81)

- Guards: Host, body size, look-alike names, and the static fallback.
  [`app.test.ts:211`](../../../apps/server/src/app.test.ts#L211)
