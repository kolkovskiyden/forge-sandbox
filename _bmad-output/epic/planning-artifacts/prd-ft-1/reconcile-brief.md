---
title: Pomodoro tracker — Brief → PRD reconciliation
status: draft
created: 2026-09-24
input: brief-forge-sandbox-2026-09-24 (brief.md, addendum.md, .memlog.md)
target: prd-ft-1 (prd.md, addendum.md)
---

# Reconciliation: product brief FT-2 → PRD FT-3

Legend for each item: **(a)** captured in prd.md, **(b)** captured in PRD addendum.md, **(c)** intentionally dropped with a visible reason, **(d)** silently missing. "Brief" = brief.md unless prefixed "Brief addendum" or "Memlog".

## Captured

### Executive Summary
- Brief: "personal web app for focused work" → (a) PRD §1 Vision, first sentence.
- Brief: "start a 25-minute pomodoro on a task" → (a) §3 Glossary *Work Interval* (default 25), FR-1.
- Brief: "take the break the app tells you to" → (a) FR-4 automatic transition to Break; §1 "the break starts by itself".
- Brief: "watch a tree grow for every pomodoro you finish on that task" → (a) §1, §4.5 description, FR-19.
- Brief: "recorded on a server ... survive browser restarts without any account or login" → (a) §1 paragraph 2, FR-16, §6 "Single user, no authentication".
- Brief: "a timer disappears from attention the moment you switch to the IDE, the browser, or Slack" → (a) §1 "go work in your IDE, browser, or Slack"; §2.1 JTBD; UJ-1.
- Brief: "you always know whether a pomodoro is running, and you cannot miss its end" as the central job → (a) §1 "The app's central job is that you always know whether a Pomodoro is running and you cannot miss its end"; §4.3 description "This feature is the reason the product exists".
- Brief: "the growing tree turns the time you invested in a task into something you can see at a glance" → (a) §1 "the time you invested in a Task, visible at a glance"; §4.5 description; §2.1 emotional JTBD.
- Brief: "learning project for adopting AI Forge end to end, so its scope is deliberately a handful of independent Stories" → (a) §1 last paragraph; §6 "Learning-project scope"; (b) addendum "Pointers for decomposition".

### The Problem
- Brief: "busy person working on a MacBook ... lives in other windows" → (a) §2 Target User; UJ-1.
- Brief failure mode 1: "pomodoro ended a while ago and nobody noticed. The break is skipped, the next interval never starts, and the record of the work is lost or wrong" → (a) UJ-2; FR-15 return-to-app summary; FR-5 NOTE FOR PM names "the 'next interval never starts' failure the brief names"; SM-1, SM-2.
- Brief failure mode 2: "unclear whether a pomodoro is running at all, so the person either starts a duplicate or stops tracking" → (a) §1; FR-11 tab title at all times; FR-1 "when no Interval is running" (prevents duplicates, implicitly).
- Brief: competitor analysis (Pomofocus, Focus To-Do, account/paid tier) → (c) PRD §0: "does not repeat its problem analysis or landscape research"; (b) addendum Inputs points to the brief addendum.
- Brief complaint: "lost history without an account" → (b) addendum "Options considered and rejected: Local-only storage".
- Brief complaint: "notifications that do not fire" → (a) FR-12 latency, FR-13 permission honesty, FR-12 "does not depend on it as the only signal".
- Brief addendum complaint: "timers running negative, wrong break durations" → (a) FR-6 "never displays a negative remaining time"; FR-4 Long/Short Break rule; FR-24 "a running or paused Interval keeps the length it started with".

### Who This Serves
- Brief: "busy person working on a MacBook ... keeps losing track of the timer once they switch windows" → (a) §2.
- Brief: "Desktop browser on macOS is the only target environment for the first version" → (a) §2; §5 Browser support; §2.2 Non-Users.
- Brief: "The concrete persona is the author; there are no secondary users" → (a) §2 "The only user is the author"; §2.2.

