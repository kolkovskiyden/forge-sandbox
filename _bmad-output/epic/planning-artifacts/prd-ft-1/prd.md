---
title: Pomodoro tracker — PRD
status: final
created: 2026-09-24
updated: 2026-09-24
ticket: FT-3
parent_ticket: FT-1
---

# PRD: Pomodoro tracker

## 0. Document Purpose

This PRD defines the first version of Pomodoro tracker, the product scoped by Jira epic FT-1. It is written for the author as product owner and for the downstream AI Forge stages: UX design, architecture, and decomposition of FT-1 into Stories. It builds on the approved product brief (FT-2) at `_bmad-output/epic/planning-artifacts/briefs/brief-forge-sandbox-2026-09-24/` and does not repeat its problem analysis or landscape research. Vocabulary is anchored in the Glossary (§3); features are grouped in §4 with globally numbered functional requirements (FR-N); decisions on points the brief left open or did not cover are stated in place and listed in §12.

`[NOTE FOR PM]` The Jira description of FT-1 does not yet mention the growing tree or the notification requirement. This PRD absorbs both; the epic description should be updated to match once this PRD is accepted.

**Status.** Final. Reviewed by the author on 2026-09-24; the draft's two open questions were decided (§11) and its assumptions confirmed (§12).

## 1. Vision

Pomodoro tracker is a personal web app for focused work. You pick a Task, start a Pomodoro, and go work in your IDE, browser, or Slack. The app's central job is to make sure you always know whether a Pomodoro is running and cannot miss its end: the remaining time stays visible outside the app tab, and every Interval end is announced with a system notification and a sound. When the Work Interval ends, the Break starts by itself, and when the Break ends, the next Pomodoro starts by itself if you are there to see it; if you were away, the timer waits for you.

Every finished Pomodoro is stored on a server, so history and statistics survive browser restarts without an account or login. Each Task has its own Tree that grows with every Completed Pomodoro on that Task. The Tree is the primary statistic: the time you invested in a Task, visible at a glance, backed by per-day and per-week numbers when you want them. The product is timer-first: the timer and the Current Task's Tree are what you see; tables come second.

The product is built for one person's real failure mode, not for a market, and it will never carry ads, a paywall, or a premium tier. It is also the vehicle for adopting AI Forge end to end, so its scope is deliberately small and its features are meant to decompose into a handful of independent Stories.

## 2. Target User

The only user is the author: a busy person working on a MacBook who starts a Pomodoro on a Task and then lives in other windows. There are no secondary users, no team, and no visitors. The target environment is a desktop browser on macOS. Tasks here are labels for Pomodoros, not a to-do system.

### 2.1 Jobs To Be Done

- Functional: run work and break intervals on a chosen Task without babysitting a timer.
- Functional: never miss the end of an Interval, even in a fullscreen IDE or a meeting.
- Functional: see how much focused time went into each Task today and this week.
- Emotional: feel that time invested in a Task accumulates into something visible, rather than evaporating.
- Contextual: keep the history across browser restarts and reinstalls without creating an account.

### 2.2 Key User Journeys

- **UJ-1. Denis starts a Pomodoro and disappears into the IDE.**
  Denis has the app open in a Chrome tab; no login. He picks the Task "FT-1 PRD" in the Task Picker, presses Start, and switches to a fullscreen IDE. The browser tab title now reads the remaining time and the Task name, so a glance at the tab strip tells him a Pomodoro is running. Twenty-five minutes later, while he is still in the IDE, a macOS notification says the Pomodoro is done and a five-minute Short Break has started, and a sound plays. He stands up. When he comes back to the tab, the Break countdown is running and the Tree of "FT-1 PRD" is one Growth Step taller. **Edge case:** it is his first Pomodoro in this browser, so pressing Start triggered the notification permission prompt; he allowed it before switching windows.

- **UJ-2. Denis comes back late.**
  Denis started a Pomodoro at 14:00, then got pulled into a call that ran long. He returns to the tab at 14:50. The app does not show a stale or negative countdown. It tells him in one glance what happened: the Pomodoro on "FT-1 PRD" was Completed at 14:25, the Short Break ended at 14:30 while he was away, and the timer is Idle, waiting for him. His record for the Day is correct without any action. **Edge case:** during the call his laptop lid was closed for ten minutes; nothing about the record or the summary depends on ticks that were skipped, because every time shown is computed from the clock.

