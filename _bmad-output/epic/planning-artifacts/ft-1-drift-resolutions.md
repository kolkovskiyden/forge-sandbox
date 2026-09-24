# FT-1 drift resolutions

## 2026-09-24 — FT-1 drift resolutions (safeguard run before FT-1 description update, PO Flow FT-3)

Scope: FT-1 (ticket) as anchor; artifact surfaces: the brief (`planning-artifacts/briefs/brief-forge-sandbox-2026-09-24/brief.md`) and the PRD (`planning-artifacts/prd-ft-1/prd.md`). FT-2 and FT-3 are process tickets ("write the brief", "write the PRD") and carry no product requirements; addenda, memlogs, review and edit reports are not requirement surfaces. Resolution mode: user delegated all decisions and pre-approved the FT-1 write ("да, давай, делай все, что сказал"); recommendations accepted on every drift. The brief is the superseded upstream document and was not edited.

- Automatic start of the next pomodoro after a break — medium — kept the PRD.
  Confirmed: "the next Pomodoro starts by itself on the Current Task only if the user is there to see the Break end (app tab visible and focused at the moment, or brought to the front within 60 seconds); otherwise the Timer State becomes Idle" (PRD FR-5, §1, UJ-2, §4.1 transition table, §11 decision 1). Also stated in: FT-1 (ticket) — Core capabilities / Timer "automatic transition work → break → work"; the brief — Solution / Timer "Automatic transition work → break → work" (brief.md:31), Executive Summary "take the break the app tells you to" (brief.md:13).
  Write-back: FT-1 pending; the brief — risk accepted (superseded by the PRD, not edited).
- Tree per task — medium — kept the PRD and the brief.
  Confirmed: "Each Task has exactly one Tree whose number of Growth Steps equals the number of Completed Pomodoros on that Task; Interrupted Pomodoros leave the Tree unchanged; Trees of Done Tasks are shown in the Garden" (PRD FR-19 to FR-21; brief.md Solution "A tree per task"). Absent in: FT-1 (ticket).
  Write-back: FT-1 pending.
- Impossible-to-miss interval end and persistent visibility — medium — kept the PRD and the brief.
  Confirmed: "the tab title reflects the Timer State at all times; a system notification and the Completion Sound fire within 2 seconds of the Interval end, including from a background tab; a return-to-app summary shows what happened while the user was away" (PRD §4.3, FR-11 to FR-15; brief.md Solution "Impossible-to-miss state"). Present in FT-1 only as "sound on completion" (Settings).
  Write-back: FT-1 pending.
- Target platform — low — kept the PRD and the brief.
  Confirmed: "desktop browser on macOS; current Chrome and Safari supported, Firefox best effort" (PRD §2, §6; brief.md Who This Serves). Absent in: FT-1 (ticket) Constraints.
  Write-back: FT-1 pending.
- Pause time-out — low — kept the PRD.
  Confirmed: "A Pomodoro Paused for 30 minutes without being resumed ends as Interrupted at that moment; a Break Paused for 30 minutes ends" (PRD FR-2, §11 decision 2). Silent in: FT-1 (ticket) "Start / Pause / Reset"; the brief — Solution / Timer "Start, pause, reset" (brief.md:31).
  Write-back: FT-1 pending; the brief — risk accepted (superseded by the PRD).
- Explicit out-of-scope list — low — kept the PRD.
  Confirmed: PRD §8 Non-Goals (multi-user, registration/authentication, monetization, mobile, external integrations, data export/import, cross-device sync, gamification beyond the tree, task-manager features, native app or extension, telemetry). FT-1 (ticket) Out of scope listed only multi-user, mobile app, external task trackers; the brief's list (brief.md Scope "Explicitly out") is a subset of the PRD's.
  Write-back: FT-1 pending.

Lost-update guard: FT-1 re-fetched immediately before writing; description unchanged since the run's first read (all original markers present, no tree or notification wording).

- Write-back FT-1 (ticket): description replaced with the reconciled text (What we are building, Core capabilities incl. Alerts and visibility and Tree per task, bounded automatic start, 30-minute pause time-out, Constraints incl. macOS desktop browser, expanded Out of scope, pointer to the PRD path). Applied 2026-09-24 via the issue-tracker capability; verified by re-read. Status: written.
- Write-back the brief: not applied (risk accepted; the PRD supersedes it).

Verdict: Pass.

## 2026-09-24 — FT-1 drift resolutions (gate for vention-decomposition-flow, Epic FT-1)

Scope: FT-1 (ticket) as anchor; artifact surfaces: the PRD (`prd-ft-1/prd.md`), the epic architecture (`architecture/pomodoro-tracker-architecture.md`, new since the previous run), the brief (`briefs/brief-forge-sandbox-2026-09-24/brief.md`). FT-2 and FT-3 are process tickets without product requirements. Brief↔PRD drifts were settled in the previous entry and are not re-raised. Resolution mode: user chose "accept the recommendation on every drift".

- Second browser vs same-browser tabs for the running Interval (PRD §7 One live instance) — medium — kept the architecture.
  Confirmed: "A second open tab of the same browser shows the same state; another browser shows the same Pomodoro Records but not a Running or Paused Interval; only the instance that started the Interval issues Alerts" (architecture ADR4, :86, :20, :90). Affected statements: the PRD — :334 (§7 One live instance, diverging), :198 (FR-12 reference to §7), :431 (§12).
  Write-back: pending.
- Task-name uniqueness ignores letter case (PRD FR-7) — low — kept the architecture.
  Confirmed: "a name equal to an existing Open Task's name, ignoring letter case, is rejected" (architecture ADR3, :72 — partial unique index on lower(name) among Open Tasks). Affected statements: the PRD — :158 (FR-7, diverging), :171 (FR-9 same rules), :415 (§12).
  Write-back: pending.

- Write-back the PRD (`prd-ft-1/prd.md`): 3 edits across 2 drifts applied 2026-09-24 — §7 One live instance (same-browser tabs; another browser sees records only), FR-7 and §12 (uniqueness ignoring letter case). Status: written.

Verdict: Pass.
