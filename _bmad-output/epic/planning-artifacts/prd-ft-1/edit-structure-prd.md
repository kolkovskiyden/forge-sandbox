---
title: Structural editorial review — PRD: Pomodoro tracker
reviewed_file: prd.md
ticket: FT-3
parent_ticket: FT-1
created: 2026-09-24
skill: bmad-editorial-review-structure
---

# Structural editorial review: `prd.md`

Proposals only. Nothing in `prd.md` has been changed. Per the review brief, no proposal removes or merges an FR id, an `[ASSUMPTION]` tag, a `[NOTE FOR PM]` callout, a Glossary entry, or an Assumptions Index row, and no proposal renumbers sections or FRs.

## Document Summary
- **Purpose:** Product Requirements Document for a small single-user Pomodoro web app (Jira epic FT-1); it feeds UX design, architecture, and decomposition into Jira Stories. In one sentence: this document exists to help the author and the downstream AI Forge agents build v1 of Pomodoro tracker from an unambiguous, testable requirement set.
- **Audience:** The author as product owner, and downstream AI agents/engineers extracting requirements.
- **Reader type:** humans (Human-Reader Principles apply; dependency-first ordering from the LLM principles is used as a secondary lens because agents are also readers).
- **Structure model:** Strategic/Context (Pyramid) for the document as a whole; §3 Glossary and §4 Features are internally Reference/Database (consistent per-item schema).
- **Current length:** ~6,080 words across 13 top-level sections (§0 to §12), containing 7 feature groups, 27 FRs, 25 Glossary entries, 32 `[ASSUMPTION]` tags, 3 `[NOTE FOR PM]` callouts, and 30 Assumptions Index rows.

Section weights: §4 Features 2,965 words (49%), §3 Glossary 548, §2 Target User 514, §12 Assumptions Index 458, §10 Success Metrics 277, §9 MVP Scope 265, §1 Vision 226, §7 Constraints 165, §6 NFRs 138, §0 Purpose 131, §11 Open Questions 121, §5 Aesthetic 112, §8 Non-Goals 91.

Pyramid check: the document opens well (§0 reading guide, §1 vision, §2 user). It fails one Pyramid rule: the single decision that blocks the next stage (Open Question 1, "decision needed before UX work") sits at the very end and is pointed to from UJ-2 and FR-5 rather than stated up front. Otherwise the reading order is sound, the per-FR schema is consistent, and the redundancies found are small and local. This is already a dense document; the proposals below are about front-loading, single-sourcing, and one MECE gap, not about bulk.

## Recommendations

### 1. MOVE - Surface the blocking decision in §0 (Open Question 1)
**Rationale:** Pyramid ordering puts status and pending decisions first, but Q1 (bounding the automatic start after a Break, which changes FR-5, FR-15, and UJ-2) is reached only after ~5,600 words, and two earlier passages point forward to it.
**Impact:** +~25 words. Because sections must not be renumbered, do not relocate §11; instead add a two-line "Status" block at the end of §0: "Decisions needed before UX work: §11 Q1 (bounded automatic start after a Break) and Q2 (long pauses). Assumptions awaiting confirmation: §12."
**Comprehension note:** Improves orientation for the author and tells a downstream agent immediately which FRs are provisional.

### 2. CONDENSE - FR-5 `[NOTE FOR PM]` duplicates §11 Open Question 1
**Rationale:** The 79-word callout in FR-5 and the 57-word Q1 in §11 make the same argument in the same words; two copies of one line of reasoning drift when one is edited.
**Impact:** ~-45 words. Keep the callout (it must stay), but make §11 Q1 the single source of the full argument (it is the decision register) and reduce the FR-5 note to one sentence, for example: "`[NOTE FOR PM]` Automatic start after a Break can complete a Pomodoro with nobody working (UJ-2); whether to bound it is Open Question 1." UJ-2's closing sentence ("This is the risk behind Open Question 1.") already follows this pointer pattern and should stay as is.

