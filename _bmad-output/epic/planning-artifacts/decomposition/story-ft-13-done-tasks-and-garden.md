---
id: "ft-13-done-tasks-and-garden"
title: "Mark Tasks Done, reopen them, and the Garden"
kind: pbi
type: "Story"
status: "published"
parent_kind: "epic"
parent_tracker_id: ""
parent_tracker_url: ""
tracker_id: "FT-13"
tracker_url: "https://cyber-sun.atlassian.net/browse/FT-13"
created_at: "2026-09-24"
last_updated: "2026-09-24"
last_synced: "2026-09-24T15:50:40Z"
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
---

# PBI ft-13-done-tasks-and-garden: Mark Tasks Done, reopen them, and the Garden

## Parent

Epic FT-1 — Pomodoro tracker ([Epic PRD](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md))

## Deliverables

1. **Done state and done date stored on the server.** A new numbered SQL migration, applied at startup and tracked in `PRAGMA user_version` like the earlier ones, lets a Task be Done and adds the date it was marked Done, stored as UTC epoch milliseconds and empty while the Task is Open. Existing Tasks stay Open and unchanged, and running the server again does not apply the migration twice. Task-name uniqueness still applies among Open Tasks only, ignoring letter case, and is enforced by the database with a unique index on the lower-cased name limited to Open Tasks. A Done Task may therefore have the same name as an Open Task.
2. **Task API for Done Tasks.** The server can mark an Open Task Done, reopen a Done Task, and list Done Tasks. Each listed Done Task has its id, name, done date and number of Completed Pomodoros. Marking a Done Task Done again, or reopening an Open Task, is rejected and changes nothing. Every error uses the shape `{ error: { code, message } }` with a stable `code`. Request and response bodies are checked against the zod schemas in `packages/shared`, used by both server and web app. The list of Open Tasks used by the Task Picker and the Task List never contains Done Tasks. The server has no endpoint that deletes a Task or a Pomodoro Record.
3. **Mark a Task Done from the Task List.** Each Open Task in the Task List has a Mark Done control. The control is unavailable while any Interval (a Work Interval or a Break) is Running or Paused on that Task, and the app says why in plain words: Reset the timer first. The browser makes this check, because only the browser knows about the running Interval (it is kept in `localStorage` and shared across tabs of the same browser). Once marked Done, the Task disappears from the Task List and the Task Picker right away, with no reload. The server stores the moment it was marked Done. If the Task was the Current Task, no Current Task is selected afterwards, the remembered Current Task is cleared from the browser, and the main screen asks the user to pick or create a Task.
4. **A Done Task keeps its history.** Marking a Task Done changes none of its Pomodoro Records, including Completed records still waiting in the browser to be sent to the server. Its Tree keeps its current number of Growth Steps and stops growing, because no Pomodoro can be started on a Done Task. Pomodoro Records for a Done Task are still returned by the Pomodoro range query. Statistics for any Day or Week still count them and show them under the Task's current name, so the web app can look up the names of Done Tasks as well as Open Tasks.
5. **Garden view.** A Garden entry in the Task List opens the Garden, and the user can go back from the Garden to the Task List. The Garden shows every Done Task as a card in a grid. Each card has the Task's Tree, drawn the same way as in the Task List at its current number of Growth Steps, the Task name, the number of Completed Pomodoros, and the date it was marked Done in the browser's local time zone. Cards are ordered by done date, most recently Done first. With no Done Tasks, the Garden shows a calm, short empty state, for example that finished Tasks and their Trees will appear here, with a way back to the Task List.
6. **Reopen a Task from the Garden.** Each Garden card has a Reopen control. Reopening makes the Task Open again, clears its done date, removes it from the Garden, and makes it appear in the Task List and the Task Picker right away. Its Tree continues from its current number of Growth Steps, and the next Completed Pomodoro on it adds exactly one Growth Step. Reopening does not make the Task the Current Task.
7. **Rename a Done Task in the Garden.** Each Garden card lets the user rename the Done Task with the same rules as for Open Tasks. The name is required and trimmed, has at most 100 characters after trimming, and is rejected if it equals the name of an existing Open Task, ignoring letter case. The Task's own current name does not count as a duplicate, so a change of letter case only is allowed. A rejected name keeps the typed text and shows a clear inline message. The Task id never changes, so its Pomodoro Records and Tree stay attached, and statistics show the new name.
8. **No deletion anywhere; consistent look.** There is no delete control for Tasks or Pomodoro Records in the Task List, the Garden or anywhere else. The Garden and the new controls use Tailwind CSS and Tailkit's free React + Tailwind components (a grid of cards for the Garden, buttons, inline form field, empty state), copied into `apps/web` as project-owned source. The tone is calm and non-punitive: marking Done is presented as finishing, not losing anything.

