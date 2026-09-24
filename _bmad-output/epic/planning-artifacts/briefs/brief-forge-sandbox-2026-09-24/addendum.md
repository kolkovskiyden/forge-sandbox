---
title: Pomodoro tracker — Brief Addendum
status: final
created: 2026-09-24
updated: 2026-09-24
---

# Addendum — supporting material for the Pomodoro tracker brief

## Landscape digest (web research, 2026-09-24)

Comparables:

- **Pomofocus** — web (+ mobile). Server-side history only for logged-in accounts; guest use is local-only. Tasks attached to sessions. Daily/weekly/monthly reports free; yearly reports and CSV export premium. Freemium (~$3/mo, $18/yr, $54 lifetime). Sources: https://pomofocus.io/app, https://pomodorian.app/pomodorian-vs-pomofocus
- **Pomodoro Tracker / TomatoTimer** — web only, no signup. Local-only or no history; no task attachment or per-task stats. Free. Sources: https://pomodoro-tracker.com/, https://www.tomatotimers.com/
- **Focus To-Do** — web, desktop, mobile. Cloud history for logged-in premium users. Tasks/subtasks/projects attached to sessions. Rich stats (basic free, detailed premium). Freemium ($1.99/mo, $9.99/yr, $11.99 lifetime). Source: https://goalsandprogress.com/focus-to-do-review-2026/
- **Forest** — mobile-first. Server-side stats only with premium sync. Sessions tagged, not attached to structured tasks. Source: https://www.forestapp.cc/
- **TickTick (Pomodoro mode)** — web/mobile/desktop, inside a full task manager. Sessions attach to tasks; weekly focus stats; account sync. Freemium bundled with task-manager pricing. Source: https://clickup.com/learn/topic/productivity/tools/features/pomodoro-timer/
- **Toggl Track (Pomodoro mode)** — web/desktop/extension, bolted onto time tracking. History via Toggl account; attaches to Toggl projects, not native Pomodoro tasks. Per-seat plans. Source: https://toggl.com/track/pomodoro-timer-toggl/

Common complaints and gaps:

- Guest/local-only use loses history; sync issues and data loss on sign-in recur in reviews.
- Aggressive monetization: ads at break start, basic customization (timer lengths, themes) paywalled.
- Reliability: alerts not firing, timers running negative, wrong break durations.
- Two camps with a gap between them: pure timers lack task/stat depth, task managers treat Pomodoro as a bolt-on. Few apps do timer-first UX plus per-task/per-day statistics well (Focus To-Do and Pomofocus premium come closest).

## Technical constraints and preferences (from discovery)

- Preferred stack: Node.js backend, React frontend. Final decision belongs to the architecture stage.
- Notifications are a first-class concern: the user reports regularly forgetting whether a pomodoro is running.
