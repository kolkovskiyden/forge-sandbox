---
id: "ft-14-settings"
title: "Settings: Interval lengths and Completion Sound"
kind: pbi
type: "Story"
status: "published"
parent_kind: "epic"
parent_tracker_id: ""
parent_tracker_url: ""
tracker_id: "FT-14"
tracker_url: "https://cyber-sun.atlassian.net/browse/FT-14"
created_at: "2026-09-24"
last_updated: "2026-09-24"
last_synced: "2026-09-24T15:50:40Z"
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
---

# PBI ft-14-settings: Settings: Interval lengths and Completion Sound

## Parent

Epic FT-1 — Pomodoro tracker ([Epic PRD](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md))

## Deliverables

1. **Settings view.** A Settings view is reachable from the main screen and leads back to it. Navigation is a view value held in app state or `location.hash` (no router library). The view is built from Tailkit components with Tailwind CSS: three whole-minute number inputs (Work Interval, Short Break, Long Break), a Completion Sound on/off toggle, and a Save button. All controls are operable with the keyboard alone and have visible labels.
2. **Interval lengths.** The user can set the Work Interval, Short Break and Long Break lengths in whole minutes. Defaults are 25, 5 and 15 minutes. Allowed values are 1 to 90 minutes for the Work Interval and 1 to 60 minutes for each Break. An empty, non-numeric, non-integer or out-of-range value is rejected with a clear message next to the field that names the allowed range (for example "Work Interval must be a whole number from 1 to 90 minutes"), and nothing is saved. The same zod Settings schema in `packages/shared` validates the form in the browser and the request body on the server.
3. **Changes apply to the next Interval only.** Every Interval that starts after a successful save uses the new lengths: the next Work Interval, and the Short Break or Long Break chosen at the next Completed Pomodoro. A Running or Paused Interval keeps the length it started with, because the running Interval stores its own scheduled end time; saving Settings never changes it. A Pomodoro Completed after its full length records Focus Time equal to the Work Interval length it started with. When the Timer State is Idle, the timer shows the saved Work Interval length.
4. **Fixed Long Break cadence.** The fourth Completed Pomodoro in a Cycle still ends it with a Long Break. The cadence is not shown in the Settings view and cannot be changed.
5. **Completion Sound on/off.** The default is on. When off, no sound plays at any Interval end (Work Interval or Break); the system notification and the tab title change still happen exactly as when the sound is on. Turning it back on restores the sound from the next Interval end.
6. **Server-side persistence.** Settings are a single row in a `settings` table in SQLite (one user), holding the three lengths in minutes and the Completion Sound flag; the row is created with the defaults when the server first starts on an empty database. `GET /api/settings` returns the current Settings; `PUT /api/settings` validates and replaces them and returns the saved values. Errors, including validation failures, use the single shape `{ error: { code, message } }`. Settings survive browser restart, browser reinstall, server restart and machine reboot, and the same values apply in any browser on the machine.
7. **Loading and saving in the browser.** The browser loads Settings at startup and again after every successful save. Settings are online-only (no local queue): if the server is unreachable or returns an error when saving, the Settings view shows that the change could not be saved, keeps the entered values in the form so the user can retry, and the timer keeps using the last loaded values. If Settings were never loaded in this browser, the timer uses the defaults 25, 5 and 15 minutes with the Completion Sound on.
8. **Tested API and rules.** Server routes for `GET` and `PUT /api/settings` are tested in-process with Hono `app.request()` against a `:memory:` SQLite database, covering first-run defaults, a valid update, every range edge, a non-integer value and the error shape. The rule that a change applies only to the next Interval is unit-tested with a fake clock.

## Acceptance criteria

1. **Given** the Settings view, **When** the user enters Work Interval values 0, 1, 90, 91 and 25.5, and Short Break or Long Break values 0, 1, 60 and 61, **Then** only 1 and 90 (Work Interval) and 1 and 60 (Breaks) are accepted and saved; every other value is rejected with a message naming the allowed whole-minute range, and a `PUT /api/settings` sent directly with any rejected value returns an error in the shape `{ error: { code, message } }` and leaves the stored Settings unchanged.
2. **Given** a fresh database, **When** the app is opened for the first time, **Then** `GET /api/settings` returns Work Interval 25, Short Break 5, Long Break 15 and Completion Sound on, and the Idle timer shows 25:00.
3. **Given** a Work Interval of 25 minutes Running since 10:00, **When** the user saves a Work Interval of 50 minutes and a Short Break of 10 minutes at 10:05, **Then** the running Pomodoro still ends at 10:25 as Completed with Focus Time 25 minutes, the Short Break that follows lasts 10 minutes, and the next Work Interval started afterwards lasts 50 minutes.
4. **Given** the Completion Sound is turned off and saved, **When** a Work Interval or a Break ends, including in a background tab, **Then** no sound plays, while the system notification appears and the tab title changes as they do with the sound on.
5. **Given** Settings saved in Chrome as Work Interval 40, Short Break 8, Long Break 20 and Completion Sound off, **When** the app is opened in Safari on the same machine, or Chrome is reinstalled, or the server is restarted, **Then** the Settings view and the Idle timer show exactly those values.
6. **Given** the server is unreachable, **When** the user saves changed Settings, **Then** the view shows that the change could not be saved, the entered values stay in the form, and the next Interval uses the last loaded values (or 25, 5 and 15 minutes with sound on if Settings were never loaded).

## Depends on

- [FT-7](https://cyber-sun.atlassian.net/browse/FT-7)
- [FT-8](https://cyber-sun.atlassian.net/browse/FT-8)

## Out of scope

- A sound picker or volume control; there is one built-in Completion Sound at system volume.
- A configurable Long Break cadence.
- A configurable Day start.

## References

- epic-prd: [prd.md](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md)
- epic-architecture: [pomodoro-tracker-architecture.md](/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md)
