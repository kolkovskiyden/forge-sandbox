---
id: "ft-5-run-a-pomodoro"
title: "Run a Pomodoro on the Current Task"
kind: pbi
type: "Story"
status: "published"
parent_kind: "epic"
parent_tracker_id: ""
parent_tracker_url: ""
tracker_id: "FT-5"
tracker_url: "https://cyber-sun.atlassian.net/browse/FT-5"
created_at: "2026-09-24"
last_updated: "2026-09-24"
last_synced: "2026-09-24T15:50:40Z"
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
---

# PBI ft-5-run-a-pomodoro: Run a Pomodoro on the Current Task

## Parent

Epic FT-1 — Pomodoro tracker ([Epic PRD](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md))

## Deliverables

1. **Start a Pomodoro.** Start is available only when the Timer State is Idle and a Current Task exists. With no Current Task, Start is unavailable and the app asks the user to pick or create a Task. Start begins a Work Interval of 25 minutes (a fixed default in this story) on the Current Task, records the Pomodoro's start time, and generates the Pomodoro's UUID at that moment; the same UUID identifies the Pomodoro Record later.
2. **Current Task lock.** While an Interval is Running or Paused, the Current Task cannot be changed; the Task Picker is shown as locked. Changing the Current Task requires Reset first.
3. **Pause and Resume.** The user can pause a Running Work Interval and resume it. While Paused, the remaining time is frozen and the app clearly shows the Paused state. Paused time is excluded from the Work Interval length and from Focus Time, so resuming moves the scheduled end later by the paused duration. A Pomodoro Paused for 30 minutes without being resumed ends as Interrupted at exactly that moment (pause start + 30 minutes); its Pomodoro Record is stored and the Timer State becomes Idle.
4. **Reset.** Reset on a Running or Paused Work Interval ends the Pomodoro as Interrupted with the actual end time (the moment of Reset) and stores its Pomodoro Record. Afterwards the Timer State is Idle, the timer shows 25:00 ready, and the Current Task can be changed again.
5. **Remaining time is always true.** Remaining time is computed from the Interval's start and end timestamps, the accumulated paused time and the current clock, never from counted ticks, and is never shown as negative. After the tab was in the background, the browser minimized or the laptop asleep, the shown remaining time is within 1 second of the true value; the app recomputes from the clock on `visibilitychange`, `focus` and `pageshow`. A module Web Worker schedules the Interval end and posts a 1-second tick and an `ended` message, because main-thread timers are throttled in hidden tabs; the Work Interval end is detected within 2 seconds of its scheduled end, including in a background tab.
6. **Completion.** When the Work Interval reaches its full length (25 minutes of non-paused time), the Pomodoro is Completed, its Pomodoro Record is stored with the scheduled end time, and the Timer State returns to Idle. No Break is started yet.
7. **Survives reload and browser restart.** The running Interval — kind, taskId, pomodoroId, startedAt, endsAt, pausedAt, pausedTotalMs — lives in `localStorage` as the single source of truth; the server stores no timer state. After a reload or browser restart, a Running or Paused Pomodoro is restored with the same Task, Timer State and true remaining time. On next open, if the Work Interval's scheduled end passed while the app was closed, the Pomodoro is stored as Completed at its scheduled end and the Timer State is Idle; if a Paused Pomodoro's 30-minute time-out passed while the app was closed, it is stored as Interrupted at the time-out moment.
8. **Pomodoro Records on the server.** A `pomodoros` table in SQLite holds one row per ended Pomodoro: id (the UUID from Start), Task, start time, end time, outcome (Completed or Interrupted) and Focus Time counted (25 minutes for a Completed Pomodoro, 0 for Interrupted); timestamps are UTC epoch milliseconds. The browser sends each record with an idempotent `PUT /api/pomodoros/:id`; the server validates it and upserts by id, so repeating the request never creates a second record. `GET /api/pomodoros?from=&to=` returns the records whose start time lies in the half-open epoch-millisecond range [from, to). The same records appear after a browser restart or in another browser on the same machine, and survive a server restart. In this story a failed save shows an error message to the user; no retry is required.
9. **Timer on the main screen.** The timer is the largest element on the main screen, shown with a tomato motif, together with the Current Task name, the remaining time (mm:ss) and the Start, Pause, Resume and Reset controls that apply to the current Timer State. The screen is built from Tailkit components with Tailwind CSS. Start, Pause, Resume and Reset are reachable and operable with the keyboard alone (focusable controls, activated with Enter or Space, visible focus).
10. **Tested timer logic.** The timer state machine (Start, Pause, Resume, Reset, completion, 30-minute pause time-out, app-closed reconciliation) is a set of pure functions over timestamps in `packages/shared`, unit-tested with a fake clock. One Playwright smoke journey covers: create a Task, Start, reload, state restored, using the browser clock control to skip time.

## Acceptance criteria

1. **Given** a Pomodoro started at 10:00 on the Current Task, paused at 10:10 and resumed at 10:15, **When** the clock reaches 10:30, **Then** the Pomodoro is Completed, its Pomodoro Record has start 10:00, end 10:30 and Focus Time 25 minutes, and the Timer State is Idle with no Break started.
2. **Given** a Pomodoro Paused at 11:00 and never resumed, **When** the clock reaches 11:30 with the app open, **or** the app is first opened again at 13:00 after being closed, **Then** a Pomodoro Record is stored with outcome Interrupted, end time 11:30 and Focus Time 0, and the Timer State is Idle.
3. **Given** a Running Work Interval with 20:00 remaining, **When** the tab stays in the background or the laptop sleeps for 10 minutes and the user returns, **Then** the shown remaining time is within 1 second of 10:00; **and When** the Work Interval end passes while the tab is in the background, **Then** the end is detected within 2 seconds of the scheduled end, and the remaining time never shows a negative value.
4. **Given** a Pomodoro started at 14:00, **When** the page is reloaded at 14:05, **Then** it shows the same Task, Running and the true remaining time (about 20:00); **and When** the browser is quit at 14:06 and reopened at 14:50, **Then** a Pomodoro Record is stored as Completed with start 14:00 and end 14:25, the Timer State is Idle, and no Break is started.
5. **Given** a Pomodoro Record with a given id, **When** `PUT /api/pomodoros/:id` is sent twice with the same id, and the server is then restarted, **Then** `GET /api/pomodoros?from=&to=` over a range containing its start time returns exactly one record with that id, and the record is also returned when queried from another browser on the same machine.
6. **Given** a Running or Paused Pomodoro, **When** the user tries to change the Current Task, **Then** the Task Picker does not allow it; **and When** the user presses Reset using only the keyboard, **Then** a Pomodoro Record is stored as Interrupted with the moment of Reset as end time and Focus Time 0, the timer shows 25:00 Idle, and the Current Task can be changed again.

## Depends on

- [FT-4](https://cyber-sun.atlassian.net/browse/FT-4)

## Out of scope

- Breaks and the Cycle; after a Completed Pomodoro the timer simply returns to Idle.
- Tab title changes, system notifications and sound.
- The return-to-app summary.
- Keeping records when the server is unreachable (retry queue, "not saved yet" indicator).
- Syncing timer state across tabs.
- Trees, statistics and Settings.

## References

- epic-prd: [prd.md](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md)
- epic-architecture: [pomodoro-tracker-architecture.md](/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md)