### 3. CONDENSE - §9.2 Out of Scope restates five deferrals already fixed inline
**Rationale:** "Skipping a Break" (FR-3 assumption), "Deleting Tasks" (FR-10 NON-GOAL), "configurable Long Break cadence" (FR-25 NON-GOAL), "multiple or custom Completion Sounds" (FR-14 assumption), and "monthly and yearly statistics" (FR-24 assumption) are each stated in full twice; the consolidated list is worth keeping for decomposition, the restated wording is not.
**Impact:** ~-30 words. Turn each restated item into "item (FR-n)" and keep only the rationale that exists nowhere else: the deletion rationale (Tree and statistics consistency), the "until a month of real data exists" rationale, the "configurable Day start hour" item, and the editing-past-records item with its `[NOTE FOR PM]`. "Everything in §8" stays as the one pointer it already is.

### 4. MERGE - §9.1 In Scope bullets and the timebox paragraph into one table (with a QUESTION)
**Rationale:** The seven bullets (101 words) are a table of contents of §4 with FR ranges; the only new information in §9.1 is the 34-word timebox paragraph, and a decomposition agent needs both together as one priority-ordered list.
**Impact:** ~-35 words net. Proposed shape: Feature group | FRs | Timebox priority (Core / Keep / First to cut).
**Comprehension note:** Building the table exposes a MECE gap the prose hides: the timebox paragraph names the Core (Timer, Alerts and visibility, Persistence, Tasks) and the first cuts (Week view, Garden, Settings screen), but leaves Tree (FR-19, FR-20), Today at a glance (FR-22), and Day view (FR-23) unclassified. QUESTION for the author: which tier do those three belong to? No idea is challenged; the list is simply incomplete as a priority order.

### 5. CUT - §2.2 Non-Users (v1)
**Rationale:** Every bullet exists elsewhere in stronger form: "anyone other than the author / no accounts" is in the §2 lead ("no secondary users, no team, and no visitors"), §7 (single user, no authentication), and §8; "mobile or tablet users" is in the §2 lead ("desktop browser on macOS") and §8; "not a task manager" is in the §4.2 description, the Glossary entry for Task, and §8.
**Impact:** ~-48 words.
**Comprehension note:** This cut may impact reader comprehension/engagement only in one respect: "Tasks here are labels for Pomodoros, not a to-do system" is a useful early mental model. If the author wants it before §4, append that one sentence to the §2 lead paragraph (+~10 words) rather than keep a subsection.

### 6. MOVE - The one new requirement buried in §6 belongs in FR-6
**Rationale:** §6 restates numeric bounds that already live in FR-6, FR-12, FR-14, FR-16, FR-18, and FR-27, but hides one requirement that appears nowhere in §4: "While the app is open, an Interval end is detected within 2 seconds of its scheduled end, in a background tab as well"; a Story cut from FR-6 would miss it.
**Impact:** ~-15 words net. Move that sentence into FR-6's consequences (next to the 1-second display bound), then reduce §6's "Timer accuracy" and "Alert latency" bullets to one-line pointers ("see FR-6", "see FR-12, FR-14"). Keep "Durability", "Browser support" (carries an `[ASSUMPTION]`), "Keyboard operability", and "Privacy" as they are; they are not restated elsewhere. Numbers should live once, in the FRs that Stories are decomposed from.

### 7. CONDENSE - "Timer-first" is stated four times
**Rationale:** §1 Vision ("tables come second"), the §4.6 description ("Statistics are secondary to the timer and the Tree in the interface"), FR-22 ("they sit alongside, not above, the timer"), and §5 "Timer-first" all say the same thing; three of the four earn their place (vision, testable consequence, design principle), the §4.6 sentence does not.
**Impact:** ~-12 words. Drop the last sentence of the §4.6 description; keep the other three occurrences.

### 8. CONDENSE - §10 Success Metrics introduction
**Rationale:** The 67-word intro makes two points (the process criterion is tracked outside this PRD; product metrics are checked against a daily note because there is no telemetry) that fit in two short sentences.
**Impact:** ~-25 words. No content lost; SM-1 to SM-C2 unchanged.

### 9. CONDENSE - §11 closing paragraph duplicates §12
**Rationale:** The 35-word paragraph lists three assumptions by name (FR-21, FR-20, FR-6) that are already rows in §12; the reason they are named is that they answer questions the brief left open, and that signal is more useful next to the rows the author will tick.
**Impact:** ~-20 words. Replace with one sentence ("Assumptions awaiting confirmation are indexed in §12.") and, if the signal matters, suffix those three rows in §12 with "(answers a brief question)". Rows are not removed or merged.