### The Solution
- Brief: "A browser SPA backed by a small REST API with persistent storage, for one user, with no registration" → (a) §1/§6 for one user, no registration; (b) SPA + REST shape only in addendum Inputs and "Options considered and rejected: Native menu-bar app" ("the epic is explicitly a browser SPA plus REST API"). Not restated in PRD §6 Constraints — see Silently missing (partial).
- Brief: "Work interval (25 min by default) and break (5 min; every 4th break is a long one, 15 min)" → (a) Glossary *Break*, *Cycle*; FR-4; FR-24 defaults 25/5/15.
- Brief: "Start, pause, reset" → (a) FR-1, FR-2, FR-3 (PRD adds Resume).
- Brief: "Automatic transition work → break → work" → (a) FR-4 (work → break, unconditional) and FR-5 (break → work, tagged `[ASSUMPTION]` and Open Question 1). See Contradictions.
- Brief: "The user picks or creates the task the current pomodoro belongs to" → (a) FR-7, FR-8; Glossary *Current Task*.
- Brief: "Impossible-to-miss state. The running state and remaining time stay visible outside the app tab, and the end of every interval is announced so it cannot be missed" → (a) §4.3 title and description ("cannot be missed from another application"); FR-11 to FR-14; §1.
- Brief: "a system notification via the browser Notification API, a sound on completion, and the countdown in the tab title" → (a) FR-12, FR-14, FR-11; (b) addendum "Technical preferences carried from the brief".
- Brief: "exact mechanisms are decided in UX and architecture" → (b) addendum "The PRD states the required outcomes (FR-11 to FR-15); UX and architecture choose and verify the mechanisms"; (a) FR-6 Notes. See Contradictions (tension with FR-11/12/14 wording).
- Brief: "Each task has its own tree. Every completed pomodoro on that task makes it grow" → (a) Glossary *Tree*, *Growth Step*; FR-19.
- Brief: "The tree is the visual form of 'time invested in this task'" → (a) §1; §4.5 description.
- Brief: "Every finished pomodoro is stored on the server: task, start and end time, completed or interrupted" → (a) FR-16; Glossary *Pomodoro Record*.
- Brief: "Only completed pomodoros grow the tree and count as focus time; interrupted ones are kept in history" → (a) Glossary *Focus Time*; FR-19; FR-22 (Interrupted count shown); §4.6 description "shown separately so they are not forgotten and not counted".
- Brief: "Number of pomodoros and total focus time per day and per week, broken down by task" → (a) FR-21, FR-22, FR-23.
- Brief: "Settings. Durations of work, short break and long break; sound on completion" → (a) FR-24, FR-25.

### What Makes This Different
- Brief: "Timer-first experience with persisted per-task and per-day history, without an account and without a paywall" → (a) persisted history and no account: §1, FR-16, §6. "Timer-first" and "no paywall" → see Silently missing.
- Brief: "Notifications and visibility treated as the core requirement rather than a setting" → (a) §4.3 description "This feature is the reason the product exists"; notifications are not a Setting (Glossary *Settings*). Sound on/off remains a Setting, consistent with the brief's Settings line.
- Brief: "Per-task growth as the primary statistic, rather than leading with tables and charts" → (a) §1 "The Tree is the primary statistic ... backed by per-day and per-week numbers when you want them". The "rather than leading with tables and charts" direction is not carried into §4.5/§4.6 or as UX guidance — see Silently missing (partial).

### Success Criteria
- Brief 1 (Primary): "full AI Forge cycle is completed on this epic" → (a) §9 preamble: "tracked outside this PRD".
- Brief 2 (Product): "author uses the app ... instead of whatever they count pomodoros with today" → (a) SM-3 Replacement.
- Brief 2: "over a week of use no finished pomodoro goes unnoticed or unrecorded" → (a) SM-1 (unrecorded, 7 Days), SM-2 (unnoticed, 7 Days).

### Scope
- Brief "In for the first version" list (timer with automatic transitions; tasks; server-side persistence; day/week statistics by task; settings for durations and sound; strong notifications and persistent visibility; growing tree per task) → (a) §8.1 In Scope, all seven items, mapped to FR ranges.
- Brief "Explicitly out": multi-user, registration and authentication, mobile app, integrations with external task trackers, data export, cross-device sync, gamification beyond the tree (streaks, achievements, leaderboards) → (a) §7 Non-Goals, all present.
- Brief "Note on the tracker": tree and notification requirement not in Jira FT-1; PRD should absorb them; epic description should be updated → (a) §0 `[NOTE FOR PM]`, verbatim intent.

