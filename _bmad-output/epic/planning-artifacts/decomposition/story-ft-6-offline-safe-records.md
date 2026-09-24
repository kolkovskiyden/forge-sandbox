---
id: "ft-6-offline-safe-records"
title: "Keep finished Pomodoros when the server is unreachable"
kind: pbi
type: "Story"
status: "published"
parent_kind: "epic"
parent_tracker_id: ""
parent_tracker_url: ""
tracker_id: "FT-6"
tracker_url: "https://cyber-sun.atlassian.net/browse/FT-6"
created_at: "2026-09-24"
last_updated: "2026-09-24"
last_synced: "2026-09-24T15:50:40Z"
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
---

# PBI ft-6-offline-safe-records: Keep finished Pomodoros when the server is unreachable

## Parent

Epic FT-1 — Pomodoro tracker ([Epic PRD](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md))

## Deliverables

1. **Local-first write of every finished Pomodoro.** When a Pomodoro ends, Completed or Interrupted, its Pomodoro Record is appended to a browser outbox in `localStorage` synchronously, before the timer moves on to its next state and before any network request is made. The record holds: `id` (the UUID generated when the Pomodoro was started), Task id, start time, end time (both epoch milliseconds, UTC), outcome (Completed or Interrupted), and Focus Time counted in milliseconds, excluding paused time (zero for Interrupted). Outbox entries are validated with the shared Pomodoro Record schema. The outbox survives reloads, tab closes, and browser restarts.
2. **Idempotent submission to the server.** Each outbox record is sent with `PUT /api/pomodoros/:id`, where `:id` is the record's UUID. The server validates the body against the shared schema and upserts by primary key, so sending the same record any number of times leaves exactly one stored Pomodoro Record and every repeat returns a success (2xx) response. A record leaves the outbox only after a 2xx response for that id. Network errors, timeouts, and 5xx responses are retried. A 4xx response also keeps the record in the outbox: it is never dropped silently. The error is logged to the browser console and retries continue.
3. **Automatic retries until everything is stored.** The outbox is flushed immediately after each append, on app load, on the browser `online` event, and when the tab becomes visible. While the outbox holds records, it is also retried with capped exponential backoff: the first retry comes 2 seconds after a failure, the delay doubles on each further failure up to a maximum of 60 seconds, and it goes back to 2 seconds after a success. Only one flush runs at a time in a tab, and records are sent one after another, oldest first. Retries stop when the outbox is empty.
4. **"Not saved yet" indicator.** While the outbox holds at least one record, every open tab of the app shows a small, non-blocking indicator with the count, for example "2 Pomodoros not saved yet". It clears by itself as soon as the outbox is empty. It never opens a dialog, plays a sound, sends a notification, or covers the timer. Other tabs update the indicator from `localStorage` change events without a reload.
5. **The timer never waits for the server.** Start, Pause, Resume, Reset, and the start of the next Interval behave the same whether the server is up or down. None of them waits on or is blocked by a pending or failed submission, and a failed submission never changes the Timer State or the remaining time.
6. **Safe with two tabs open.** Only the tab that owns the running Interval (the tab that pressed Start) appends a finished Pomodoro to the outbox, so one Pomodoro produces one outbox entry. Any tab may flush the outbox. Two tabs flushing at the same time can only cause a repeated `PUT` of the same id, and the server absorbs that. A tab removes a confirmed record by re-reading the current outbox from `localStorage` and deleting that id only. It never writes back an older copy, so a record another tab appended in the meantime is not lost.
7. **Outbox logic in the shared package, unit-tested.** Append, flush, confirm-and-remove, backoff scheduling, and count live in `packages/shared` as code that does not depend on the browser. Storage, network, and clock are passed in, and the web app wires in `localStorage`, `fetch`, and the real clock. Vitest tests use fake timers and a stubbed network. They cover: server down then up, with the record stored once and the outbox emptied; backoff delays of 2, 4, 8 … capped at 60 seconds; duplicate delivery, with the same record sent twice and one stored row; two flushers over one outbox; and a 4xx response keeping the record. A server test with `app.request()` against a `:memory:` SQLite database shows that repeated `PUT`s of one id leave one row.

## Acceptance criteria

1. **Given** the server is stopped and a Pomodoro is Running on a Task, **When** its Work Interval reaches its full length, **Then** the Pomodoro ends as Completed, its Pomodoro Record is in the browser outbox, and the "not saved yet" indicator shows 1. **When** the server is then started and the tab becomes visible, the browser goes `online`, or the backoff retry fires, **Then** exactly one Pomodoro Record with that id exists on the server and the indicator clears without a reload.
2. **Given** the outbox holds two unsaved Pomodoro Records (one Completed, one Interrupted) and the server is stopped, **When** the tab is reloaded or the browser is quit and reopened, **Then** both records are still in the outbox and the indicator still shows 2. **When** the server is started, **Then** each record is stored on the server exactly once and the outbox is empty.
3. **Given** the server is unreachable, **When** the user presses Start, Pause, Resume, and Reset in turn, and a Work Interval ends, **Then** each action takes effect at once, the remaining time stays correct, no error dialog appears, and the only visible sign of the outage is the "not saved yet" indicator.
4. **Given** a record's `PUT` reached the server but the response was lost, so the record is still in the outbox, **When** the record is sent again, and also when two tabs of the same browser flush the outbox at the same time, **Then** the server holds exactly one Pomodoro Record for that id and the outbox ends up empty.
5. **Given** two tabs of the same browser are open and the tab that pressed Start owns the running Pomodoro, **When** that Pomodoro ends while the server is down, **Then** exactly one outbox entry is created, both tabs show the "not saved yet" indicator, and a record removed by one tab after confirmation does not remove or overwrite a record the other tab appended.

## Depends on

- [FT-5](https://cyber-sun.atlassian.net/browse/FT-5)

## Out of scope

- Creating or renaming Tasks and changing Settings while the server is down. These stay online-only; the app may say that the server is unreachable.
- Showing unsaved records in Trees and statistics. Those features read the outbox, but that work belongs to them.

## References

- epic-prd: [prd.md](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md)
- epic-architecture: [pomodoro-tracker-architecture.md](/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md)