- **UJ-3. Friday glance.**
  Friday afternoon, Denis opens the Week view. He sees the number of Completed Pomodoros and Focus Time for each Day of the Week, broken down by Task, and the Task List shows that "FT-1 PRD" has the tallest Tree. He marks the Task Done. Its Tree stops growing and moves to the Garden; the Task disappears from the Task Picker.

## 3. Glossary

Downstream documents must use these terms exactly.

- **Task** — a user-named label that Pomodoros are recorded against. A Task is Open or Done. Each Task has exactly one Tree.
- **Current Task** — the Open Task selected in the app; a Pomodoro is always started on the Current Task.
- **Task Picker** — the control for choosing the Current Task. It lists Open Tasks only.
- **Task List** — the view of all Open Tasks with their Trees and numbers of Completed Pomodoros.
- **Garden** — the view of the Trees of Done Tasks.
- **Interval** — a countdown, either a Work Interval or a Break; it is Running or Paused.
- **Work Interval** — the countdown of a Pomodoro; default length 25 minutes.
- **Pomodoro** — one Work Interval started on a Task, together with its outcome. Its outcome is Completed or Interrupted. Every Pomodoro that ends is stored as a Pomodoro Record.
- **Completed** — outcome of a Pomodoro whose Work Interval ran for its full configured length. Paused time does not count toward that length.
- **Interrupted** — outcome of a Pomodoro that was reset before its Work Interval finished.
- **Break** — the countdown between Pomodoros, either a Short Break or a Long Break. Breaks are not stored.
- **Short Break** — the Break after a Completed Pomodoro that does not end a Cycle; default length 5 minutes.
- **Long Break** — the Break after the Completed Pomodoro that ends a Cycle; default length 15 minutes.
- **Cycle** — the sequence of Completed Pomodoros since the last Long Break, counted across all Tasks; the fourth Completed Pomodoro in a Cycle ends it with a Long Break.
- **Pomodoro Record** — the stored fact of one Pomodoro: Task, start time, end time, outcome, and Focus Time counted.
- **Focus Time** — the sum of Work Interval time of Completed Pomodoros, excluding paused time. Interrupted Pomodoros contribute no Focus Time.
- **Tree** — the visual growth object of a Task. It gains one Growth Step for every Completed Pomodoro on that Task and never shrinks.
- **Growth Step** — one increment of a Tree's growth, produced by exactly one Completed Pomodoro. A Tree's size is its number of Growth Steps.
- **Timer State** — one of Idle (no Interval), Running, or Paused.
- **Unseen End** — an Interval end that happened while the app tab was not both visible and focused, and after which the user has not yet acted in the app. An end counts as seen if the tab was visible and the window focused at that moment, or if the user acts in the app within 60 seconds after it.
- **Alert** — the announcement of an Interval end: a system notification, a Completion Sound, and the tab title change.
- **Completion Sound** — the sound played when an Interval ends, if enabled in Settings.
- **Day** — a calendar day in the browser's local time zone, from midnight to midnight. A Pomodoro belongs to the Day on which it started. Local midnight, attribution by start time; no configurable day start.
- **Week** — Monday to Sunday in local time. Monday start; no Sunday-start option.
- **Settings** — the user-configurable values: Work Interval, Short Break, and Long Break lengths, and Completion Sound on or off.

## 4. Features

### 4.1 Timer

**Description:** The timer runs one Interval at a time on the Current Task: a Work Interval, then a Break, then the next Work Interval, without the user having to press anything. The user can Start, Pause, Resume, and Reset. The timer never shows a wrong remaining time, whatever the browser did to the tab in the meantime. Realizes UJ-1 and UJ-2.

Transitions at a glance (details in FR-1 to FR-6):