### Open Questions
- Brief: "What happens to a tree when a task is finished or archived? Does it stop growing, stay visible in a 'garden', or disappear?" → (a) FR-20 `[ASSUMPTION]` (stops growing, shown in Garden); §10 Open Question 2; Glossary *Garden*; FR-10.
- Brief: "Is there an upper bound to growth, or does a tree keep growing indefinitely?" → (a) FR-20 `[ASSUMPTION: no growth cap in v1]`; §10 Open Question 3; (b) addendum "Per-Task growth caps ... deferred to Open Question 3".

### Brief addendum
- "Landscape digest" (6 comparables, 4 gaps) → (c) PRD §0 explicitly does not repeat it; (b) addendum Inputs and Research digest reference it.
- "Guest/local-only use loses history" → (b) addendum "Local-only storage (no server). Rejected in the brief".
- "Reliability: alerts not firing, timers running negative, wrong break durations" → (a) FR-6, FR-12, FR-14, FR-24 (see above).
- "Preferred stack: Node.js backend, React frontend. Final decision belongs to the architecture stage" → (b) addendum "Technical preferences carried from the brief", verbatim.
- "Notifications are a first-class concern: the user reports regularly forgetting whether a pomodoro is running" → (a) §4.3 description; §1.

### Memlog decisions and confirmed assumptions
- "Purpose: a personal focus-work tracker for Denis (learning project); stakes low, right-size" → (a) §1, §6.
- "Key pain: forgets whether a pomodoro is running → strong notifications / persistent visibility are a core requirement" → (a) §4.3.
- "Persona refined: busy working person on a MacBook ..." → (a) §2.
- "Growth visual: one tree per task, grows with every completed pomodoro" → (a) FR-19.
- "Primary success criterion: full AI Forge cycle" → (a) §9 preamble.
- "Brief adds two capabilities not in Jira FT-1 ... flagged for the PRD and the epic description to absorb" → (a) §0 NOTE FOR PM.
- Confirmed assumption: notification mechanisms (Notification API, sound, tab title) → (a) FR-11, FR-12, FR-14.
- Confirmed assumption: macOS desktop browser only → (a) §2, §5.
- Confirmed assumption: personal-use success criterion → (a) SM-1 to SM-3.
- Confirmed assumption: extra out-of-scope items → (a) §7.
- Confirmed assumption: interrupted pomodoros do not grow the tree → (a) FR-19, Glossary *Focus Time*.
- "Open questions stay open for the PRD" → (a) §10 Q2, Q3 (with proposed answers tagged as assumptions).
- Jira FT-1 summary: "timer, tasks, persistence, statistics, settings; single user, SPA + REST; out of scope multi-user, mobile, external tracker integrations" → (b) addendum Inputs.

## Contradictions

None of the following is a flat textual contradiction; each is a place where the PRD reopens, hardens, or softens a brief statement rather than extending it.

- **Reopened brief decision — automatic break → work transition.** Brief (Solution, confirmed in memlog "User approved the draft as-is"): "Automatic transition work → break → work." PRD FR-5 keeps this only as `[ASSUMPTION]`, then argues against it in the `[NOTE FOR PM]` ("inflates the record") and lists it as Open Question 1 "needs a decision before UX work". The brief treated this as settled; the PRD demotes it to open. Legitimate, but the PM should know the PRD is asking to re-decide something the brief closed.
- **Softened "take the break the app tells you to".** Brief Executive Summary frames the break as something the app imposes. PRD FR-3 lets the user reset a running Break back to idle (untagged) and FR-5 lets the user "skip a running Break" (tagged inside the FR-5 assumption). The brief never offered a way out of a break.
- **Mechanisms: left open in the brief, prescribed in the PRD body.** Brief: "exact mechanisms are decided in UX and architecture." PRD addendum agrees ("UX and architecture choose and verify the mechanisms"), but PRD FR-11 ("browser tab title"), FR-12 ("a macOS notification is shown"), FR-13 (permission prompt on first Start, retry button, Safari 7-day rule) and FR-14 fix the mechanisms as requirements with 2-second latencies. The PRD body and the PRD addendum disagree about how much is left to UX/architecture; the brief sided with the addendum's wording.
- **Persistence location.** Brief Persistence: "Every finished pomodoro is stored on the server." PRD FR-18 (tagged `[ASSUMPTION]`) has records "kept in the browser and submitted when the server is reachable again" and FR-17 has a running Pomodoro survive reload (addendum: "for example, in local storage"). This adds browser-side state the brief did not contemplate; tagged for FR-18, untagged for FR-17.
- **Completed / Focus Time definition narrowed.** Brief: "Only completed pomodoros ... count as focus time" with no mention of pausing. PRD Glossary *Completed* = "ran for its full configured length (paused time excluded)" and *Focus Time* "excluding paused time". Consistent with the brief in spirit, but it changes what "completed" means whenever the user pauses; untagged.

