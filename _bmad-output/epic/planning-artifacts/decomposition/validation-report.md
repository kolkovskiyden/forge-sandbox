---
status: resolved
iteration: 1
validated_at: "2026-09-24T00:00:00Z"
parent_kind: "epic"
exit_conditions_met: true
---

# Validation Report - forge-sandbox Decomposition (epic)

## Summary
- Parent-requirement coverage (Epic scope): 0 uncovered of 27
- Extra IDs: 0
- NFR coverage: PRD §6 NFRs are unnumbered; covered narratively (see Coverage)
- Ordering: 0 gaps (11 ordered children, contiguous 1–11, topological, filenames aligned)
- Narrative: 2 gaps found, 2 fixed in iteration 1, 0 open

## Coverage
| Parent requirement | Covered by |
|---|---|
| FR-1 | run-a-pomodoro |
| FR-2 | run-a-pomodoro, breaks-and-cycle |
| FR-3 | run-a-pomodoro, breaks-and-cycle |
| FR-4 | breaks-and-cycle |
| FR-5 | breaks-and-cycle |
| FR-6 | run-a-pomodoro, breaks-and-cycle |
| FR-7 | task-picker |
| FR-8 | task-picker |
| FR-9 | task-picker, done-tasks-and-garden |
| FR-10 | done-tasks-and-garden |
| FR-11 | interval-end-alerts, while-you-were-away |
| FR-12 | interval-end-alerts |
| FR-13 | interval-end-alerts |
| FR-14 | interval-end-alerts |
| FR-15 | while-you-were-away |
| FR-16 | run-a-pomodoro |
| FR-17 | run-a-pomodoro |
| FR-18 | offline-safe-records |
| FR-19 | task-trees |
| FR-20 | task-trees |
| FR-21 | done-tasks-and-garden |
| FR-22 | today-and-day-view |
| FR-23 | today-and-day-view |
| FR-24 | week-view |
| FR-25 | settings |
| FR-26 | settings |
| FR-27 | settings |
| §6 Timer accuracy | run-a-pomodoro, breaks-and-cycle |
| §6 Alert latency | interval-end-alerts |
| §6 Durability | task-picker, run-a-pomodoro, offline-safe-records, settings |
| §6 Browser support | interval-end-alerts |
| §6 Keyboard operability | run-a-pomodoro |
| §6 Privacy | task-picker |

## Gaps
### G1 - Breaks story restated the closed-app Work Interval rule
- **Source:** narrative
- **Location:** breaks-and-cycle — Deliverables 6, Acceptance criteria 6
- **Finding:** Restated and re-tested storing a Work Interval that ended while the app was closed as Completed at its scheduled end, which run-a-pomodoro owns.
- **Suggested fix:** Limit both to "no Break and no next Pomodoro start retroactively; the Pomodoro counts toward the Cycle".
- **Status:** fixed-iteration-1

### G2 - Renaming a Done Task had no owner
- **Source:** narrative
- **Location:** task-picker — Deliverables 7; index covers
- **Finding:** FR-9 allows renaming Open or Done Tasks, but task-picker only offers rename from the Task Picker (Open Tasks only).
- **Suggested fix:** Make the rename endpoint work for any Task state in task-picker; assign the Done-Task UI half of FR-9 to done-tasks-and-garden, which already renames Done Tasks in the Garden.
- **Status:** fixed-iteration-1

## Observations
### O1 - Validator could not parse the PRD's FR section
`vsdlc decomposition validate` reads FR IDs only from a `## Functional Requirements` section; this PRD lists FR-1 to FR-27 under `## 4. Features`, so the first run reported 0 parent FRs. Coverage mode was re-run against a scratch file with the 27 FR headings under `## Functional Requirements`: 27/27 covered, 0 extra IDs. The PRD was not restructured.

### O2 - Open questions carried by stories (for author review, not gaps)
- breaks-and-cycle: Cycle attribution for a Pomodoro spanning midnight; a fourth Pomodoro Completed while the app was closed resets the Cycle.
- interval-end-alerts: nothing alerts if the owning tab closes while another tab stays open.
- task-trees: proposed Tree stage design; brief double count if a save confirmation is lost.
- done-tasks-and-garden: reopening a Done Task whose name equals an Open Task's name (ignoring case).

## Iteration history
- Iteration 1 (2026-09-24T00:00:00Z): 2 narrative gaps, both fixed; mechanical and ordering checks clean
