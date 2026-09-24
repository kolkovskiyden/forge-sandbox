# PRD Coverage Matrix — Pomodoro tracker - Create, rename and pick Tasks (FT-4)

Source: _bmad-output/epic/planning-artifacts/prd-ft-1/prd.md (epic FT-1). No story-level PRD; no initiative level in this workspace. Owners come from the epic decomposition (_bmad-output/epic/planning-artifacts/decomposition/index.md). The Out-of-scope assignment of the 24 sibling FRs was confirmed by the author at the PRD checkpoint on 2026-09-24.

| FR | Requirement | Checklist | E2E | Test Case | Status | Notes |
|---|---|---|---|---|---|---|
| FR-1 | Start a Pomodoro on the Current Task when Idle | — | — | — | Out-of-scope | Owner FT-5 Run a Pomodoro. FT-4 only shows the static timer and the pick-or-create prompt (Common checklist, Scope Boundaries). |
| FR-2 | Pause and resume a Running Interval | — | — | — | Out-of-scope | Owners FT-5 and FT-7. |
| FR-3 | Reset the Running or Paused Interval | — | — | — | Out-of-scope | Owners FT-5 and FT-7. |
| FR-4 | Automatic transition to a Break | — | — | — | Out-of-scope | Owner FT-7 Breaks and cycle. |
| FR-5 | Automatic transition from a Break to the next Pomodoro | — | — | — | Out-of-scope | Owner FT-7 Breaks and cycle. |
| FR-6 | Remaining time is always true | — | — | — | Out-of-scope | Owners FT-5 and FT-7. |
| FR-7 | Create a Task: name required, trimmed, at most 100 characters, unique among Open Tasks ignoring case; new Task Open and pickable at once | Create Task.md (Create Form, Name Rules, Duplicate Names, Rejected Input Handling, New Task State) | First Session Journey.md; Create Task.md | Create Task.md (8 cases) | Full | The zero Growth Steps Tree is not visible until FT-10; FT-4 checks the new Task is Open and pickable. |
| FR-8 | Select the Current Task: Picker lists Open Tasks only; Current Task remembered across reloads and browser restarts | Task Picker and Current Task.md (all sections) | First Session Journey.md; Task Picker and Current Task.md | Task Picker and Current Task.md (7 cases) | Full | "Done Tasks do not appear" becomes testable once Done exists (FT-13). FR-1's "cannot change while Running" belongs to FT-5. |
| FR-9 | Rename an Open or Done Task; records and Tree stay attached; same name rules as FR-7 | Rename Task.md (all sections) | First Session Journey.md | Rename Task.md (5 cases) | Full | Renaming a Done Task from the screen belongs to FT-13; the Done-Task rename rule is covered by the automated API test "checks a Done Task only against Open Tasks". Records and Tree attachment become observable with FT-5 and FT-10. |
| FR-10 | Mark a Task Done and reopen it | — | — | — | Out-of-scope | Owner FT-13 Done tasks and Garden. FT-4 checks no Done control exists (Common). |
| FR-11 | Tab title shows state and remaining time | — | — | — | Out-of-scope | Owner FT-8 Interval-end alerts. |
| FR-12 | System notification at Interval end | — | — | — | Out-of-scope | Owner FT-8 Interval-end alerts. |
| FR-13 | Notification permission handling | — | — | — | Out-of-scope | Owner FT-8 Interval-end alerts. |
| FR-14 | Completion Sound | — | — | — | Out-of-scope | Owner FT-8 Interval-end alerts. |
| FR-15 | Return-to-app summary | — | — | — | Out-of-scope | Owner FT-9 While you were away. |
| FR-16 | Store every Pomodoro Record on the server | — | — | — | Out-of-scope | Owner FT-5 Run a Pomodoro. FT-4 covers Task durability across restarts (Common). |
| FR-17 | A Running or Paused Pomodoro survives reload | — | — | — | Out-of-scope | Owner FT-5 Run a Pomodoro. |
| FR-18 | No loss when the server is unreachable | — | — | — | Out-of-scope | Owner FT-6 Offline-safe records. Tasks are online-only (epic-ADR6); FT-4 checks a failed create keeps the typed name. |
| FR-19 | A Tree grows with Completed Pomodoros | — | — | — | Out-of-scope | Owner FT-10 Task trees. |
| FR-20 | The Tree is visible where the Task is | — | — | — | Out-of-scope | Owner FT-10 Task trees. |
| FR-21 | Garden of Done Tasks | — | — | — | Out-of-scope | Owner FT-13 Done tasks and Garden. |
| FR-22 | Today at a glance | — | — | — | Out-of-scope | Owner FT-11 Today and Day view. |
| FR-23 | Day view | — | — | — | Out-of-scope | Owner FT-11 Today and Day view. |
| FR-24 | Week view | — | — | — | Out-of-scope | Owner FT-12 Week view. |
| FR-25 | Interval lengths | — | — | — | Out-of-scope | Owner FT-14 Settings. |
| FR-26 | Completion Sound on or off | — | — | — | Out-of-scope | Owner FT-14 Settings. |
| FR-27 | Settings persist | — | — | — | Out-of-scope | Owner FT-14 Settings. |

## Spec coverage outside the UI

These spec I/O Matrix rows cannot be produced from the UI. They are covered by the automated in-process API tests in apps/server/src/app.test.ts:
- Bad body (missing or non-string name, malformed JSON) → "rejects %s as invalid_request"
- Rename Done Task → "checks a Done Task only against Open Tasks"
- Unknown id → "answers not_found for an unknown id" (the UI-observable form is the Rename Task test case "Renaming a Task that no longer exists creates nothing")
