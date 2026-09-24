---
id: "ft-9-while-you-were-away"
title: "Return-to-app summary after an Unseen End"
kind: pbi
type: "Story"
status: "published"
parent_kind: "epic"
parent_tracker_id: ""
parent_tracker_url: ""
tracker_id: "FT-9"
tracker_url: "https://cyber-sun.atlassian.net/browse/FT-9"
created_at: "2026-09-24"
last_updated: "2026-09-24"
last_synced: "2026-09-24T15:50:40Z"
source_documents:
  - path: "_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md"
    kind: "epic-prd"
  - path: "_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md"
    kind: "epic-architecture"
---

# PBI ft-9-while-you-were-away: Return-to-app summary after an Unseen End

## Parent

Epic FT-1 — Pomodoro tracker ([Epic PRD](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md))

## Deliverables

1. **Every Interval end is classified as seen or unseen.** An Unseen End is an Interval end that happened while the app tab was not both visible and focused, and after which the user has not acted in the app. An end counts as seen if, at that moment, the tab was visible (`document.visibilityState` is `visible`) and focused (`document.hasFocus()`), or if within 60 seconds after it the user acts in the app: brings the tab to the front (for example by activating the notification), or clicks or presses a key in it. The rule applies to all Interval ends: a Work Interval reaching its full length, a Break reaching its full length, and the 30-minute pause time-out of a Paused Pomodoro. Ends that the app discovers only when it is opened (the scheduled end or time-out passed while the tab was closed or the browser quit) are always Unseen Ends. This is the same seen rule that decides whether the next Pomodoro starts by itself after a Break; this story records the outcome for every end and does not change any timer transition.
2. **The Unseen End is remembered until the user acts.** When an end becomes an Unseen End, the app stores in the browser (`localStorage`) the facts the summary needs: the Pomodoro id and Task id, the Pomodoro's outcome and end time, the Break kind with its start and end if one followed, the start time of a Pomodoro that started by itself afterwards if any, and the Task name as known at Start as a fallback. The stored state survives a reload and a browser restart, and is shared by all tabs of the same browser through the existing `BroadcastChannel` sync, so every open tab shows the same summary. It is cleared only when the user presses Start, presses Reset, or dismisses the summary, in any tab; clearing it in one tab clears it in all of them. A new Unseen End replaces the previous one.
3. **Summary derived by one pure function.** A pure function in `packages/shared` turns the stored Unseen End state, the Pomodoro Records (server records plus records not yet saved), the current Timer State and Interval, and the current time into the summary content. It returns, in order: the last Pomodoro's Task name (current name, falling back to the name at Start), its outcome (Completed or Interrupted) and end time; whether a Break followed, which kind, and when it ended or when it will end if still Running; whether a new Pomodoro started by itself and when, or that the timer is waiting for Start; and the current Timer State. It returns nothing when there is no Unseen End. Times are formatted as hours and minutes in the browser's local time zone. The function reads no timers and no ticks: every time comes from stored timestamps and the clock passed in, so skipped ticks and system sleep cannot make it wrong.
4. **Summary card on the main screen.** When the user returns to the tab while an Unseen End exists, the main screen shows the summary without any navigation, as a Tailkit alert/card component placed alongside the timer, not covering it. The text is calm, plain and short, for example: "While you were away: Pomodoro on "FT-1 PRD" Completed at 14:25. Short Break ended at 14:30. The timer is waiting for Start." An Interrupted Pomodoro is reported in the same neutral tone, with no warning styling. The card has a Dismiss button reachable from the keyboard; Start and Reset in the timer also clear it. While the summary is shown, the timer area never shows a stale or negative countdown: it shows Idle, or the true remaining time of the Interval that is actually Running.
5. **The four away cases read correctly.** The summary describes each of these exactly:
   - A Work Interval reached its full length unseen and the following Break then ended unseen: Pomodoro Completed at its scheduled end, which Break followed and when it ended, timer Idle and waiting for Start.
   - A Pomodoro stayed Paused for 30 minutes: Pomodoro Interrupted at the time-out moment (the moment it was paused plus 30 minutes), no Break followed, timer Idle and waiting for Start.
   - The app was closed when the Work Interval's scheduled end passed: Pomodoro Completed at its scheduled end, no Break was started, timer Idle and waiting for Start.
   - The app was closed when a Break's scheduled end passed: the last Pomodoro with its outcome and end time, the Break and when it ended, timer Idle and waiting for Start.
   When the user returns during a Break that started after an unseen Work Interval end, the summary says the Pomodoro was Completed, that the Break is Running and when it ends; when a Pomodoro started by itself after the Break, it says when it started and that the timer is Running.