| From | Event | To | Pomodoro Record written | Alert |
|---|---|---|---|---|
| Idle | Start | Running Work Interval | none (start time noted) | no |
| Running Work Interval | Pause / Resume | Paused / Running Work Interval | none | no |
| Running or Paused Work Interval | Reset | Idle | Interrupted | no |
| Running Work Interval | time is up | Running Short or Long Break | Completed | yes |
| Running Break | Pause / Resume | Paused / Running Break | none | no |
| Running or Paused Break | Reset | Idle | none | no |
| Running Break | time is up, Break end seen | Running Work Interval on the Current Task | none (new start time noted) | yes |
| Running Break | time is up, Break end is an Unseen End | Idle | none | yes; return-to-app summary (FR-15) |
| Paused Work Interval | 30 minutes Paused | Idle | Interrupted | no; return-to-app summary (FR-15) |
| Paused Break | 30 minutes Paused | Idle | none | no |
| App closed, Work Interval end passed | app opened | Idle | Completed at scheduled end | no; return-to-app summary (FR-15) |
| App closed, Break end passed | app opened | Idle | none | no; return-to-app summary (FR-15) |

#### FR-1: Start a Pomodoro
The user can start a Pomodoro on the Current Task when the Timer State is Idle.
**Consequences (testable):**
- If no Current Task is selected, Start is unavailable and the app asks the user to pick or create a Task.
- On Start, a Work Interval begins with the configured Work Interval length, and the Pomodoro's start time is recorded.
- The Current Task cannot be changed while an Interval is Running or Paused; changing it requires a Reset first.

#### FR-2: Pause and resume
The user can pause a Running Interval and resume it later.
**Consequences (testable):**
- While Paused, the remaining time does not change, and the app and tab title show the Paused state.
- Paused time is not counted toward the Work Interval length or Focus Time.
- A Pomodoro Paused for 30 minutes without being resumed ends as Interrupted at that moment; a Pomodoro Record is stored with outcome Interrupted and the return-to-app summary (FR-15) reports it. A Break Paused for 30 minutes ends, and the Timer State becomes Idle.

#### FR-3: Reset
The user can reset the Running or Paused Interval.
**Consequences (testable):**
- Resetting a Work Interval ends the Pomodoro as Interrupted; a Pomodoro Record is stored with the actual end time and outcome Interrupted.
- Resetting a Break ends the Break. Reset is the only way to leave a Break early; the brief's stance is that the user takes the Break the app gives, so there is no skip-Break control.
- After either Reset the Timer State is Idle with the Work Interval length ready, and the Current Task can be changed.

#### FR-4: Automatic transition to a Break
When a Work Interval reaches its full length, the Pomodoro is Completed and a Break starts by itself.
**Consequences (testable):**
- The Pomodoro Record with outcome Completed is stored, locally at minimum (FR-18), before the Break is shown as Running, and submitted to the server per FR-16.
- The Break is a Long Break if this Pomodoro is the fourth Completed Pomodoro in the current Cycle; otherwise it is a Short Break.
- Interrupted Pomodoros do not advance the Cycle, and the Cycle resets at the start of each Day.

#### FR-5: Automatic transition from a Break to the next Pomodoro
When a Break reaches its full length, the app issues the Alert and, if the user is there to see the Break end, the next Pomodoro starts by itself on the Current Task. This bounds the brief's "automatic transition work → break → work" so that a Pomodoro never runs with nobody working.
**Consequences (testable):**
- The Alert for the Break end is issued (FR-11 to FR-14).
- If the app tab is visible and focused when the Break ends, the next Work Interval starts at that moment with the configured Work Interval length, and its start time is recorded.
- If the tab is brought to the front within 60 seconds after the Break end, for example by activating the notification, the next Work Interval starts at that moment instead.
- Otherwise the Break end is an Unseen End: the Timer State becomes Idle, and the return-to-app summary (FR-15) says the Break ended and the timer is waiting for Start.
- If the Current Task is Done when the Break ends (a state FR-10 should prevent) or no Current Task exists, the Timer State becomes Idle.

#### FR-6: Remaining time is always true
The displayed remaining time is derived from the Interval's start time and the clock, never from counted ticks.
**Consequences (testable):**
- After the tab was in the background, the browser was minimized, or the laptop was asleep, the remaining time shown on return is within 1 second of the true remaining time.
- While the app is open, an Interval end is detected within 2 seconds of its scheduled end, in a background tab as well.
- The app never displays a negative remaining time.
- If a Work Interval's scheduled end passed while the app was not open at all (tab closed or browser quit), the Pomodoro is stored as Completed with its scheduled end time when the app is next opened, and the Timer State is Idle; no Break or next Pomodoro is started retroactively. If a Break's scheduled end passed while the app was closed, the Timer State is Idle. If a Paused Pomodoro's 30-minute time-out (FR-2) passed while the app was closed, it is stored as Interrupted at the time-out moment. A Pomodoro that ran out while the app was closed counts as Completed rather than Interrupted.

