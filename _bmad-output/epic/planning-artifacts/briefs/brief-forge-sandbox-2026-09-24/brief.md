---
title: Pomodoro tracker — Product Brief
status: final
created: 2026-09-24
updated: 2026-09-24
ticket: FT-2
parent_ticket: FT-1
---

# Product Brief: Pomodoro tracker

## Executive Summary

Pomodoro tracker is a personal web app for focused work: start a 25-minute pomodoro on a task, take the break the app tells you to, and watch a tree grow for every pomodoro you finish on that task. Every finished pomodoro is recorded on a server, so the history and the per-task, per-day statistics survive browser restarts without any account or login.

The problem it solves is not the lack of a timer. It is that a timer disappears from attention the moment you switch to the IDE, the browser, or Slack. The product treats "you always know whether a pomodoro is running, and you cannot miss its end" as its central job, and the growing tree turns the time you invested in a task into something you can see at a glance.

This is also a learning project for adopting AI Forge end to end, so its scope is deliberately a handful of independent Stories.

## The Problem

A busy person working on a MacBook starts a pomodoro on a task and then lives in other windows. Minutes later the timer is out of sight and out of mind. Two failure modes follow:

- The pomodoro ended a while ago and nobody noticed. The break is skipped, the next interval never starts, and the record of the work is lost or wrong.
- It is unclear whether a pomodoro is running at all, so the person either starts a duplicate or stops tracking altogether.

Existing tools do not solve this well for a solo user. Pure web timers keep no history and know nothing about tasks. Task managers with a Pomodoro mode treat it as a bolt-on. The tools closest to the idea, Pomofocus and Focus To-Do, put server-side history and detailed statistics behind an account and a paid tier. Recurring complaints across the category include lost history without an account, notifications that do not fire, and ads or paywalls at the moment a break starts.

## Who This Serves

The primary user is a busy person working on a MacBook who wants to do focused work in pomodoros and keeps losing track of the timer once they switch windows. Desktop browser on macOS is the only target environment for the first version. The concrete persona is the author; there are no secondary users.

## The Solution

A browser SPA backed by a small REST API with persistent storage, for one user, with no registration.

- **Timer.** Work interval (25 min by default) and break (5 min; every 4th break is a long one, 15 min). Start, pause, reset. Automatic transition work → break → work.
- **Tasks.** The user picks or creates the task the current pomodoro belongs to.
- **Impossible-to-miss state.** The running state and remaining time stay visible outside the app tab, and the end of every interval is announced so it cannot be missed. Concretely: a system notification via the browser Notification API, a sound on completion, and the countdown in the tab title; exact mechanisms are decided in UX and architecture.
- **A tree per task.** Each task has its own tree. Every completed pomodoro on that task makes it grow. The tree is the visual form of "time invested in this task."
- **Persistence.** Every finished pomodoro is stored on the server: task, start and end time, completed or interrupted. Only completed pomodoros grow the tree and count as focus time; interrupted ones are kept in history.
- **Statistics.** Number of pomodoros and total focus time per day and per week, broken down by task.
- **Settings.** Durations of work, short break and long break; sound on completion.

## What Makes This Different

Honestly: nothing here is technically novel, and there is no moat. The difference is a combination the category rarely offers, and the fact that it is built for one person's actual failure mode:

- Timer-first experience with persisted per-task and per-day history, without an account and without a paywall.
- Notifications and visibility treated as the core requirement rather than a setting.
- Per-task growth as the primary statistic, rather than leading with tables and charts.

## Success Criteria

1. **Primary.** The full AI Forge cycle is completed on this epic: brief and PRD authored, epic decomposed into Stories and synced to Jira, every Story implemented, reviewed and merged back.
2. **Product.** The author uses the app for their own focused work instead of whatever they count pomodoros with today, and over a week of use no finished pomodoro goes unnoticed or unrecorded.

## Scope

**In for the first version:** timer with automatic transitions; tasks; server-side persistence of finished pomodoros; day/week statistics by task; settings for durations and sound; strong notifications and persistent visibility; a growing tree per task.

**Explicitly out:** multi-user support, registration and authentication, mobile app, integrations with external task trackers, data export, cross-device sync, and any gamification beyond the tree itself (streaks, achievements, leaderboards).

**Note on the tracker.** The growing tree and the notification requirement are not in the current Jira description of FT-1. The PRD should absorb them, and the epic description should be updated so the two stay aligned.

## Open Questions

- What happens to a tree when a task is finished or archived? Does it stop growing, stay visible in a "garden", or disappear?
- Is there an upper bound to growth, or does a tree keep growing indefinitely?
