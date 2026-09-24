---
id: "ft-8-interval-end-alerts"
title: "Interval-end Alerts from a background tab"
kind: pbi
type: "Story"
status: "published"
parent_kind: "epic"
parent_tracker_id: ""
parent_tracker_url: ""
tracker_id: "FT-8"
tracker_url: "https://cyber-sun.atlassian.net/browse/FT-8"
created_at: "2026-09-24"
last_updated: "2026-09-24"
last_synced: "2026-09-24T15:50:40Z"
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
---

# PBI ft-8-interval-end-alerts: Interval-end Alerts from a background tab

## Parent

Epic FT-1 — Pomodoro tracker ([Epic PRD](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md))

## Deliverables

1. **Tab title that tells the Timer State from the tab strip.** The browser tab title always reflects the Timer State. While an Interval is Running it contains the remaining time (`mm:ss`) and says whether it is a Work Interval or a Break (Short Break or Long Break); while a Work Interval is Running it also contains the Current Task name, for example `12:34 · Work · FT-1 PRD` or `04:59 · Short Break`. While Paused it shows the Paused state with the frozen remaining time. When Idle it shows only the app name, with no countdown. The title is set on every tick of the module Web Worker that already schedules Interval ends (one tick per second), so it updates every second in a foreground tab and at least once per minute in a background tab, and the minutes shown are never more than one minute stale. The remaining time in the title is computed from the Interval's timestamps and the clock, never from counted ticks, and is never negative.
2. **System notification at every Interval end.** When notifications are permitted, a system notification is shown at the end of every Interval within 2 seconds of its scheduled end, also when the app tab is in the background, the window is minimized, or the browser window is behind other windows or a fullscreen app. The Web Worker posts the end to the main thread, and the main thread shows the notification in the same turn as the state transition. At a Work Interval end the notification names the Task and says which Break has started and how long it is (for example "Pomodoro on FT-1 PRD done — Short Break, 5 min"). At a Break end it names the Task the next Pomodoro started on; when the next Pomodoro did not start because the user was not there, it says the Break is over and the timer is waiting for Start, and it never claims that a Pomodoro is running. Activating the notification focuses the browser window and brings the app tab to the front, which counts as the user returning to the app for the timer's rules (within 60 seconds after a Break end this starts the next Pomodoro).
3. **Notification permission asked once, at the right moment.** Permission is requested inside the click handler of the first Start the user presses in this browser, and never on page load. If permission is denied, the prompt is dismissed without an answer, or the browser does not support notifications, the app shows a persistent, non-blocking indicator that says system notifications are off. The indicator gives short instructions for enabling them (Chrome: the site settings icon in the address bar, Notifications, Allow; Safari: Settings, Websites, Notifications; and allowing the browser in macOS System Settings, Notifications) and has a button to request permission again. The app never asks again on its own after a denial; only that button does. If the browser answers the button without showing a prompt because it remembers the denial, the indicator stays and the instructions remain the way to fix it. When permission becomes granted, the indicator disappears.
4. **Completion Sound at every Interval end.** One built-in sound file, bundled with the app and served from the app's own origin, plays at the end of every Interval within 2 seconds of its scheduled end, including in a background tab. It plays at system volume; there is no sound picker or volume control. Because browsers block audio until the page is interacted with, the audio output is created or resumed and the sound is decoded inside the Start click handler, so it is ready before the tab goes to the background. If the sound still cannot be prepared or played, the app shows a non-blocking "sound unavailable" indicator of the same kind as the notifications-off indicator; it clears once a sound plays successfully. In this story the sound is always on.
5. **Independent channels.** The tab title, the notification and the Completion Sound each carry the Interval end on their own. macOS Focus or Do Not Disturb may suppress the notification; the title and the sound still work. A denied notification permission does not affect the sound, and an unavailable sound does not affect the notification.
6. **Calm: exactly one of each.** Each Interval end produces exactly one notification and one sound, from one tab only. There are no reminders, repeats or follow-up notifications. Reloading the page after an Interval end does not issue its Alert again. An Interval end that passed while the app was not open at all issues no notification and no sound when the app is opened again.
7. **One live instance across tabs of the same browser.** The Running or Paused Interval is kept in `localStorage` as the single source of truth, and every state change is broadcast on a `BroadcastChannel`, so any other open tab of the app in the same browser shows the same Timer State, remaining time and tab title immediately, without a reload. The tab that pressed Start is the owner: it keeps a per-tab instance id in `sessionStorage`, stores that id with the running Interval, and is the only tab that issues Alerts and writes Pomodoro Records. Other tabs mirror the state and stay silent. Reloading the owner tab keeps its ownership. A different browser on the same machine shows the stored Pomodoro Records but not the Running or Paused Interval; there it appears Idle. Controlling the timer from two tabs at the same time is not supported, and no conflict resolution is built for it.
8. **Manual Alert checklist.** A checklist for manual verification in current Chrome and current Safari on macOS is added to the repository and run for this story (Firefox is best effort and not required to pass). Worker timing, notifications and sound in a background tab cannot be tested automatically; the pure title formatting and the owner-only rule are covered by unit tests with a fake clock.

