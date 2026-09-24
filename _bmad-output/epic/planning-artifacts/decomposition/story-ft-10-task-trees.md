---
id: "ft-10-task-trees"
title: "A Tree per Task"
kind: pbi
type: "Story"
status: "published"
parent_kind: "epic"
parent_tracker_id: ""
parent_tracker_url: ""
tracker_id: "FT-10"
tracker_url: "https://cyber-sun.atlassian.net/browse/FT-10"
created_at: "2026-09-24"
last_updated: "2026-09-24"
last_synced: "2026-09-24T15:50:40Z"
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
---

# PBI ft-10-task-trees: A Tree per Task

## Parent

Epic FT-1 — Pomodoro tracker ([Epic PRD](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md))

## Deliverables

1. **Completed count per Task from the server.** `GET /api/tasks` returns every Open Task with its real number of Completed Pomodoro Records, computed from the stored Pomodoro Records at request time. Only records with outcome Completed on that Task are counted; Interrupted records and records of other Tasks are not. A Task with no records returns 0. No counter is stored anywhere: there is no Tree or count column in the database, so the number can never drift from the records. The response is validated with the shared zod schema on both sides.
2. **Tree size as one pure function.** `packages/shared` exports a pure function that returns a Task's Tree size in Growth Steps: the server's Completed count for that Task plus the Completed Pomodoro Records for that Task that are still waiting in the browser's local outbox (records not yet confirmed by the server). Interrupted records in the outbox add nothing. The web app uses this function everywhere a Tree or its count is shown, so the main screen and the Task List always agree. The size is never negative and has no upper limit. When an outbox record is confirmed by the server, the Task counts are refetched, and the record stops counting from the outbox only once the refreshed count includes it, so the displayed size never drops, not even for a moment.
3. **Tree on the main screen.** Whenever a Current Task is selected, its Tree is shown next to the timer, including throughout every Running or Paused Interval. The timer and the Tree are the two largest things on the screen; everything else is smaller and secondary. The Task's number of Completed Pomodoros is shown with the Tree. When a Pomodoro on the Current Task is Completed, the Tree gains exactly one Growth Step and the count rises by one at that moment, without a reload, and also when the server cannot be reached. Resetting a Work Interval (an Interrupted Pomodoro) or a Pomodoro that times out while Paused changes neither the Tree nor the count.
4. **Task List view.** A Task List view shows all Open Tasks, each as a card with its Tree, its name and its number of Completed Pomodoros, in a responsive grid, oldest Task first. It is opened from a clearly labeled control on the main screen and has a way back to the main screen. Navigation uses a view value reflected in `location.hash` (for example `#tasks`), with no router library; reloading while the Task List is open keeps it open, and the browser Back button returns to the main screen. The Task List reads from the same data and the same Tree-size function as the main screen, including unsynced records. With no Tasks, it shows a calm empty state that points to creating the first Task.
5. **Tree artwork with at least 10 distinct stages.** The Tree is drawn as inline SVG built into the app, with no image files, fonts or other assets loaded from anywhere. Each size from 0 to 10 Growth Steps produces a visibly different Tree. Proposed stages: 0 a seed in a small mound of soil; 1 a sprout with two leaves; 2 a taller sprout with four leaves; 3 a thin sapling; 4 a sapling with its first side branch; 5 a small tree with a small crown; 6 a wider crown; 7 a thicker trunk with a second tier of branches; 8 a full, rounded crown; 9 the full crown with blossoms; 10 a full tree bearing its first tomato-red fruit. From 11 Growth Steps on, the Tree keeps its full form and adds one more small fruit or leaf cluster per step until the crown is full, after which it stays visually full while the count keeps rising with no cap. The same size always renders the same picture, in both the main screen and the Task List, and at card size each stage is still distinguishable. The Tree has an accessible text label such as "Tree, 7 Growth Steps".
6. **Non-punitive and calm.** Nothing about the Tree ever withers, wilts, loses leaves, turns grey or shows a warning, whatever the number of Interrupted Pomodoros or the time since the last Completed one. There is no animation beyond a short, gentle growth transition when a Growth Step is added, no sound of its own and no celebratory pop-up.
7. **UI built from Tailkit components.** The Task List grid, the Task cards, the view switch and the empty state are assembled from Tailkit's free React + Tailwind components already copied into `apps/web` as project-owned source, styled with Tailwind; no other component library is added.
8. **Tests.** Vitest unit tests cover the Tree-size function (zero records; server count only; outbox Completed records added; outbox Interrupted records ignored; records of other Tasks ignored; large sizes such as 11 and 250 are returned as is) and the stage mapping (sizes 0 to 10 map to 11 different stages; 11 and above map to the full form and never fail). An in-process API test (Hono `app.request()` against in-memory SQLite) checks that `GET /api/tasks` counts only the Completed records of each Task and returns 0 for a new Task.

## Acceptance criteria

1. **Given** the Current Task has a Tree of 3 Growth Steps, **When** a Pomodoro on it is Completed, **Then** the Tree on the main screen shows 4 Growth Steps and the count reads 4 at that moment, without a reload, and the Task List shows the same; **and When** the next Pomodoro is Reset before its end (Interrupted), **Then** the Tree stays at 4 and nothing about it looks worse.
2. **Given** the server is stopped and the Current Task shows 5 Growth Steps, **When** a Pomodoro on it is Completed, **Then** the Tree shows 6 and the count reads 6 while the record is still unsaved; **and When** the server is started again, the record is submitted, and the page is reloaded, **Then** the Tree still shows 6, and at no point during the submission did the displayed size drop below 6 or rise above it.
3. **Given** Trees of sizes 0 through 10 are rendered side by side (for example via a development-only preview or a test fixture), **When** they are compared, **Then** each of the 11 pictures is visibly different from the one before it; **and Given** a Task with 11, then 12, then 40 Completed Pomodoros, **Then** the Tree is still drawn without error, the count shows exactly 11, 12 and 40, and nothing caps or stops the count.
4. **Given** a Task was just created, **When** the user opens the Task List from the main screen, **Then** the new Task appears as a card with the size-0 Tree and a count of 0 alongside every other Open Task; **and When** the page is reloaded on the Task List, **Then** the Task List is still shown, and Back returns to the main screen.
5. **Given** the app is running, **When** the browser's network log is inspected while the main screen and the Task List are shown, **Then** no request for Tree artwork or any other asset goes to a host other than the app's own origin; **and** `npm test` passes, including the Tree-size, stage-mapping and `GET /api/tasks` count tests.

## Depends on

- [FT-5](https://cyber-sun.atlassian.net/browse/FT-5)
- [FT-6](https://cyber-sun.atlassian.net/browse/FT-6)

## Out of scope

- Marking Tasks Done, reopening them, and the Garden.
- Today's numbers and Day or Week statistics.
- Editing or deleting Pomodoro Records.

## Open questions

- **Tree stage design needs author review.** No UX spec exists, so the look of the first 10 stages and of growth beyond 10 (listed in Deliverable 5) is decided in this story as a proposal. The author should review the rendered stages before this story is accepted.
- **Lost server confirmation.** If a record reaches the server but the confirmation is lost (for example the connection drops mid-response), the record stays in the outbox until the next retry. A Task count fetched in that window would count it twice. The rule in Deliverable 2 keeps the size from dropping, but the author should confirm whether a short over-count followed by a correction is acceptable, or whether the Task counts should only be refetched after the outbox has been fully confirmed.

## References

- epic-prd: [prd.md](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md)
- epic-architecture: [pomodoro-tracker-architecture.md](/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md)
