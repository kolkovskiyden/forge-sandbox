---
id: "ft-4-task-picker"
title: "Create, rename and pick Tasks"
kind: pbi
type: "Story"
status: "published"
parent_kind: "epic"
parent_tracker_id: ""
parent_tracker_url: ""
tracker_id: "FT-4"
tracker_url: "https://cyber-sun.atlassian.net/browse/FT-4"
created_at: "2026-09-24"
last_updated: "2026-09-24"
last_synced: "2026-09-24T15:50:40Z"
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
---

# PBI ft-4-task-picker: Create, rename and pick Tasks

## Parent

Epic FT-1 — Pomodoro tracker ([Epic PRD](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md))

## Deliverables

1. **Runnable app from a fresh clone.** The repository is an npm workspaces monorepo with three workspaces: `apps/server` (Node 22, TypeScript, ESM, Hono), `apps/web` (React, Vite, TypeScript) and `packages/shared` (zod schemas and the TypeScript types inferred from them, imported by both sides). Root scripts: `npm run dev` starts the server on port 3000 and Vite on port 5173, with Vite proxying `/api` to the server; `npm run build` builds all workspaces; `npm start` runs the server, which serves the built web app and the API from one origin, `http://localhost:3000`. The server binds to the loopback interface only and is not reachable from other machines. The port and the SQLite file path (default `./data/pomodoro.sqlite`, with `data/` gitignored) can be overridden by environment variables. There is no login, no account and no user concept: one person uses the app on their own machine, and running it costs nothing beyond that machine.
2. **Test setup.** Vitest runs from the root with `npm test`. At least one API test exercises the Task endpoints in-process (Hono `app.request()`, no open port) against an in-memory SQLite database, including the name-rule rejections.
3. **Durable Task storage.** Tasks are stored in a SQLite file through the built-in `node:sqlite` module. On startup the server opens the database with WAL journaling and foreign keys on, then applies numbered SQL migrations in order inside a transaction, tracking the applied version in `PRAGMA user_version`; running the server again applies nothing twice. A Task has a UUID id, a name, an Open or Done state (always Open in this story), and created and updated times stored as UTC epoch milliseconds. Uniqueness of names among Open Tasks, ignoring letter case, is enforced by the database (a unique index on the lower-cased name limited to Open Tasks) as well as by the API. Tasks survive a server restart and a machine reboot.
4. **Task API with one contract and one error shape.** The server exposes `GET /api/tasks` (Open Tasks), `POST /api/tasks` (create) and a rename endpoint for one Task. Request bodies are validated with zod schemas from `packages/shared`, and the web app parses responses with the same schemas. Every error response has the shape `{ error: { code, message } }` with a stable machine-readable `code` (for example a validation failure or a duplicate name) and a short human-readable `message`. The Task list response includes each Task's number of Completed Pomodoros, which is 0 for now.
5. **Create a Task.** The user types a name and confirms. The name is trimmed of leading and trailing whitespace; it must not be empty after trimming and must be at most 100 characters after trimming; it is rejected if it equals the name of an existing Open Task, ignoring letter case. A rejected name keeps the typed text and shows a clear inline message next to the field (empty name, name too long, a Task with this name already exists). A new Task is Open, starts with a Tree of zero Growth Steps, appears in the Task Picker at once and can be picked as the Current Task immediately.
6. **Task Picker and Current Task.** The Task Picker lists Open Tasks only. Picking a Task makes it the Current Task and shows its name prominently. The Current Task is kept in the browser (by Task id), so it is restored after a reload and after quitting and reopening the browser. If the remembered Task no longer exists or is not Open, the app shows no Current Task and invites the user to pick or create one. When there are no Tasks, the picker shows a calm empty state that leads to creating the first Task.
7. **Rename a Task.** The user can rename a Task from the Task Picker. The same name rules as for creating apply; the Task's own current name does not count as a duplicate, so changing only its letter case is allowed. Rename changes the name only: the Task id never changes, so anything attached to the Task later (Pomodoro Records, its Tree) stays attached. If the renamed Task is the Current Task, it stays the Current Task and the new name shows at once. The rename endpoint accepts a Task in any state (Open or Done): for a Done Task the same length and trim rules apply, and the duplicate check compares only against Open Tasks. Renaming a Done Task from the screen belongs with the view that lists Done Tasks and is not part of this story.
8. **Timer-first main screen shell.** The main screen is dominated by a large timer area with a tomato motif, shown as a static placeholder with the Current Task name (or a prompt to pick a Task); the Task Picker sits with it. The look is calm and plain: short text, no nags. Styling uses Tailwind CSS configured at build time in `apps/web`, and the screens are built from Tailkit's free React + Tailwind components copied into `apps/web` as source owned by the project, not installed as a runtime package. The running app loads no fonts, scripts, styles, images or other assets from third-party hosts, and sends no telemetry.

## Acceptance criteria

1. **Given** an Open Task named "FT-1 PRD" exists, **When** the user tries to create or rename another Task to "ft-1 prd", "  FT-1 PRD  ", an empty or whitespace-only name, or a name of 101 characters after trimming, **Then** each attempt is rejected with a clear inline message, the API answers with `{ error: { code, message } }`, and no Task is created or changed; **and When** the user creates "  Write tests  " or a name of exactly 100 characters, **Then** it is saved trimmed and appears in the Task Picker.
2. **Given** a Task "Refactr" is the Current Task, **When** the user renames it to "Refactor" and later to "REFACTOR", **Then** both renames succeed, the Task keeps the same id, it remains the Current Task, and the Task Picker and main screen show the new name without a reload.
3. **Given** the user picked a Task as the Current Task, **When** the page is reloaded, and again when the browser is quit and reopened at `http://localhost:3000`, **Then** the same Task is shown as the Current Task without any action.
4. **Given** several Tasks were created, **When** the server process is stopped and started again (and after a machine reboot), **Then** all Tasks are listed in the Task Picker with their names unchanged, and a migration that was already applied is not applied again.
5. **Given** a fresh clone with dependencies installed, **When** the user runs `npm run build && npm start` and opens `http://localhost:3000`, **Then** the main screen with the tomato timer placeholder and the Task Picker is served from that single origin, the browser's network log shows no request to any host other than `localhost:3000`, and the server is not reachable from another machine on the network; **and** `npm test` passes, including the in-process API test against an in-memory database.

## Depends on

None — can start immediately

## Out of scope

- The timer itself: Start, Pause, Resume, Reset, countdowns, Breaks and Alerts.
- Marking Tasks Done and reopening them, and a screen control for renaming a Done Task.
- Trees drawn per Task, the Task List view and the Garden.
- Statistics and Settings.

## References

- epic-prd: [prd.md](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md)
- epic-architecture: [pomodoro-tracker-architecture.md](/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md)