**Notes:** Desktop browsers slow timers in hidden tabs down to once per minute after a few minutes in the background. Ordinary browser behavior of this kind must not make the timer late or wrong; the concrete mechanisms belong to architecture (see `addendum.md`).

### 4.2 Tasks

**Description:** Tasks are the labels Pomodoros are recorded against. They are created and picked in the app, renamed when needed, and marked Done when finished. Tasks are never deleted, so history and Trees stay consistent. Realizes UJ-1 and UJ-3.

#### FR-7: Create a Task
The user can create a Task by entering a name.
**Consequences (testable):**
- A Task name is required and is trimmed. At most 100 characters, and a name equal to an existing Open Task's name, ignoring letter case, is rejected.
- A new Task is Open, has a Tree with zero Growth Steps, and can be selected as the Current Task immediately.

#### FR-8: Select the Current Task
The user can pick any Open Task in the Task Picker as the Current Task when the Timer State is Idle.
**Consequences (testable):**
- The Task Picker lists Open Tasks only; Done Tasks do not appear in it.
- The Current Task is remembered across reloads and browser restarts.

#### FR-9: Rename a Task
The user can rename an Open or Done Task. Renaming is not in the brief; it is added because Tasks cannot be deleted and a typo would otherwise be permanent.
**Consequences (testable):**
- Existing Pomodoro Records and the Tree stay attached to the renamed Task; statistics show the new name.
- The same name rules as FR-7 apply.

#### FR-10: Mark a Task Done and reopen it
The user can mark an Open Task as Done and reopen a Done Task.
**Consequences (testable):**
- A Task cannot be marked Done while any Interval is Running or Paused on it; the user must Reset first.
- A Done Task keeps all Pomodoro Records and its Tree; it appears in the Garden and in statistics for the Days it has Pomodoros.
- Reopening restores the Task to the Task Picker and Task List; its Tree continues from its current number of Growth Steps.
- `[NON-GOAL for MVP]` Deleting a Task, along with its records, is not offered.

### 4.3 Alerts and visibility

**Description:** This feature is the reason the product exists. Outside the app tab, the user can always tell whether an Interval is running and roughly how much is left, and the end of every Interval is announced so that it cannot be missed from another application. When the user returns to the tab, the app tells them what happened while they were away. The brief names the three channels (tab title, system notification, and sound); this section states what each must achieve, and UX and architecture decide how. Realizes UJ-1 and UJ-2.

#### FR-11: Tab title shows state and remaining time
The browser tab title reflects the Timer State at all times.
**Consequences (testable):**
- While an Interval is Running, the title contains the remaining time and distinguishes a Work Interval from a Break; while a Work Interval is Running, it also contains the Current Task name.
- In a foreground tab the title updates every second; in a background tab it updates at least once per minute, and the minutes shown are never more than one minute stale.
- When Paused, the title shows the Paused state; when Idle, the title shows the app name without a countdown.
- While an Unseen End exists, the title also shows that an Interval ended.

#### FR-12: System notification at Interval end
When notifications are permitted, a macOS notification is shown at the end of every Interval.
**Consequences (testable):**
- The notification appears within 2 seconds of the Interval end, including when the tab is in the background or the browser window is behind other windows. 2 seconds is the latency bound for all Alert channels.
- For a Work Interval end, the notification names the Task and says which Break has started and how long it is; for a Break end, it names the Task the next Pomodoro started on.
- Activating the notification brings the app tab to the front. Alerts are issued by the instance that started the Interval (see §7, One live instance).
- A macOS Focus mode or Do Not Disturb may suppress the notification, so the app never relies on it alone: the tab title, the Completion Sound, and the return-to-app summary (FR-11, FR-14, FR-15) each carry the Interval end on their own.

