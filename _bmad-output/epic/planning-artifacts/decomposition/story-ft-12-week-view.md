---
id: "ft-12-week-view"
title: "Week view"
kind: pbi
type: "Story"
status: "published"
parent_kind: "epic"
parent_tracker_id: ""
parent_tracker_url: ""
tracker_id: "FT-12"
tracker_url: "https://cyber-sun.atlassian.net/browse/FT-12"
created_at: "2026-09-24"
last_updated: "2026-09-24"
last_synced: "2026-09-24T15:50:40Z"
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
---

# PBI ft-12-week-view: Week view

## Parent

Epic FT-1 — Pomodoro tracker ([Epic PRD](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md))

## Deliverables

1. **Week boundaries in local time.** A Week runs from Monday 00:00 to the next Monday 00:00 in the browser's local time zone. There is no Sunday-start option. A Day runs from local midnight to local midnight, and a Pomodoro belongs to the Day, and therefore the Week, on which it started, even if it ended after midnight. Week and Day boundaries are computed with local calendar arithmetic (Monday's date plus 1 to 7 days, each at local 00:00), never by adding fixed 24-hour steps. This keeps a Week that contains a daylight-saving change at 167 or 169 hours, with every Day starting exactly at local midnight.
2. **Week view with a per-Day × per-Task table.** For the selected Week the view shows a heading with the Week's date range (for example "Mon 21 Sep – Sun 27 Sep 2026") and the Week totals: Completed Pomodoros and Focus Time. Below the heading is one table. It has one column per Day, Monday to Sunday in that order, plus a Week total column. It has one row per Task with at least one Completed Pomodoro in that Week, plus a Day totals row. Each cell shows the number of Completed Pomodoros and the Focus Time. The per-Task row's last cell holds that Task's Week total, the totals row holds each Day's total, and the corner cell holds the Week total. Focus Time is the sum of the Focus Time counted on Completed Pomodoro Records. It is Work Interval time only, with paused time excluded, and is shown in the same hours-and-minutes format as the Day view (for example "1 h 40 min", "0 min"). Interrupted Pomodoros add nothing to any count or Focus Time in this view. Done Tasks are listed like Open Tasks when they have Completed Pomodoros in the Week. Every Task is shown under its current name.
3. **Previous and next Week navigation.** The view opens on the current Week, the one containing today, by default. Previous-Week and next-Week controls move one Week at a time, and the heading and table update without a page reload. A Week with no Completed Pomodoros shows zeros in its totals and Day totals row and a short, plain line such as "No Pomodoros this Week". It shows no warning and no punitive wording.
4. **Reachable without a router.** The Week view is one of the app's views and is chosen by a view value mirrored in `location.hash` as `#week` for the current Week and `#week/YYYY-MM-DD` for a specific Week, where the date is that Week's Monday. No router library is added. A Week link on the main screen opens the current Week. A Week link in the Day view opens the Week that contains the Day being viewed. Reloading the page keeps the selected Week. The browser Back button returns to the previous view or Week. An unparseable hash falls back to the current Week.
5. **One range query merged with the local outbox.** For the selected Week the app makes one request, `GET /api/pomodoros?from=<ms>&to=<ms>`. `from` is local Monday 00:00 and `to` is the next local Monday 00:00, both as UTC epoch milliseconds. The range is half-open, so a record belongs to it when `from <= start time < to`. The response is parsed with the shared Pomodoro Record schema. Records still waiting in the browser's `localStorage` outbox, filtered to the same range by start time, are merged in. A record present in both sources is counted once, matched by its UUID. Task names come from the Task list the app already loads with `GET /api/tasks`. The numbers update without a reload when a Pomodoro is Completed, when the outbox changes (in another tab too), and when the window regains focus. If the range request fails, the view shows the outbox records it has and a short non-blocking note that saved history could not be loaded, and it retries on focus.
6. **Week aggregation as pure, tested functions in the shared package.** Two functions live in `packages/shared`. One computes the Week range and its seven Day ranges for a given date. The other aggregates a list of Pomodoro Records into per-Day, per-Task, per-Day-per-Task, and Week totals of Completed Pomodoros and Focus Time. The aggregation buckets records into Days with the same Day aggregation function the Day view uses, so the Week and Day numbers cannot diverge. Neither function touches the browser, the network, or the current clock except through its arguments. Vitest tests run with a fixed time zone and cover:
   - a normal Week;
   - a Week containing a daylight-saving change, for example Europe/Berlin, Monday 19 Oct to Sunday 25 Oct 2026, with 169 hours;
   - a Pomodoro started Sunday 23:50 and Completed Monday 00:15, which is counted in full on that Sunday and in that Week;
   - a Pomodoro started exactly at Monday 00:00, which belongs to the new Week;
   - Interrupted records being ignored;
   - a duplicate id from server and outbox being counted once;
   - an empty Week giving all zeros.
