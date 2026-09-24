---
id: "ft-11-today-and-day-view"
title: "Today at a glance and the Day view"
kind: pbi
type: "Story"
status: "published"
parent_kind: "epic"
parent_tracker_id: ""
parent_tracker_url: ""
tracker_id: "FT-11"
tracker_url: "https://cyber-sun.atlassian.net/browse/FT-11"
created_at: "2026-09-24"
last_updated: "2026-09-24"
last_synced: "2026-09-24T15:50:40Z"
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
---

# PBI ft-11-today-and-day-view: Today at a glance and the Day view

## Parent

Epic FT-1 — Pomodoro tracker ([Epic PRD](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md))

## Deliverables

1. **Day and Focus Time rules.** A Day is a calendar day in the browser's local time zone, from local midnight to the next local midnight; there is no configurable day start. A Pomodoro belongs to the Day on which it started, even if it ended after midnight, and all of its Focus Time counts on that Day. Focus Time is the sum of the Focus Time counted in each Completed Pomodoro Record (Work Interval time excluding paused time). Interrupted Pomodoros add no Focus Time and are never included in the Completed count.
2. **Today at a glance on the main screen.** The main screen always shows two numbers for the current Day: the number of Completed Pomodoros and the Focus Time, shown as hours and whole minutes rounded down (for example "1 h 40 min", "25 min", "0 min"). They sit alongside the timer, never above it and never larger than it, so the timer and the Current Task's Tree stay the first things on screen. They update as soon as a Pomodoro is Completed, without a reload, and include Completed records that are still waiting in the browser outbox. When the local Day changes while the app is open, the numbers switch to the new Day (zeros until something is Completed) without a reload.
3. **Day view.** For the selected Day the view shows: the Day's date; total Completed Pomodoros and total Focus Time; a per-Task breakdown listing every Task with at least one Completed Pomodoro that Day, with its Completed count and Focus Time, ordered by Focus Time, largest first; the number of Interrupted Pomodoros, shown separately from the Completed totals; and the list of that Day's Pomodoros in start-time order, each with local start time (HH:MM), Task, and outcome (Completed or Interrupted). Tasks are always shown by their current name, so a renamed Task appears under its new name, and Done Tasks are named as well. Interrupted Pomodoros are shown plainly, without warning colours or negative wording. A Day without Pomodoros shows zeros and an empty list with a short calm message, not an error.
4. **Navigation to and within the Day view.** The Day view opens from the main screen through a visible link next to today's numbers, and returns to the main screen with one action. There is no router: the view is a view value mirrored in `location.hash`, and the selected Day is kept there as a local date (for example `#day/2026-09-24`), so reloading keeps the same Day. Previous Day and Next Day controls move one calendar Day at a time; Next Day is unavailable on today, and a "Today" control jumps back to the current Day. All controls work with the keyboard.
5. **Data from the server plus the outbox.** The browser computes the selected Day's range as local midnight to the next local midnight, converted to UTC epoch milliseconds (a Day can be 23 or 25 hours long on a daylight-saving change, so the end is the next calendar midnight, not start plus 24 hours). It fetches that Day's Pomodoro Records with `GET /api/pomodoros?from=&to=`, which returns records whose start time lies in the half-open range [from, to), and merges the outbox records whose start time falls in the same range. Records are merged by id, so a record present both on the server and in the outbox is counted once. When an outbox record is confirmed by the server, the numbers do not change. If the server cannot be reached, the numbers still include the outbox and any previously loaded records, and a short note says the stored history could not be loaded; the app never shows zeros for a Day as if they were true when the load failed.
6. **Shared aggregation, unit-tested.** Day range calculation, merging by id, and aggregation (totals, per-Task Completed count and Focus Time, Interrupted count, ordered Pomodoro list) are pure functions in `packages/shared`, independent of the browser. Vitest tests run in a fixed time zone with a daylight-saving zone (for example `TZ=Europe/Berlin`) and cover: a Pomodoro started at 23:50 and Completed at 00:15, counted wholly on the earlier Day and not on the next; a spring-forward Day (23 hours) and a fall-back Day (25 hours) with Pomodoros near both midnights, each attributed to the right Day; an Interrupted Pomodoro adding nothing to the Completed count or Focus Time; paused time excluded from Focus Time; and the same record arriving from the server and the outbox counted once.
7. **Calm UI from Tailkit.** The today numbers and the Day view are built from Tailkit's React + Tailwind components (stat tiles for the totals, a simple table or list for per-Task rows and the Pomodoro list), styled quietly so numbers stay secondary to the timer. No charts.

## Acceptance criteria

1. **Given** the main screen shows today's Completed Pomodoros and Focus Time, and the server is stopped, **When** a Pomodoro on the Current Task is Completed, **Then** without a reload the Completed count rises by one and the Focus Time rises by that Pomodoro's Focus Time; **and When** the server is started and the outbox record is confirmed, **Then** both numbers stay the same, and after a reload they are still the same.
2. **Given** a Day with two Completed Pomodoros on Task "A" (25 minutes each), one Completed Pomodoro on Task "B" (25 minutes), and one Interrupted Pomodoro on Task "B", **When** the user opens that Day in the Day view, **Then** totals show 3 Completed and 1 h 15 min, the per-Task rows show "A" with 2 and 50 min above "B" with 1 and 25 min, Interrupted shows 1 separately, and the list shows all four Pomodoros in start-time order with start time, Task, and outcome; **and When** Task "A" is then renamed to "A2", **Then** the Day view shows "A2" for its rows.
3. **Given** a Pomodoro started at 23:50 local time and Completed at 00:15 the next morning, **When** the user views the Day it started on and then presses Next Day, **Then** it is counted, with its full Focus Time, on the Day it started, and the next Day does not count it; the same holds on a daylight-saving change Day, where the Day covers exactly local midnight to the next local midnight.
4. **Given** the Day view is open on a Day with no Pomodoros, **When** it loads, **Then** it shows 0 Completed, 0 min Focus Time, 0 Interrupted and an empty list with a calm message; **and When** the user presses Previous Day and then reloads the page, **Then** the previous Day is shown again, and on today the Next Day control is unavailable.
5. **Given** the app is open on the main screen late in the evening with non-zero numbers for today, **When** the local clock passes midnight, **Then** today's numbers change to the new Day's values (zeros if nothing was Completed yet) without a reload, and the previous Day's numbers remain available in the Day view.

## Depends on

- [FT-5](https://cyber-sun.atlassian.net/browse/FT-5)
- [FT-6](https://cyber-sun.atlassian.net/browse/FT-6)

## Out of scope

- The Week view.
- Monthly and yearly views.
- Charts of any kind.
- Editing or deleting past Pomodoro Records.

## References

- epic-prd: [prd.md](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md)
- epic-architecture: [pomodoro-tracker-architecture.md](/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md)