## Acceptance criteria

1. **Given** a Work Interval or a Break is Running or Paused with Task "FT-1 PRD" as the Current Task, **When** the user opens the Task List, **Then** Mark Done on "FT-1 PRD" is unavailable, with a message that the timer must be Reset first, and Mark Done on other Open Tasks is available; **and When** the user Resets and marks "FT-1 PRD" Done, **Then** it disappears from the Task List and the Task Picker without a reload, no Current Task is selected (also after a page reload), and Start is unavailable until a Task is picked.
2. **Given** Tasks "A", "B" and "C" were marked Done on 2026-09-20, 2026-09-23 and 2026-09-22, **When** the user opens the Garden from the Task List, **Then** the cards appear in the order "B", "C", "A", each with its Tree, name, number of Completed Pomodoros and done date; **and Given** no Task is Done, **Then** the Garden shows the empty state and a way back to the Task List.
3. **Given** a Done Task "Refactor" with 7 Completed Pomodoros, **When** the user reopens it from the Garden and then completes one Pomodoro on it, **Then** it leaves the Garden, appears in the Task List and Task Picker, and its Tree and count go from 7 to 8 Growth Steps (not from 0 to 1), and all 7 earlier Pomodoro Records are still attached to it.
4. **Given** Task "Docs" had 3 Completed Pomodoros and 1 Interrupted Pomodoro yesterday and was then marked Done, **When** statistics for yesterday are computed from the Pomodoro range query, **Then** "Docs" still shows 3 Completed Pomodoros, their Focus Time and 1 Interrupted Pomodoro under its name, and the Day totals are unchanged by marking it Done.
5. **Given** an Open Task "Write tests" and a Done Task "Old tests", **When** the user renames "Old tests" in the Garden to "write TESTS", to an empty or whitespace-only name, or to a name of 101 characters after trimming, **Then** each attempt is rejected with a clear inline message and `{ error: { code, message } }` from the API, and nothing changes; **and When** the user renames it to "  Legacy tests  ", **Then** it is saved as "Legacy tests" with the same id and records. In-process API tests (Hono `app.request()` against an in-memory SQLite database) cover mark Done, reopen, the Done list ordering, the Open-only uniqueness, and that no delete endpoint exists.

## Depends on

- [FT-10](https://cyber-sun.atlassian.net/browse/FT-10)

## Out of scope

- Deleting Tasks or Pomodoro Records.
- Editing past Pomodoro Records.
- The Day and Week statistics views themselves; this story only keeps Done Tasks countable in them.

## Open questions

- **Reopening a Done Task whose name matches an Open Task.** The source documents do not say what happens when the user reopens a Done Task whose name equals, ignoring letter case, the name of an existing Open Task. Proposed default: the reopen is rejected with `{ error: { code, message } }`, the Task stays in the Garden, and the card shows a short inline message asking the user to rename it first (rename is available on the same card). The database's uniqueness index among Open Tasks enforces the same rule. **Needs author confirmation.**

## References

- epic-prd: [prd.md](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md)
- epic-architecture: [pomodoro-tracker-architecture.md](/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md)