## Silently missing

- **"Tomato imagery."** Memlog decision: "Core idea from user: tomato imagery plus something that visibly grows (tree or similar)." The tree survived into brief.md and the PRD; the tomato imagery appears in neither brief.md nor prd.md nor the PRD addendum. The memlog's finalize audit claims "all decisions ... are in brief.md", which is not true for this one. No tone/visual-identity statement exists anywhere in the PRD for UX to pick up.
- **"Timer-first experience."** Brief, What Makes This Different. The PRD never states that the timer is the primary surface or what the user sees first. FR-21 says the "main screen" shows today's numbers and FR-20 puts the Tree next to the Current Task, but nothing tells UX that the timer leads. Partially implied by §4.1 being the first feature; not stated.
- **"Without a paywall"** (brief, What Makes This Different) and the brief-addendum complaints "ads at break start, basic customization (timer lengths, themes) paywalled." The PRD has no explicit stance that there is no paywall, no ads, no premium tier. Implied by §6 Cost `[ASSUMPTION]` and §5 Privacy, but never said; a downstream reader would not know it was a differentiator.
- **"Per-task growth ... rather than leading with tables and charts"** (brief). §1 keeps "The Tree is the primary statistic", but §4.6 Statistics and FR-20/21 give no guidance that the Tree should lead and tables follow; FR-21 puts numeric today-at-a-glance on the main screen with no reference to the Tree. The design direction is half-carried.
- **"Nothing here is technically novel, and there is no moat"** (brief, What Makes This Different). Not in the PRD. §0 excludes "problem analysis or landscape research", which arguably does not cover the differentiation section, so this is a drop without a stated reason. Low impact.
- **"Browser SPA backed by a small REST API"** (brief Solution; memlog Jira FT-1 summary). The PRD body (§1, §6) says only "web app" and "server". The shape is stated in the PRD addendum (Inputs; Options rejected), not in PRD §6 Constraints, where architecture would look for it. Partial.
- **"Existing tools do not solve this well for a solo user"** / "solo user" framing (brief, The Problem). PRD uses "one person's real failure mode" (§1) which covers it. Fully captured in spirit; listed only because the phrase "solo user" itself is gone. Negligible.

## Untagged additions in the PRD

Statements that go beyond the brief and are neither tagged `[ASSUMPTION]` nor listed in §10 Open Questions. `[NON-GOAL for MVP]` and `[NOTE FOR PM]` tags are treated as visible flags and excluded.

Timer (§4.1)
- FR-1: Start is unavailable without a Current Task; the app prompts to pick or create one.
- FR-1: Current Task cannot be changed while an Interval is running; requires Reset.
- FR-3: Resetting a Break ends it and returns the timer to idle (brief offers no way out of a break).
- FR-3: Interrupted record stores the actual end time.
- FR-4: "Interrupted Pomodoros do not advance the Cycle."
- FR-4: The Pomodoro Record is stored "before the Break is shown as running" (ordering requirement).
- FR-6: "within 1 second of the true remaining time" (numeric precision).
- FR-6: If the scheduled end passed while the app was closed, "no Break or next Pomodoro is started retroactively" (the Completed-vs-Interrupted half is tagged; the no-retroactive-Break half is not).
- Glossary *Cycle* as a named concept; Glossary *Completed* and *Focus Time* excluding paused time.