#### FR-13: Notification permission handling
The app asks for notification permission at the right moment and is honest when it does not have it. This requirement is derived from "cannot miss its end"; the brief does not discuss permissions.
**Consequences (testable):**
- Permission is requested from a user action, the first time the user presses Start, not on page load.
- If permission is denied or notifications are unsupported, the app shows a persistent, non-blocking indicator that system notifications are off, with instructions for enabling them in the browser and a button to request permission again; the Completion Sound and tab title still work.
- The app never asks for permission on its own again once it was denied; only the button does.

#### FR-14: Completion Sound
When the Completion Sound is enabled, a sound plays at the end of every Interval.
**Consequences (testable):**
- The sound plays within 2 seconds of the Interval end, including when the tab is in the background.
- One built-in sound, at system volume; no sound picker or volume control in v1.
- Browsers block sound until the page has been interacted with; pressing Start counts as that interaction. If the sound still cannot play, the app shows the same kind of non-blocking indicator as FR-13, saying that sound is unavailable.

#### FR-15: Return-to-app summary
When the user returns to the tab while an Unseen End exists, the app shows what happened. This capability is derived from the brief's failure mode "the pomodoro ended a while ago and nobody noticed"; it is not in the brief's Solution.
**Consequences (testable):**
- The app shows the last Pomodoro's Task, outcome, and end time; whether a Break followed and when it ended; whether a new Pomodoro started automatically and when, or that the timer is waiting for Start; and the current Timer State, without the user navigating anywhere.
- The summary disappears once the user acts (Start, Reset, or dismiss); it is not shown when no Unseen End exists.

### 4.4 Pomodoro history and persistence

**Description:** Every Pomodoro that ends becomes a Pomodoro Record on the server. A Running or Paused Pomodoro survives reloads and browser restarts. A Completed Pomodoro is never lost merely because the server was briefly unreachable. This is what makes the statistics and Trees trustworthy. Realizes UJ-2 and UJ-3.

#### FR-16: Store every Pomodoro Record on the server
Each Pomodoro that ends, Completed or Interrupted, is stored on the server.
**Consequences (testable):**
- A Pomodoro Record has the Task, start time, end time, outcome, and Focus Time counted (zero for Interrupted).
- After the browser is closed and reopened, or the app is opened in another browser on the same machine, the same Pomodoro Records are shown.
- A server restart does not lose any Pomodoro Record.

#### FR-17: A Running or Paused Pomodoro survives reload
Reloading or reopening the app while a Pomodoro is Running or Paused restores it. Derived from "you always know whether a pomodoro is running"; the brief does not mention reloads.
**Consequences (testable):**
- After a reload, the app shows the same Task, Timer State, and the true remaining time; if the scheduled end passed while the app was closed, FR-6 applies.

#### FR-18: No loss when the server is unreachable
If the server cannot be reached when a Pomodoro ends, the Pomodoro Record is not lost.
**Consequences (testable):**
- The record is kept in the browser and submitted when the server is reachable again; no duplicate record results from retries.
- The app shows an unobtrusive "not saved yet" indicator while unsaved records exist and clears it once they are stored.
- The timer keeps working while the server is unreachable; starting the next Interval is not blocked.
- The single-user setup makes the server occasionally unreachable (for example, it was not started); the brief's success criterion "no finished pomodoro goes unrecorded" is taken to cover this case.

### 4.5 Tree per Task

**Description:** Each Task has one Tree. The Tree gains a Growth Step for every Completed Pomodoro on that Task and never shrinks. Interrupted Pomodoros are recorded but do not grow it; the Tree is never punitive. The Tree is shown wherever the Task is shown, so the time invested in a Task is visible at a glance and comes before numbers. Realizes UJ-1 and UJ-3.

#### FR-19: A Tree grows with Completed Pomodoros
Each Task has exactly one Tree whose number of Growth Steps equals the number of Completed Pomodoros on that Task.
**Consequences (testable):**
- Creating a Task creates its Tree with zero Growth Steps.
- Each Completed Pomodoro adds exactly one Growth Step; Interrupted Pomodoros leave the Tree unchanged.
- The Tree counts every Completed Pomodoro Record, including records not yet submitted to the server (FR-18); after those records are submitted and the app is reloaded, the Tree is unchanged.