### 10. MOVE - Cross-reference the "one live instance" constraint from the Alerts feature
**Rationale:** §7 is the only place that says which instance issues Alerts when two tabs are open; an agent extracting FR-12 or FR-14 into a Story will not read §7.
**Impact:** +~10 words. Add a parenthetical in the §4.3 description or in FR-12 ("issued by the instance that started the Interval; see §7 One live instance"). The `[ASSUMPTION]` in §7 stays where it is.

### 11. QUESTION - Add a Timer State transition overview at the top of §4.1
**Rationale:** FR-1 to FR-6 describe one state machine (Idle / Running / Paused; Work Interval to Break to Work Interval; Reset paths; closed-app catch-up) across ~750 words of prose, and "overview before details" is the cheapest way to let UX and architecture verify FR-3, FR-4, FR-5, and FR-6 against each other at a glance.
**Impact:** +~60 words (a small table: current state and Interval type | event | next state | record written | Alert issued). FR text unchanged.
**Comprehension note:** Strong positive for human readers; optional. The only visual/structural aid proposed for the 49% of the document that is FR bullets.

### 12. CONDENSE - Micro-restatements inside §4 (hand to the prose pass)
**Rationale:** A few consequences restate what an adjacent consequence or FR already fixes: FR-3's third consequence repeats the Idle-state facts of its first two and of FR-1's assumption; FR-12's last consequence takes two sentences for one point; FR-17's second consequence is a pure pointer to FR-6.
**Impact:** ~-20 words. Below the structural threshold; listed so the prose review picks them up rather than treating them as structure.

### 13. PRESERVE - §3 Glossary placed before §4, in its current conceptual grouping
**Rationale:** Dependency-first ordering is what makes §4 unambiguous for downstream agents (§0 says downstream documents must use these terms exactly), and the current grouping (Task terms, Interval terms, record terms, Tree terms, state and Alert terms, time terms, Settings) matches the order a first-time reader meets the concepts; alphabetizing would help random access and hurt the first read.
**Impact:** 0 words (548 words kept).

### 14. PRESERVE - §12 Assumptions Index
**Rationale:** It is redundant by design; it is the author's confirmation checklist and the only place all 30 open inferences can be reviewed together.
**Impact:** 0 words (458 words kept). Optional format change only, no row changes: a three-column table (§/FR | assumption | confirmed?) turns it into a working checklist for author review.

### 15. PRESERVE - §2.3 Key User Journeys and the §4 per-item schema
**Rationale:** The three journeys (~330 words) are the only narrative anchor in the document and each is traced from a feature description ("Realizes UJ-n"); the "Description / FR / Consequences (testable)" schema is consistent across all 27 FRs, which is exactly what Reference-model extraction needs.
**Impact:** 0 words. Do not compress the journeys into bullets or vary the FR schema.

### 16. PRESERVE - §0 reading guide, §5 Aesthetic and Tone, §8 Non-Goals
**Rationale:** Each is short (131, 112, and 91 words), non-overlapping in purpose, and answers a question a downstream stage will otherwise ask (how to read the document; what the interface should feel like; what not to build).
**Impact:** 0 words.

## Summary
- **Total recommendations:** 16 (1 CUT, 1 MERGE, 3 MOVE, 6 CONDENSE, 1 QUESTION, 4 PRESERVE; recommendation 4 also carries a QUESTION)
- **Estimated reduction:** cuts of ~250 words (recommendations 2 to 9 and 12) against ~35 words added by recommendations 1 and 10, for a net ~-215 words (~3.5% of original); if the optional transition table in recommendation 11 is added, net ~-155 words (~2.5%).
- **Meets length target:** No target specified. The document is already dense; the value here is front-loading the blocking decision (1), single-sourcing duplicated reasoning and numbers (2, 3, 6), and closing the timebox MECE gap (4), not the word count.
- **Comprehension trade-offs:** Recommendation 5 removes a persona-framed subsection whose content survives in §2, §4.2, §7, and §8 (with an optional one-sentence carry-over). Recommendation 7 removes a section-level orienting sentence that FR-22 already makes testable. No visual aids, examples, journeys, or summaries are cut; recommendation 11 adds one visual aid.