Tasks (§4.2)
- FR-7: name required, trimmed, max 100 characters, unique among Open Tasks.
- FR-8: picker lists Open Tasks only; Current Task remembered across reloads and browser restarts.
- FR-9: Rename a Task (whole capability; the brief never mentions renaming).
- FR-10: Open/Done lifecycle and reopening a Done Task (the brief's open question asks about "finished or archived"; the PRD's answer is tagged for the Tree only, not for the Done/reopen state machine itself).
- FR-10: a Task with a running/paused Pomodoro cannot be marked Done.
- §4.2 description: "Tasks are never deleted" (rationale given in §8.2, tagged NON-GOAL in FR-10 — acceptable, listed for completeness).

Alerts and visibility (§4.3)
- FR-11: background-tab title updates at least once per minute, never more than one minute stale; title shows "Interval ended" state (PRD addendum admits "this product's own choice").
- FR-11: Work Interval title includes the Current Task name.
- FR-12: 2-second latency; notification wording (names Task, break length, "what happens next"); activating the notification brings the tab to the front; Focus/DND caveat.
- FR-13: entire permission-handling FR (prompt on first Start, never re-prompt after denial, persistent indicator with how-to, retry button, Safari dismissed-prompt rule).
- FR-14: 2-second latency; "must not fail silently"; Start counts as the audio-unlock gesture.
- FR-15: Return-to-app summary (whole new capability; derived from the brief's failure mode 1 but not in the brief's Solution).

Persistence (§4.4)
- FR-16: same records visible "in another browser on the same machine"; server restart loses nothing.
- FR-17: running or paused Pomodoro survives reload/reopen (whole capability).
- FR-18: "not saved yet" indicator; retries produce no duplicates; timer not blocked while offline (the umbrella rationale is tagged; these three consequences are not).

Tree (§4.5)
- FR-19: Tree is derived from stored records and "never depends on state that exists only in the browser".
- FR-20: Tree shown with the Current Task during an Interval and next to every Task in the list, with the Completed count.

Statistics (§4.6)
- FR-21: "Today at a glance" always on the main screen, live-updating.
- FR-22: Day view includes Interrupted count and a list of the Day's Pomodoros with start time, Task, outcome; previous/next Day navigation; zero days.
- FR-23: previous/next Week navigation; Week totals.
- Glossary *Day* (local midnight; Pomodoro belongs to the Day it started) and *Week* (Monday to Sunday). Addendum cites mainstream convention but the PRD does not tag it.

Settings (§4.7)
- FR-24: ranges 1–90 min (Work) and 1–60 min (Breaks), whole minutes; a change applies to the next Interval only.
- FR-25: default on.
- FR-26: Settings stored on the server (the brief does not say where Settings live; "single set" is tagged, server storage is not).

Cross-cutting (§5, §6, §7, §8, §9)
- §5: Interval end detected within 2 seconds in a background tab; keyboard operability for Start/Pause/Resume/Reset; Privacy "no runtime calls to third-party services and collects no telemetry".
- §6: "Data ownership. All data stays on infrastructure the author controls; there is no cloud dependency at runtime."
- §7 non-goals beyond the brief's list: task-manager features (subtasks, due dates, priorities, projects, notes); native desktop app, menu-bar app, browser extension; analytics/telemetry; data import; integrations with calendars or time-tracking tools; "coins"; "hosted multi-tenant service".
- §2.2: "People who want a task manager. Tasks here are labels for Pomodoros, not a to-do system" (positioning statement not in the brief).
- §8.2: configurable Day start hour deferred; multiple/custom Completion Sounds deferred; monthly/yearly statistics deferred "until a month of real data exists" (reasons are given inline, so these are visible deferrals rather than silent additions; listed because they introduce concepts absent from the brief).
- §9 SM-2: 2-minute reaction threshold and its measurement definition.
- §9 SM-3: "at least 4 Days per Week for 4 consecutive Weeks" (brief says only "over a week of use").
- §9 SM-C1, SM-C2: counter-metrics (Pomodoros per Day not a goal; one notification and one sound per Interval, no reminders or nags).
- UJ-2: laptop-lid-closed edge case; UJ-3: Done Task disappears from the picker (consistent with FR-8/FR-10 but stated as journey fact before the Open Question is answered).
- §10 Open Question 4 (long pauses auto-Interrupted?) is new relative to the brief; it is correctly listed as an Open Question, noted here only so the PM sees it did not originate in the brief.