#### FR-20: The Tree is visible where the Task is
The Tree is shown with the Current Task during an Interval and next to every Task in the Task List, with the Task's number of Completed Pomodoros.
**Consequences (testable):**
- Each of at least the first 10 Growth Steps produces a visible change in the Tree. 10 is the minimum; the visual design of stages is a UX decision.
- Beyond the visibly distinct stages, the Tree keeps growing without an upper bound, and the Completed Pomodoro count next to it keeps rising. No growth cap in v1; this answers the brief's growth-cap question.

#### FR-21: Garden of Done Tasks
The user can open the Garden and see the Trees of Done Tasks.
**Consequences (testable):**
- The Garden shows every Done Task with its Tree, name, number of Completed Pomodoros, and the date it was marked Done. This answers the brief's question about finished Tasks: the Tree stops growing and stays visible; ordering is most recently Done first.
- The Garden is reached from the Task List, and a Task can be reopened from the Garden (FR-10).

### 4.6 Statistics

**Description:** Statistics answer two questions: how much did I focus today, and how did the week go, per Task. Counts and Focus Time come only from Completed Pomodoros; Interrupted Pomodoros are shown separately, so they are not forgotten, but they are not counted. Realizes UJ-3.

#### FR-22: Today at a glance
The main screen always shows today's number of Completed Pomodoros and today's Focus Time.
**Consequences (testable):**
- The two values update as soon as a Pomodoro is Completed, without a reload, including for records not yet submitted to the server (FR-18).
- They cover the current Day, and they sit alongside, not above, the timer and the Current Task's Tree.

#### FR-23: Day view
The user can view any Day's statistics.
**Consequences (testable):**
- For the selected Day the view shows Completed Pomodoros and Focus Time in total and per Task, the number of Interrupted Pomodoros, and the list of that Day's Pomodoros with start time, Task, and outcome.
- The user can move to the previous and next Day; Days without Pomodoros show zeros.

#### FR-24: Week view
The user can view any Week's statistics.
**Consequences (testable):**
- For the selected Week the view shows Completed Pomodoros and Focus Time per Day and per Task, and Week totals.
- The user can move to previous and next Weeks.
- No monthly or yearly views, and no charts beyond a per-day breakdown, in v1.

### 4.7 Settings

**Description:** A small set of values the user can change: Interval lengths and the Completion Sound. Settings live on the server like everything else, so they survive a browser reinstall.

#### FR-25: Interval lengths
The user can set the Work Interval, Short Break, and Long Break lengths.
**Consequences (testable):**
- Defaults are 25, 5, and 15 minutes. Allowed ranges are 1 to 90 minutes for the Work Interval and 1 to 60 minutes for each Break, in whole minutes.
- A change applies to the next Interval that starts; a Running or Paused Interval keeps the length it started with.
- `[NON-GOAL for MVP]` The Long Break cadence is fixed at every fourth Completed Pomodoro and is not configurable.

#### FR-26: Completion Sound on or off
The user can turn the Completion Sound on or off.
**Consequences (testable):**
- The default is on.
- When off, no sound plays at Interval ends; the notification and tab title Alerts are unaffected.

#### FR-27: Settings persist
Settings are stored on the server and apply in any browser on the machine.
**Consequences (testable):**
- After a browser reinstall, Settings are unchanged.
- Settings are a single server-side set, since there is one user.

## 5. Aesthetic and Tone

- **Imagery.** Two images carry the product: the tomato of the Pomodoro technique, and the Tree that grows per Task. The tomato is the author's original core idea and did not make it into the brief; UX should treat it as the visual motif of the timer.
- **Timer-first.** The timer and the Current Task's Tree are the first and largest things on screen. Statistics are one step away, never in front.
- **Calm.** One notification and one sound per Interval end; no nags, reminders, streak warnings, upsells, or ads. Product text is short and plain.
- **Non-punitive.** An Interrupted Pomodoro is recorded and visible, but nothing withers, dies, or is lost.

## 6. Cross-Cutting Non-Functional Requirements

