---
id: "ft-7-breaks-and-cycle"
title: "Automatic Breaks and the four-Pomodoro Cycle"
kind: pbi
type: "Story"
status: "published"
parent_kind: "epic"
parent_tracker_id: ""
parent_tracker_url: ""
tracker_id: "FT-7"
tracker_url: "https://cyber-sun.atlassian.net/browse/FT-7"
created_at: "2026-09-24"
last_updated: "2026-09-24"
last_synced: "2026-09-24T15:50:40Z"
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
---

# PBI ft-7-breaks-and-cycle: Automatic Breaks and the four-Pomodoro Cycle

## Parent

Epic FT-1 — Pomodoro tracker ([Epic PRD](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md))

## Deliverables

1. **Automatic Break after a Completed Pomodoro.** When a Work Interval reaches its full length (paused time excluded), the Pomodoro is Completed and a Break starts by itself, with no user action. Order matters: the Completed Pomodoro Record (Task, start time, end time, outcome Completed, Focus Time) is first appended to the local outbox in `localStorage`, then the Break is shown as Running, then the record is sent with the idempotent `PUT /api/pomodoros/:id` keyed by the UUID minted at Start. Only the tab that pressed Start (the owner) runs this transition and writes the record; other tabs of the same browser mirror the new state via `BroadcastChannel`.
2. **Short Break or Long Break from the Cycle.** The Break is a Long Break of 15 minutes if the Pomodoro just Completed is the fourth Completed Pomodoro in the current Cycle; otherwise it is a Short Break of 5 minutes. Lengths are fixed at these values in this story. The Cycle counts Completed Pomodoros across all Tasks since the last Long Break; starting a Long Break resets it to zero. Interrupted Pomodoros do not advance it. The Cycle resets at the start of each Day (local midnight in the browser's time zone); the Cycle position and its Day are kept with the persisted Timer State in `localStorage`, so a reload does not change which Break comes next.
3. **Break controls.** A Running Break can be Paused and Resumed; while Paused, its remaining time does not change and paused time is not counted. Reset ends a Running or Paused Break: the Timer State becomes Idle with the Work Interval length (25:00) ready, and the Current Task can be changed. A Break Paused for 30 minutes without being resumed ends at that moment and the Timer State becomes Idle. No Pomodoro Record is ever written for a Break, and there is no skip-Break control; Reset is the only way to leave a Break early. Ending a Break never changes the Cycle.
4. **Bounded automatic start of the next Pomodoro.** When a Break reaches its full length:
   - if the app tab is visible and the window focused at that moment, the next Work Interval (25 minutes) starts at once on the Current Task, with a new start time and a new client-minted UUID;
   - otherwise, if the tab is brought to the front (visible and focused) within 60 seconds after the Break end, for example by activating a notification, the next Work Interval starts at that moment, with that moment as its start time;
   - otherwise the Break end is an Unseen End and the Timer State becomes Idle, waiting for Start;
   - if the Current Task is Done or no Current Task exists at the Break end, the Timer State becomes Idle and nothing starts.
5. **Unseen End state kept.** Every Interval end (Work Interval or Break) is classified as seen or Unseen End: it is seen if the tab was visible and the window focused at the end moment, or if the user acts in the app (click or key press in the app, or bringing the tab to the front) within 60 seconds after it. For an Unseen End the app keeps, in `localStorage`, which Interval ended (Work Interval, Short Break or Long Break), its Task, its end time, and what followed (the Break that started and its end, a next Pomodoro that started and when, or Idle waiting for Start). This state survives reload and browser restart, and is cleared when the user presses Start or Reset. It is kept for a later return-to-app summary; displaying it is not part of this story.
6. **App-closed rules on next open.** When the app is opened and reconciles the stored Timer State with the clock: when a Work Interval's scheduled end passed while the app was closed (its Pomodoro is already stored as Completed at the scheduled end, and the Timer State is Idle), no Break and no next Pomodoro are started retroactively, and the Pomodoro still counts toward the Cycle. A Break whose scheduled end passed while closed leaves the Timer State Idle. A Paused Break whose 30-minute time-out passed while closed leaves the Timer State Idle. Work Interval and Break ends found this way are recorded as Unseen Ends.
7. **Break timing is always true.** A Break's end is scheduled by the same module Web Worker as the Work Interval, so it is detected within 2 seconds of its scheduled end, in a background tab too. Remaining Break time is derived from the Break's start time, pause data and the clock, never from counted ticks; it is recomputed on `visibilitychange`, `focus` and `pageshow` (covering system sleep) and is never shown as negative.
8. **Main screen shows which Interval is running.** The main screen clearly distinguishes a Work Interval from a Short Break and a Long Break by label and visual treatment (tomato motif for the Work Interval, a calmer treatment for Breaks), together with the Running or Paused state and the remaining time. Built from Tailkit components with Tailwind CSS.
9. **Pure, tested state machine.** All transitions above live in the pure timer state machine in `packages/shared` and are unit-tested with Vitest fake timers (`vi.useFakeTimers()`, `vi.setSystemTime()`): Cycle counting across Tasks, Interrupted not advancing, the Long Break reset, the local-midnight reset, the seen / within-60-seconds / Unseen End cases at Break end, Current Task Done or missing, the 30-minute Paused Break time-out, and every app-closed rule.

## Acceptance criteria

1. **Given** three Pomodoros Completed today since the last Long Break, on two different Tasks, with one Interrupted Pomodoro between them, **When** the next Work Interval reaches its full length, **Then** its Completed Pomodoro Record is in the local outbox before the Break shows as Running, a 15-minute Long Break is Running without any user action, and the next Completed Pomodoro after it is followed by a 5-minute Short Break.
2. **Given** three Pomodoros were Completed yesterday since the last Long Break and none today, **When** the first Pomodoro of today is Completed, **Then** a 5-minute Short Break starts, because the Cycle reset at local midnight.
3. **Given** a Break is Running on an Open Current Task, **When** the Break reaches its end, **Then**:
   - with the tab visible and the window focused, a new Work Interval starts at that moment on the Current Task with a new UUID and start time;
   - with the tab in the background and brought to the front 40 seconds later, the new Work Interval starts at the moment of focus, not at the Break end;
   - with the tab not brought to the front within 60 seconds, the Timer State is Idle, an Unseen End (Break ended, what followed: waiting for Start) is stored, and it is still present after a reload;
   - in every case the end is detected within 2 seconds, including in a background tab, and no Pomodoro Record is written for the Break.
4. **Given** a Break is Running and the Current Task has been marked Done or no Current Task exists, **When** the Break ends with the tab visible and focused, **Then** the Timer State is Idle and no Work Interval starts.
5. **Given** a Break is Running, **When** the user Pauses it, **Then** the remaining time stays frozen; **and when** it stays Paused for 30 minutes, **Then** the Timer State becomes Idle with no record written; **and given** a Running Break, **When** the user presses Reset, **Then** the Timer State is Idle with 25:00 ready, no record is written, and no control to skip the Break exists.
6. **Given** a Work Interval was Running with 10 minutes left and the browser was quit, **When** the app is opened 40 minutes later, **Then** no Break and no next Pomodoro have started, the Timer State is Idle, the Pomodoro counts toward the Cycle, and an Unseen End is stored; **and given** a Break whose end (or a Paused Break whose 30-minute time-out) passed while the app was closed, **When** the app is opened, **Then** the Timer State is Idle.

## Depends on

- [FT-5](https://cyber-sun.atlassian.net/browse/FT-5)

## Out of scope

- System notifications, the Completion Sound, and the tab title.
- Showing the return-to-app summary; this story only keeps the Unseen End state.
- Configurable Interval lengths; the 25, 5 and 15 minute values are fixed here.
- Configurable Long Break cadence.

## Open questions

- A Pomodoro that starts before local midnight and is Completed after it: this story counts it in the Cycle of the Day it started on (a Pomodoro belongs to the Day of its start), so it is followed by a Short Break unless it is the fourth of that Day. Confirm.
- A Pomodoro Completed while the app was closed advances the Cycle, but no Break is started. If it is the fourth in the Cycle, this story resets the Cycle as if its Long Break had been taken. Confirm.

## References

- epic-prd: [prd.md](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md)
- epic-architecture: [pomodoro-tracker-architecture.md](/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md)
