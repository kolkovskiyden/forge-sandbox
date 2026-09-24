---
title: Pomodoro tracker — PRD Addendum
status: final
created: 2026-09-24
updated: 2026-09-24
---

# Addendum — supporting material for the Pomodoro tracker PRD

Material that informs downstream stages (UX, architecture, decomposition) but does not belong in the PRD's requirements narrative. Sections are ordered by the stage that consumes them.

## Inputs

- Product brief FT-2: `_bmad-output/epic/planning-artifacts/briefs/brief-forge-sandbox-2026-09-24/brief.md` (final). The brief's `addendum.md` holds the competitive landscape digest (six comparables, common complaints) and the stack preference.
- Jira FT-1 description, as summarized in the brief's memlog: timer, tasks, persistence, statistics, settings; single user; SPA + REST; learning project; out of scope: multi-user, mobile, external integrations.
- The "tomato imagery" in PRD §5 comes from the brief's memlog ("tomato imagery plus something that visibly grows"). It was dropped from `brief.md` by mistake and is restored in the PRD so UX receives it.

## For UX

Web research, 2026-09-24. The competitive overview lives in the brief's addendum.

### Tab title patterns
- Pomofocus shows `MM:SS - Time to focus!` during work (verified from the live page title). Break wording and a mode-colored favicon are widely described but not verified from a primary source. TomatoTimer shows the countdown in the title; Marinara uses a toolbar badge. Sources: https://pomofocus.io/app , https://github.com/Marinara-Pomodoro-Timer
- No comparable's completion-state title could be verified; FR-11's "the title shows that an Interval ended" is this product's own choice.

### Tree lifecycle in Forest and similar apps
- Forest grows one tree per session, and an abandoned session leaves a dead tree in the forest as a record. Cumulative progress is an accumulating forest, not one ever-growing tree. Support traffic about "my tree died for no reason" and criticism of Focus To-Do's strict mode (abandoned sessions log nothing) argue against punitive mechanics. This product's Tree is non-punitive by design (PRD §5, FR-19). Sources: https://thesweetsetup.com/apps-we-love-forest/ , https://en.wikipedia.org/wiki/Forest_(application) , https://www.makeuseof.com/free-focus-to-do-app/
- Forest's behavior on tag deletion could not be verified.

### Statistics, pause, and skip conventions
- Common statistics across Pomofocus, Focus To-Do, and TickTick: pomodoros per day, focus minutes, day/week/month views, per-task breakdown. Mainstream apps use local midnight as the day boundary and attribute an entry to the day it started; a configurable day start appears only in niche trackers. The PRD's Day definition follows the mainstream. Sources: https://help.ticktick.com/articles/7055781966800486400 , https://indieapps.space/@timery/109994524981562085
- Pause and resume are common (TickTick allows at most three pauses per work session; Forest has no pause); skipping a break is offered by Pomofocus, Focus To-Do, and Marinara. No vendor documents a pause-time cap that affects completion, nor what happens to the long-break counter on reset or on a new day. The PRD states both explicitly (FR-2, FR-4), including a 30-minute pause time-out. Sources: https://blog.ticktick.com/2020/05/06/brand-new-focus-experience-ticktick/ , https://www.todoist.com/productivity-methods/pomodoro-technique

## For architecture

### Stack preference (from the brief)
Node.js backend, React frontend. The final decision belongs to the architecture stage.

### Mechanism notes (not requirements)
Browser constraints from web research on 2026-09-24, with the PRD requirement each one shapes.

- **Timer throttling (FR-6, §6 timer accuracy).** Hidden tabs get at best one-second timer granularity, and Chrome 88+ throttles chained timers to once per minute after a tab has been hidden for five minutes and silent for 30 seconds; Firefox exempts tabs with an active audio context. A countdown driven by ticks therefore drifts and fires late. Well-regarded web timers derive remaining time from a stored start or end timestamp, and some run the tick in a Web Worker, which is not subject to that throttling. Detecting the Interval end within 2 seconds from a throttled tab needs a mechanism that is not itself throttled: a Web Worker, a server-known end time, or an Alert scheduled independently of the UI loop. Sources: https://developer.chrome.com/blog/timer-throttling-in-chrome-88 , https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout , https://github.com/tibet23/Pomofocus
- **Notification permission (FR-13).** Safari and Firefox allow the permission prompt only inside a user gesture; Chrome still allows it on load but is expected to stop. Safari treats a dismissed prompt as denied for about seven days. Hence the request on the first Start and the retry button. Sources: https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API , https://pushpad.xyz/blog/the-notification-prompt-can-only-be-triggered-by-a-user-gesture-on-some-browsers
- **Notification delivery (FR-12).** Chrome, Safari, and Firefox all hand web notifications to macOS Notification Center, so a Focus mode or Do Not Disturb suppresses them silently; the notification is never the only signal. Not verified: whether a plain (non-push) notification from a hidden Safari tab is delivered identically to Chrome's; test on Safari early. Sources: https://developer.chrome.com/blog/native-mac-os-notifications , https://bugzilla.mozilla.org/show_bug.cgi?id=1219835 , https://support.apple.com/guide/safari/customize-website-notifications-sfri40734/mac
- **Audio unlock (FR-14).** Audio needs a prior user gesture in Chrome, Firefox, and Safari; an audio context created outside a gesture starts suspended. Start is that gesture, and the audio should be prepared at that moment. Sources: https://developer.chrome.com/blog/autoplay , https://developer.chrome.com/blog/web-audio-autoplay , https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/
- **Browser-side buffering (FR-17, FR-18).** The Running Pomodoro and any unsaved Pomodoro Records survive in the browser (for example, in local storage) and are reconciled with the server without duplicates; an idempotency key per Pomodoro is the obvious approach.
- **Derived Tree (FR-19).** The Tree is derived from the Completed count, including records still queued in the browser; keeping it derived avoids drift between Tree and statistics.

## Options considered and rejected

- **Local-only storage (no server).** Rejected in the brief: browser data is lost on profile resets and reinstalls, which is exactly the complaint about the category that the product wants to avoid.
- **Native menu-bar app or Electron wrapper.** Would solve visibility more directly, but the epic is explicitly a browser SPA plus REST API, and the learning goal favors that shape. Listed in Non-Goals.
- **Per-Task growth caps with "tree completion".** Considered as an answer to the brief's growth-cap question; the PRD assumes no cap (FR-20) and asks the author to confirm.
- **Skip-Break control.** Common in comparables (Pomofocus, Focus To-Do, Marinara) and present in an earlier draft of FR-5; removed because the brief's stance is that the user takes the Break the app gives. Reset remains the only way out of a Break (FR-3).
- **Unbounded automatic start after every Break.** The brief's literal "automatic transition work → break → work". Rejected in author review because a Pomodoro started while the user is away completes with nobody working and corrupts the record (PRD SM-1). Adopted instead: automatic start only when the Break end is seen, with a 60-second window to bring the tab to the front (FR-5).
- **Waiting for an explicit Start after every Break.** The opposite extreme; rejected because it reintroduces the "next interval never starts" failure the brief names when the user is present.
- **Indefinite pause.** Rejected in author review in favor of a 30-minute time-out (FR-2): a longer pause is a context switch, and an Interrupted record is more honest than a Pomodoro Completed hours later.

## Pointers for decomposition

The seven features in PRD §4 are shaped to become largely independent Stories; PRD §9.1 lists the FR ranges, the core, and the cut order. Tree (FR-19 to FR-21) and Statistics (FR-22 to FR-24) depend on Persistence (FR-16 to FR-18).