- **Timer accuracy.** See FR-6: remaining time within 1 second of the true remaining time, Interval end detected within 2 seconds.
- **Alert latency.** See FR-12 and FR-14: notification and Completion Sound within 2 seconds of the Interval end.
- **Durability.** No stored Pomodoro Record or Setting is lost on browser restart, server restart, or machine reboot (FR-16, FR-18, FR-27).
- **Browser support.** Current Chrome and Safari on macOS are supported; Firefox is best effort. Chrome is the author's primary browser; Safari second.
- **Keyboard operability.** Start, Pause, Resume, and Reset are reachable from the keyboard; no formal accessibility standard is targeted.
- **Privacy.** The app makes no runtime calls to third-party services and collects no telemetry.

## 7. Constraints and Guardrails

- **Shape.** A browser single-page app backed by a small REST API with persistent storage, as FT-1 states. The stack is decided in architecture; the brief's preference is recorded in `addendum.md`.
- **Single user, no authentication.** The app runs on the author's machine or on a host reachable only by the author. The server is not exposed to the public internet; if it ever is, authentication becomes a prerequisite and this PRD must be updated.
- **One live instance.** A second open tab of the same browser shows the same state, but only the instance that started the Interval issues Alerts; controlling the timer from two instances at once is not supported. Another browser shows the same Pomodoro Records (FR-16) but not a Running or Paused Interval.
- **Data ownership.** All data stays on infrastructure the author controls; there is no cloud dependency at runtime.
- **Cost.** Zero recurring cost beyond the author's own machine.
- **Learning-project scope.** Features are shaped to decompose into a handful of independent Stories; scope growth that adds dependencies between Stories should be resisted.

## 8. Non-Goals (Explicit)

- Multi-user support, registration, login, or any access control.
- Monetization of any kind: no ads, no paywall, no premium tier.
- Mobile or tablet apps, and mobile browser layouts.
- Integrations with external task trackers, calendars, or time-tracking tools.
- Data export or import.
- Cross-device synchronization or a hosted multi-tenant service.
- Gamification beyond the Tree itself: no streaks, achievements, coins, or leaderboards.
- Task-manager features: subtasks, due dates, priorities, projects, notes.
- Native desktop app, menu-bar app, or browser extension.
- Analytics or telemetry about the author's usage.

## 9. MVP Scope

### 9.1 In Scope

Everything below is in v1. The priority column says what is cut first if the learning-project timebox bites. The tiering is the author's; the brief ranks nothing.

| Feature group | FRs | Priority |
|---|---|---|
| Timer | FR-1 to FR-6 | Core |
| Alerts and visibility | FR-11 to FR-15 | Core |
| Pomodoro history and persistence | FR-16 to FR-18 | Core |
| Tasks | FR-7 to FR-10 | Core |
| Tree per Task (without the Garden) | FR-19, FR-20 | Keep |
| Today at a glance, Day view | FR-22, FR-23 | Keep |
| Week view | FR-24 | First to cut |
| Garden | FR-21 | First to cut |
| Settings screen (defaults stay in place) | FR-25 to FR-27 | First to cut |

### 9.2 Out of Scope for MVP
- Everything in §8.
- Skipping a Break (FR-3).
- Deleting Tasks or Pomodoro Records (FR-10); it complicates Tree and statistics consistency for no v1 benefit.
- Configurable Long Break cadence (FR-25) and configurable day start (§3 Day); low value for one user.
- Multiple or custom Completion Sounds (FR-14).
- Monthly and yearly statistics, charts beyond a per-day breakdown (FR-24); deferred until a month of real data exists.
- Editing past Pomodoro Records (for example, changing the Task after the fact). `[NOTE FOR PM]` This may become wanted quickly if the author often starts a Pomodoro on the wrong Task; revisit after two weeks of use.

## 10. Success Metrics

The brief's process criterion, completing the full AI Forge cycle on FT-1 through merged Stories, is tracked outside this PRD. The product metrics below are checked against a short daily note the author keeps during the trial week, because the app collects no telemetry.

**Primary**
- **SM-1: The record is right.** Over 7 consecutive Days of real use, every Pomodoro the author finished appears as a Completed Pomodoro Record, and no Completed Pomodoro Record exists for time the author did not work; target zero missing and zero phantom. Validates FR-4, FR-5, FR-6, FR-16, FR-17, FR-18.
- **SM-2: No missed Interval ends.** Over the same 7 Days, the author's note records every Interval end they noticed more than 2 minutes late while at the computer; target zero. Validates FR-11 to FR-15.

