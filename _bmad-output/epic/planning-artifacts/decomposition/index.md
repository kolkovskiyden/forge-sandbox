---
parent_kind: epic
parent_prd: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
parent_tracker_id: "FT-1"
parent_tracker_url: "https://cyber-sun.atlassian.net/browse/FT-1"
status: complete
approved: true
steps_completed:
  - step-01-gather-context-and-route
  - step-02-gate-and-plan
  - step-03-carve-children
  - step-04-validate-and-finalize
  - step-01-sync
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
created_at: "2026-09-24T00:00:00Z"
completed_at: "2026-09-24T00:00:00Z"

# STATUS DEFINITIONS (child_status[*].status) — this is the full set; never write a value outside it:
#   - pending: planned child, no child file carved yet
#   - in-progress: child file is being carved (step-03/step-04)
#   - approved: child file carved and self-checks passed, not yet synced to the tracker
#   - failed: carving or validation failed for this child
#   - published: child synced to the issue tracker by vention-decomposition-sync
# Transitions: pending -> in-progress -> approved | failed ; approved -> published
# (re-syncing an already-published child leaves it published).
child_status:
  "ft-4-task-picker":
    kind: pbi
    type: "Story"
    order: 1
    output_file: "story-ft-4-task-picker.md"
    status: published
    covers: "FR-7, FR-8, FR-9"
    tracker_id: "FT-4"
    tracker_url: "https://cyber-sun.atlassian.net/browse/FT-4"
  "ft-5-run-a-pomodoro":
    kind: pbi
    type: "Story"
    order: 2
    output_file: "story-ft-5-run-a-pomodoro.md"
    status: published
    covers: "FR-1, FR-2, FR-3, FR-6, FR-16, FR-17"
    tracker_id: "FT-5"
    tracker_url: "https://cyber-sun.atlassian.net/browse/FT-5"
  "ft-6-offline-safe-records":
    kind: pbi
    type: "Story"
    order: 3
    output_file: "story-ft-6-offline-safe-records.md"
    status: published
    covers: "FR-18"
    tracker_id: "FT-6"
    tracker_url: "https://cyber-sun.atlassian.net/browse/FT-6"
  "ft-7-breaks-and-cycle":
    kind: pbi
    type: "Story"
    order: 4
    output_file: "story-ft-7-breaks-and-cycle.md"
    status: published
    covers: "FR-2, FR-3, FR-4, FR-5, FR-6"
    tracker_id: "FT-7"
    tracker_url: "https://cyber-sun.atlassian.net/browse/FT-7"
  "ft-8-interval-end-alerts":
    kind: pbi
    type: "Story"
    order: 5
    output_file: "story-ft-8-interval-end-alerts.md"
    status: published
    covers: "FR-11, FR-12, FR-13, FR-14"
    tracker_id: "FT-8"
    tracker_url: "https://cyber-sun.atlassian.net/browse/FT-8"
  "ft-9-while-you-were-away":
    kind: pbi
    type: "Story"
    order: 6
    output_file: "story-ft-9-while-you-were-away.md"
    status: published
    covers: "FR-11, FR-15"
    tracker_id: "FT-9"
    tracker_url: "https://cyber-sun.atlassian.net/browse/FT-9"
  "ft-10-task-trees":
    kind: pbi
    type: "Story"
    order: 7
    output_file: "story-ft-10-task-trees.md"
    status: published
    covers: "FR-19, FR-20"
    tracker_id: "FT-10"
    tracker_url: "https://cyber-sun.atlassian.net/browse/FT-10"
  "ft-11-today-and-day-view":
    kind: pbi
    type: "Story"
    order: 8
    output_file: "story-ft-11-today-and-day-view.md"
    status: published
    covers: "FR-22, FR-23"
    tracker_id: "FT-11"
    tracker_url: "https://cyber-sun.atlassian.net/browse/FT-11"
  "ft-12-week-view":
    kind: pbi
    type: "Story"
    order: 9
    output_file: "story-ft-12-week-view.md"
    status: published
    covers: "FR-24"
    tracker_id: "FT-12"
    tracker_url: "https://cyber-sun.atlassian.net/browse/FT-12"
  "ft-13-done-tasks-and-garden":
    kind: pbi
    type: "Story"
    order: 10
    output_file: "story-ft-13-done-tasks-and-garden.md"
    status: published
    covers: "FR-9, FR-10, FR-21"
    tracker_id: "FT-13"
    tracker_url: "https://cyber-sun.atlassian.net/browse/FT-13"
  "ft-14-settings":
    kind: pbi
    type: "Story"
    order: 11
    output_file: "story-ft-14-settings.md"
    status: published
    covers: "FR-25, FR-26, FR-27"
    tracker_id: "FT-14"
    tracker_url: "https://cyber-sun.atlassian.net/browse/FT-14"