6. **Tab title marks the Unseen End.** While an Unseen End exists, the browser tab title shows that an Interval ended in addition to its normal state text, for example "Interval ended · Pomodoro tracker" when Idle, or the marker followed by the usual remaining time and Task name when an Interval is Running. The marker is removed at the same moment the summary is cleared, and it is shown in every tab of the same browser. No notification or sound is issued by this story.
7. **Tests.** Vitest unit tests with a fake clock (`vi.useFakeTimers()`, `vi.setSystemTime()`) cover the summary function for each of the four away cases above, the returned-during-Break case, and the "no Unseen End" case, including a time zone other than UTC. Unit tests also cover the seen rule: tab visible and focused at the end (seen), action at 59 seconds (seen), action at 61 seconds (unseen), tab visible but window not focused at the end with no action (unseen), and an end discovered at app load (unseen).

## Acceptance criteria

1. **Given** the user started a 25-minute Pomodoro on "FT-1 PRD" at 14:00 with a 5-minute Short Break and then left the tab in the background with no interaction, **When** the user returns to the tab at 14:50, **Then** the main screen shows, without navigating, that the Pomodoro on "FT-1 PRD" was Completed at 14:25, the Short Break ended at 14:30, and the timer is Idle waiting for Start; no countdown is shown; and the tab title shows that an Interval ended in addition to the app name.
2. **Given** a Pomodoro on "FT-1 PRD" was Paused at 10:10 and never resumed, **When** the user returns at 11:00 (with the tab open in the background throughout, and separately after the browser was quit at 10:20 and reopened at 11:00), **Then** the summary says the Pomodoro was Interrupted at 10:40, that no Break followed, and that the timer is Idle waiting for Start.
3. **Given** a Pomodoro started at 09:00 and the browser was quit at 09:10, **When** the app is opened at 10:00, **Then** the summary says the Pomodoro was Completed at 09:25, that no Break was started, and that the timer is Idle; **and Given** a Short Break was Running from 09:25 to 09:30 and the browser was quit at 09:27, **When** the app is opened at 10:00, **Then** the summary names the last Pomodoro as Completed at 09:25, says the Short Break ended at 09:30, and that the timer is Idle waiting for Start.
4. **Given** an Interval ends while the tab is visible and focused, or the user brings the tab to the front or clicks in it 59 seconds after the end, **When** the user looks at the main screen, **Then** no summary is shown and the tab title has no "Interval ended" marker; **and When** the first action comes 61 seconds after an end in a background tab, **Then** the summary and the title marker are shown.
5. **Given** a summary is shown in two tabs of the same browser, **When** the page is reloaded, **Then** the summary and the title marker are still shown; **and When** the user presses Dismiss, Start, or Reset in either tab, **Then** the summary disappears and the title marker is removed in both tabs, and neither comes back after another reload.

## Depends on

- [FT-7](https://cyber-sun.atlassian.net/browse/FT-7)
- [FT-8](https://cyber-sun.atlassian.net/browse/FT-8)

## Out of scope

- Issuing system notifications or playing the Completion Sound.
- Changing the timer transition rules (when a Break or the next Pomodoro starts, the pause time-out, what is recorded at an end).

## References

- epic-prd: [prd.md](/_bmad-output/epic/planning-artifacts/prd-ft-1/prd.md)
- epic-architecture: [pomodoro-tracker-architecture.md](/_bmad-output/epic/planning-artifacts/architecture/pomodoro-tracker-architecture.md)