## Acceptance criteria

1. **Given** a Work Interval of 25 minutes is Running on "FT-1 PRD" and the app tab has been in the background for more than 5 minutes, **When** the user looks at the tab strip at any moment, **Then** the title shows "Work", "FT-1 PRD" and a remaining time no more than one minute stale; **and When** the Interval is Paused, **Then** the title shows the Paused state; **and When** it is Reset, **Then** the title shows only the app name.
2. **Given** a fresh browser profile where notification permission was never asked, **When** the app is loaded, **Then** no permission prompt appears; **When** the user presses Start for the first time, **Then** the prompt appears; **and Given** the user denied it, **When** further Intervals are started and end, and the page is reloaded, **Then** the app never shows the prompt again on its own, a persistent non-blocking "system notifications are off" indicator with enabling instructions and a "request again" button is visible, and the Completion Sound and tab title still announce every Interval end.
3. **Given** two tabs of the app are open in the same browser and the user pressed Start in tab A, **When** the user watches tab B, **Then** tab B shows the same Timer State and remaining time immediately; **and When** the Work Interval ends, **Then** exactly one notification and one sound occur (from tab A), exactly one Pomodoro Record is written, and tab B shows the Break without alerting; **and When** the app is opened in a different browser, **Then** it shows the stored Pomodoro Records and an Idle timer.
4. **Given** the sound cannot be prepared or played (for example audio output is blocked by the browser), **When** an Interval ends, **Then** a non-blocking "sound unavailable" indicator is shown, the notification and the tab title still announce the end, and nothing repeats.
5. **Given** the app runs from `http://localhost:3000` in current Chrome and, separately, current Safari on macOS, **When** the manual checklist is run, **Then** every item passes:
   - the title keeps counting down in a background tab hidden for more than 5 minutes;
   - with a 1-minute Work Interval, the notification appears within 2 seconds of the end from a hidden tab, and again from behind a fullscreen app;
   - the notification text names the Task and the started Break (Work Interval end) or the Task of the next Pomodoro or "waiting for Start" (Break end);
   - activating the notification brings the app tab to the front;
   - the Completion Sound plays within 2 seconds of the end in a background tab;
   - with permission denied, the indicator and retry button appear and no prompt is shown automatically;
   - with two tabs open, only the tab that pressed Start alerts, and the other mirrors the state.

## Depends on

- [FT-7](https://cyber-sun.atlassian.net/browse/FT-7)

## Out of scope

- The title marker that an Interval ended while the user was away, and the summary shown on returning to the app.
- The setting to turn the Completion Sound on or off.
- Alerts while the app is closed.

## Open questions

- If the owner tab is closed while another tab of the same browser stays open with an Interval Running, no tab issues the Alert at its end under the owner-only rule. Should a remaining tab take over ownership (for example, the first tab that notices the owner is gone), or is a silent end acceptable, with the title still showing the state?

## References

- epic-prd: [prd.md](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md)
- epic-architecture: [pomodoro-tracker-architecture.md](/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md)