last_updated: "2026-09-24T15:50:40Z"
---

# Epic FT-1 — Pomodoro tracker

## Parent Reference

- Epic: [FT-1 — Pomodoro tracker](https://cyber-sun.atlassian.net/browse/FT-1)
- Epic PRD: [prd.md](../prd-ft-1/prd.md)
- Epic architecture: [pomodoro-tracker-architecture.md](../architecture/pomodoro-tracker-architecture.md)

Tracer-bullet decomposition of the FT-1 PRD into 11 vertical-slice Stories, in delivery order. Each Story cuts through storage, API, shared logic and UI and is demoable on its own. The repository scaffold (architecture ADR1) and the Tailwind + Tailkit presentation layer (ADR8, amended 2026-09-24) are carried by the first Story instead of a separate foundation slice.

## ft-4-task-picker — Create, rename and pick Tasks (FT-4)

**Type:** Story  
**Order:** 1  
**Covers:** FR-7, FR-8, FR-9 (Open Tasks; endpoint for any state)  
**Depends on:** —
**File:** [pbi file](./story-ft-4-task-picker.md)

## ft-5-run-a-pomodoro — Run a Pomodoro on the Current Task (FT-5)

**Type:** Story  
**Order:** 2  
**Covers:** FR-1, FR-2, FR-3, FR-6, FR-16, FR-17  
**Depends on:** ft-4-task-picker
**File:** [pbi file](./story-ft-5-run-a-pomodoro.md)

## ft-6-offline-safe-records — Keep finished Pomodoros when the server is unreachable (FT-6)

**Type:** Story  
**Order:** 3  
**Covers:** FR-18  
**Depends on:** ft-5-run-a-pomodoro
**File:** [pbi file](./story-ft-6-offline-safe-records.md)

## ft-7-breaks-and-cycle — Automatic Breaks and the four-Pomodoro Cycle (FT-7)

**Type:** Story  
**Order:** 4  
**Covers:** FR-2, FR-3, FR-4, FR-5, FR-6  
**Depends on:** ft-5-run-a-pomodoro
**File:** [pbi file](./story-ft-7-breaks-and-cycle.md)

## ft-8-interval-end-alerts — Interval-end Alerts from a background tab (FT-8)

**Type:** Story  
**Order:** 5  
**Covers:** FR-11, FR-12, FR-13, FR-14  
**Depends on:** ft-7-breaks-and-cycle
**File:** [pbi file](./story-ft-8-interval-end-alerts.md)

## ft-9-while-you-were-away — Return-to-app summary after an Unseen End (FT-9)

**Type:** Story  
**Order:** 6  
**Covers:** FR-11, FR-15  
**Depends on:** ft-7-breaks-and-cycle, ft-8-interval-end-alerts
**File:** [pbi file](./story-ft-9-while-you-were-away.md)

## ft-10-task-trees — A Tree per Task (FT-10)

**Type:** Story  
**Order:** 7  
**Covers:** FR-19, FR-20  
**Depends on:** ft-5-run-a-pomodoro, ft-6-offline-safe-records
**File:** [pbi file](./story-ft-10-task-trees.md)

## ft-11-today-and-day-view — Today at a glance and the Day view (FT-11)

**Type:** Story  
**Order:** 8  
**Covers:** FR-22, FR-23  
**Depends on:** ft-5-run-a-pomodoro, ft-6-offline-safe-records
**File:** [pbi file](./story-ft-11-today-and-day-view.md)

## ft-12-week-view — Week view (FT-12)

**Type:** Story  
**Order:** 9  
**Covers:** FR-24  
**Depends on:** ft-11-today-and-day-view
**File:** [pbi file](./story-ft-12-week-view.md)

## ft-13-done-tasks-and-garden — Mark Tasks Done, reopen them, and the Garden (FT-13)

**Type:** Story  
**Order:** 10  
**Covers:** FR-9 (Done Tasks), FR-10, FR-21  
**Depends on:** ft-10-task-trees
**File:** [pbi file](./story-ft-13-done-tasks-and-garden.md)

## ft-14-settings — Settings: Interval lengths and Completion Sound (FT-14)

**Type:** Story  
**Order:** 11  
**Covers:** FR-25, FR-26, FR-27  
**Depends on:** ft-7-breaks-and-cycle, ft-8-interval-end-alerts
**File:** [pbi file](./story-ft-14-settings.md)

## Coverage

| Parent requirement | Covered by |
|---|---|
| FR-1 | ft-5-run-a-pomodoro |
| FR-2 | ft-5-run-a-pomodoro, ft-7-breaks-and-cycle |
| FR-3 | ft-5-run-a-pomodoro, ft-7-breaks-and-cycle |
| FR-4 | ft-7-breaks-and-cycle |
| FR-5 | ft-7-breaks-and-cycle |
| FR-6 | ft-5-run-a-pomodoro, ft-7-breaks-and-cycle |
| FR-7 | ft-4-task-picker |
| FR-8 | ft-4-task-picker |
| FR-9 | ft-4-task-picker, ft-13-done-tasks-and-garden |
| FR-10 | ft-13-done-tasks-and-garden |
| FR-11 | ft-8-interval-end-alerts, ft-9-while-you-were-away |
| FR-12 | ft-8-interval-end-alerts |
| FR-13 | ft-8-interval-end-alerts |
| FR-14 | ft-8-interval-end-alerts |
| FR-15 | ft-9-while-you-were-away |
| FR-16 | ft-5-run-a-pomodoro |
| FR-17 | ft-5-run-a-pomodoro |
| FR-18 | ft-6-offline-safe-records |
| FR-19 | ft-10-task-trees |
| FR-20 | ft-10-task-trees |
| FR-21 | ft-13-done-tasks-and-garden |
| FR-22 | ft-11-today-and-day-view |
| FR-23 | ft-11-today-and-day-view |
| FR-24 | ft-12-week-view |
| FR-25 | ft-14-settings |
| FR-26 | ft-14-settings |
| FR-27 | ft-14-settings |

| Check | Result |
|---|---|
| Parent FRs (FR-1 to FR-27) | 27/27 covered |
| PRD §6 NFRs (unnumbered) | Timer accuracy, Keyboard operability → ft-5-run-a-pomodoro; Alert latency, Browser support → ft-8-interval-end-alerts; Durability → ft-4-task-picker, ft-5-run-a-pomodoro, ft-14-settings; Privacy / localhost-only → ft-4-task-picker |
| Journeys | UJ-1 → ft-4-task-picker, ft-5-run-a-pomodoro, ft-7-breaks-and-cycle, ft-8-interval-end-alerts, ft-10-task-trees · UJ-2 → ft-5-run-a-pomodoro, ft-7-breaks-and-cycle, ft-9-while-you-were-away · UJ-3 → ft-10-task-trees, ft-12-week-view, ft-13-done-tasks-and-garden |
| Surfaces (inferred from PRD, no UX spec) | Main → ft-4-task-picker, ft-5-run-a-pomodoro, ft-11-today-and-day-view · Task List → ft-10-task-trees · Day → ft-11-today-and-day-view · Week → ft-12-week-view · Garden → ft-13-done-tasks-and-garden · Settings → ft-14-settings |
| Dependency graph | DAG; every dependency has a lower order |

## Open risks

- **No UX spec.** Accepted by the author at Step 1 (2026-09-24). Slices were inferred from the PRD journeys (UJ-1 to UJ-3) and PRD §5 (timer-first, tomato motif, Tree). Tree growth stages, screen layout, and the return-to-app summary wording are decided inside ft-10-task-trees and ft-9-while-you-were-away, using Tailkit components.
- **Interim behavior.** Until ft-7-breaks-and-cycle lands, a Completed Pomodoro returns the timer to Idle instead of starting a Break.
- **Safari notification delivery from a hidden tab is unverified** (PRD addendum). ft-8-interval-end-alerts carries a manual Chrome and Safari checklist.
- **Cut order (PRD §9.1).** ft-12-week-view and ft-14-settings are cut-first and can be dropped cleanly. ft-13-done-tasks-and-garden mixes Core FR-10 with cut-first FR-21, because reopening happens from the Garden.
- **PRD gap.** Reopening a Done Task whose name equals an Open Task name (ignoring letter case) is not specified. It is raised as an open question in ft-13-done-tasks-and-garden.

## Validation

- Parent-requirement coverage: 100% covered (27/27 FRs; all PRD §6 NFRs)
- Ordering: passed
- Narrative: 2 gaps fixed in iteration 1, 0 open
- Full details: [validation-report.md](validation-report.md)

## Next Steps

Published to Jira on 2026-09-24 as FT-4 to FT-14, children of [FT-1](https://cyber-sun.atlassian.net/browse/FT-1), with "Blocks" dependency links matching each story's Depends on. The author decisions pending in the stories' Open questions are listed in the validation report (O2); resolve them on the Jira issues before development starts.