7. **Built from Tailkit and Tailwind.** The heading, navigation controls, table, and empty state are assembled from Tailkit's free React + Tailwind components, copied into `apps/web` as owned source and styled with Tailwind. The table fits a desktop browser window without horizontal page scrolling for up to about 10 Tasks. It uses the app's calm style and plain text. It has no charts, graphs, or colour scales beyond the per-Day breakdown in the table. The navigation controls are reachable from the keyboard.

## Acceptance criteria

1. **Given** the browser's time zone is Europe/Berlin and there is a Completed 25-minute Pomodoro started Sunday 27 Sep 2026 at 23:50, and another started Monday 28 Sep 2026 at 00:00, **When** the user opens the Week of Monday 21 Sep 2026, **Then** the first column is Monday 21 Sep, the last is Sunday 27 Sep, and the Sunday column counts the first Pomodoro with 25 min of Focus Time. **When** the user moves to the next Week, **Then** the second Pomodoro appears under Monday 28 Sep and not in the previous Week.
2. **Given** a Week with Completed and Interrupted Pomodoros on three Tasks across several Days, one of the Completed ones still waiting in the outbox because the server was down, **When** the user opens that Week, **Then** each Day's column shows the same Completed Pomodoros and Focus Time, in total and per Task, as the Day view for that Day. Each Task's Week total equals the sum of its Day cells, the Week totals equal the sum of all Days, and Interrupted Pomodoros add nothing. **When** the outbox record is then stored on the server and the view refreshes, **Then** every number is unchanged: the record is not counted twice.
3. **Given** the app is on the main screen, **When** the user opens the Week view, **Then** the current Week is shown. **When** the user presses previous Week twice, reloads the page, and then presses next Week once, **Then** the view first still shows the same earlier Week after the reload and then the Week before the current one. **When** the user opens the Week view from a Day view of a past Day, **Then** the Week containing that Day is shown. A Week with no Pomodoros shows zeros and the "No Pomodoros this Week" line.
4. **Given** a Task had Completed Pomodoros last Week and was then renamed and marked Done, **When** the user opens last Week, **Then** its row shows the new name with its original counts and Focus Time.
5. **Given** the Week aggregation unit tests run in the Europe/Berlin time zone, **When** they aggregate the daylight-saving Week of Monday 19 Oct to Sunday 25 Oct 2026 and a Week whose only Pomodoro started Sunday 23:50, **Then** the DST Week's range is 169 hours with every Day starting at local 00:00 and each record falls on the Day it started, and the Sunday 23:50 Pomodoro is counted on that Sunday. All of the listed test cases pass.

## Depends on

- [FT-11](https://cyber-sun.atlassian.net/browse/FT-11)

## Out of scope

- Monthly and yearly views.
- Charts or graphs of any kind beyond the per-Day table.
- Export of Week data.

## References

- epic-prd: [prd.md](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md)
- epic-architecture: [pomodoro-tracker-architecture.md](/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md)