**Secondary**
- **SM-3: Replacement.** The author uses the app for their own focused work on at least 4 Days per Week for 4 consecutive Weeks and has stopped using whatever they counted Pomodoros with before. The brief says "over a week of use"; 4 Days for 4 Weeks is this PRD's stricter reading. Validates the product as a whole.

**Counter-metrics (do not optimize)**
- **SM-C1: Pomodoros per Day.** A high count is not a goal; the app must not encourage starting Pomodoros to make numbers or Trees grow. Counterbalances SM-3 and guards the bounded automatic start (FR-5).
- **SM-C2: Alert volume.** Alerts per Interval stay at one notification and one sound; no reminders, nags, or repeated notifications. Counterbalances SM-2.

## 11. Open Questions

None. The draft raised two, and the author decided both on 2026-09-24:

1. **Automatic start after a Break** is bounded to a seen Break end (FR-5). Rationale: the record must never contain a Pomodoro nobody worked; when the user is present the transition is still automatic, and when they are away the Alert, the tab title, and the return-to-app summary cover the "next interval never starts" failure the brief names.
2. **Long pauses** end after 30 minutes (FR-2): a Paused Pomodoro becomes Interrupted, a Paused Break becomes Idle. Rationale: a pause that long is a context switch, and an Interrupted record is more honest than a Pomodoro Completed hours later.

## 12. Decisions Confirmed in Author Review

*Points the brief left open or did not cover. Each was decided in the draft, is stated as a plain requirement in the section cited, and was confirmed by the author on 2026-09-24.*

- §3 Completed — paused time does not count toward the Work Interval length.
- §3 Unseen End — an end counts as seen if the tab was visible and focused at that moment, or the user acts in the app within 60 seconds after it.
- §3 Day — local midnight boundary, attribution by start time, no configurable day start.
- §3 Week — Monday to Sunday.
- §4.1 FR-1 — the Current Task is locked while an Interval is Running or Paused.
- §4.1 FR-2 — a Pomodoro Paused for 30 minutes ends as Interrupted; a Paused Break ends after 30 minutes.
- §4.1 FR-3 — Reset is the only way to leave a Break early; no skip-Break control.
- §4.1 FR-4 — Interrupted Pomodoros do not advance the Cycle; the Cycle resets each Day.
- §4.1 FR-6 — remaining time is accurate to 1 second.
- §4.1 FR-6 — a Pomodoro that ran out while the app was closed counts as Completed (answers a brief question).
- §4.2 FR-7 — Task names are at most 100 characters and unique among Open Tasks, ignoring letter case.
- §4.2 FR-9 — renaming is added beyond the brief because Tasks cannot be deleted.
- §4.3 FR-12 — 2 seconds is the latency bound for all Alert channels.
- §4.3 FR-13 — permission handling is derived from "cannot miss its end".
- §4.3 FR-14 — one built-in Completion Sound at system volume.
- §4.3 FR-15 — the return-to-app summary is derived from the brief's first failure mode.
- §4.4 FR-17 — Running-Pomodoro recovery is derived from "you always know whether a pomodoro is running".
- §4.4 FR-18 — "no finished pomodoro goes unrecorded" covers a temporarily unreachable server.
- §4.5 FR-20 — at least the first 10 Growth Steps are visibly distinct; stage design is a UX decision.
- §4.5 FR-20 — no growth cap in v1 (answers a brief question).
- §4.5 FR-21 — the Tree of a Done Task stops growing and stays visible in the Garden, most recently Done first (answers a brief question).
- §4.6 FR-24 — no monthly or yearly views and no charts beyond a per-day breakdown in v1.
- §4.7 FR-25 — Interval length ranges are 1 to 90 minutes (work) and 1 to 60 minutes (breaks).
- §4.7 FR-27 — Settings are a single server-side set.
- §6 — Chrome is the primary browser, Safari second, Firefox best effort.
- §7 — the server is not exposed to the public internet.
- §7 — one live instance controls the timer and issues Alerts.
- §7 — zero recurring cost beyond the author's machine.
- §9.1 — the Core / Keep / First-to-cut tiering.
- §10 SM-2 — 2 minutes is the missed-end threshold.
- §10 SM-3 — 4 Days per Week for 4 Weeks is a stricter reading of the brief.
