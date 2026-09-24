# Editorial Review (Structure) — `addendum.md`

Reviewed: `_bmad-output/epic/planning-artifacts/prd-ft-1/addendum.md` against `prd.md` (context only). Proposals only; nothing has been changed. Line numbers refer to the current `addendum.md`.

## Document Summary
- **Purpose:** Supporting addendum to the Pomodoro tracker PRD: research digests, mechanism notes for architecture, rejected options, and decomposition pointers that must not clutter the PRD.
- **Audience:** Architects, UX designers, and AI agents running the downstream stages (UX, architecture, decomposition).
- **Reader type:** humans
- **Structure model:** Reference/Database. Readers arrive by role and jump to one section; they do not read linearly. The model's rules are random access, MECE sections, and a consistent per-item schema. The research bullets already follow an implicit schema (finding → PRD consequence → sources → "not verified" caveat); the proposals below make it explicit and remove the places where the same finding is stated twice.
- **Current length:** 1,234 words across 6 sections (plus title and a one-line intro).
- **Structure map (words):** title+intro 17 · Inputs 50 · Technical preferences 53 · Mechanism notes 250 · Options considered and rejected 177 · Pointers for decomposition 63 · Research digest 567.
- **One-sentence purpose:** This document exists to help architects, UX designers, and downstream agents find the evidence, mechanisms, rejected alternatives, and decomposition hints behind the PRD's requirements without those cluttering the PRD.

**Boundary respected:** no proposal removes a source URL, a "not verified" statement, or a decision rationale. Cuts target only text that is repeated inside the addendum or repeated verbatim from the PRD (where a link replaces the repeat).

## Recommendations

### 1. MERGE - Research digest block "Notifications and background tabs on macOS desktop browsers" (lines 48–52) into "Mechanism notes for architecture" (lines 24–26)
**Rationale:** Three of the four mechanism notes are restated in this research block with the same FR cross-reference (throttling → FR-6 at lines 24 and 52; permission-in-gesture → FR-13 at lines 25 and 48; audio-gesture → FR-14 at lines 26 and 51), so the architect must read two sections to get one story, and the two copies can drift.
**How:** One bullet per mechanism, each with the facts, the PRD consequence, the source URLs, and any "not verified" line. Suggested bullets: (a) timers in hidden tabs → FR-6 and the 2-second end-detection NFR (fold line 52 into line 24, keep the Chrome 88 specifics, the Firefox audio-context exemption, the Web Worker / server-known end time / independent Alert scheduling candidates, and the three sources); (b) notification permission → FR-13 (fold line 48 into line 25, keep the Chrome "expected to stop" note and both sources); (c) notification delivery under Focus/DND → FR-12 (line 49 moves as is, plus line 50's Safari "not verified" caveat and its test instruction); (d) audio autoplay → FR-14 (fold line 51 into line 26, keep the three sources). Adjust the research-digest intro (line 45) so its first sentence no longer claims to cover Alert and visibility constraints.
**Impact:** ~95 words (the overlapping explanations only; every fact, URL, and caveat survives).
**Comprehension note:** Improves comprehension: sources travel with the claim they support, and the architect reads one place. The section grows to ~300 words, which the one-bullet-per-mechanism schema keeps scannable.

### 2. CONDENSE - "Pointers for decomposition" (line 41)
**Rationale:** The seven feature groups with their FR ranges are listed identically in PRD §9.1 In Scope; the addendum's own contribution is the independence claim, the Persistence dependency, and the pointer to the cut order.
**How:** "PRD §9.1 lists the seven feature groups with their FR ranges and the cut order; they are shaped to become largely independent Stories. Persistence (FR-16 to FR-18) is the natural dependency for Tree and Garden and for Statistics."
**Impact:** ~35 words.
**Comprehension note:** None lost; the reader who decomposes has the PRD open anyway.

### 3. CUT - "Technical preferences" bullet 2 (line 20: the brief names the three Alert channels; PRD states outcomes FR-11 to FR-15; UX and architecture choose)
**Rationale:** PRD §4.3's description says the same thing in nearly the same words ("The brief names the three channels, tab title, system notification, and sound; this section states what each must achieve, and UX and architecture decide how"), and the one extra token here ("browser Notification API") is named in the merged mechanism notes (Rec. 1).
**Impact:** ~39 words.
**Comprehension note:** None; this is a restatement, not a rationale or a source.

### 4. MERGE - Remaining "Technical preferences" bullet (line 19, stack preference) into the architecture section as its first bullet
**Rationale:** After Rec. 3 the section holds one 14-word bullet; the stack preference is architecture-facing material and belongs with the mechanism notes, but PRD §7 links here by name for it, so the merged heading must keep the words "stack preference" (suggested: "For architecture: stack preference and mechanism notes").
**Impact:** ~10 words (heading and section overhead); section count 6 → 5.
**Comprehension note:** Findability preserved by the heading; the PRD §7 pointer still resolves.

### 5. MOVE - Tomato-imagery provenance bullet (line 29) out of "Mechanism notes for architecture (not requirements)" into "Inputs"
**Rationale:** It is a UX provenance note (a phrase dropped from brief.md by mistake, restored so UX receives it) sitting in a section whose title scopes it to architecture mechanisms, so the UX reader who needs it will not look there.
**How:** Attach it to the brief bullet at line 14 as a sub-point: "Its memlog holds the phrase 'tomato imagery plus something that visibly grows', which was dropped from brief.md by mistake; PRD §5 restores it for UX."
**Impact:** 0 words.
**Comprehension note:** Improves MECE of the section headings; the UX reader finds it where inputs are catalogued.

### 6. QUESTION - Dangling cross-reference "Open Question 4" (line 66)
**Rationale:** PRD §11 lists two Open Questions; long pauses is Open Question 2, so the addendum currently points at a question that does not exist.
**How:** Author to confirm the intended target and change the number (most likely "Open Question 2"). Line 37's "Open Question 1" is correct.
**Impact:** 0 words.
**Comprehension note:** A downstream agent following the reference today finds nothing.

### 7. CONDENSE - "Options considered and rejected" → Skip-Break bullet (line 36)
**Rationale:** The comparables list (Pomofocus, Focus To-Do, Marinara) appears again word for word in the pause/reset/skip research bullet (line 66), and "Reset remains the only way out of a Break (FR-3)" repeats the PRD FR-3 assumption text; the rationale worth keeping is that it was in an earlier draft of FR-5 and was removed because of the brief's stance.
**How:** "Skip-Break control. Common in comparables (see the pause/reset/skip conventions below) and present in an earlier draft of FR-5; removed because the brief's stance is that the user takes the Break the app gives (FR-3)."
**Impact:** ~15 words.
**Comprehension note:** Rationale intact; one list of comparables instead of two.

### 8. CONDENSE - "Options considered and rejected" → growth-cap bullet (line 35) and explicit-Start bullet (line 37)
**Rationale:** Each ends by restating the PRD's own status text (FR-20's assumption tag; the Open Question 1 framing), which the reader reaches by following the FR/OQ pointer; the option name and the reason it was rejected are the parts that earn their place.
**How:** Line 35 → "Per-Task growth caps with 'tree completion'. Considered as an answer to the brief's growth-cap question; not adopted (FR-20, pending author confirmation)." Line 37 → keep "the safer alternative to the brief's automatic work → break → work transition" and "because the brief's decision was confirmed by the author"; replace the middle clause with "(PRD Open Question 1)".
**Impact:** ~20 words combined.
**Comprehension note:** The rationale sentences ("safer alternative", "confirmed by the author") stay; only the restated PRD status goes.

### 9. MOVE - Reorder sections by downstream reading order and expose the research blocks as headings
**Rationale:** In a reference document readers jump by role; today the UX-facing research sits last under bold labels that do not appear in any outline, and "Options considered and rejected" cites comparables (skip-Break, Forest's tree lifecycle) that are only introduced two sections later.
**How:** Order after Recs. 1–5: (1) Inputs, (2) For architecture: stack preference and mechanism notes, (3) Comparable-product conventions (web research, 2026-09-24) — the remaining research: tab title patterns, tree lifecycle, statistics conventions, pause/reset/skip conventions, (4) Options considered and rejected, (5) Pointers for decomposition. Promote the four remaining bold labels to `###` headings. Rename "Research digest" as shown, since after Rec. 1 it holds only comparable-product conventions and the intro line ("The competitive overview lives in the brief's addendum") already positions it that way.
**Impact:** 0 words.
**Comprehension note:** Improves scanning and gives the rejected-options section its scaffolding; nothing is removed.

### 10. PRESERVE - Every source URL and every "not verified" statement (lines 50, 55, 56, 60, and the unverified break-wording/favicon note in line 55)
**Rationale:** They are the only record of which claims rest on primary sources and of what architecture and UX must test themselves (notably Safari notification delivery from a hidden tab); removing them would silently upgrade secondary-source claims to facts.
**Impact:** 0 words (kept in full under Rec. 1's merge).

### 11. PRESERVE - Mechanism notes on offline reconciliation and the derived Tree (lines 27–28)
**Rationale:** Neither the idempotency-key approach for FR-17/FR-18 nor "keep the Tree derived from the Completed count to avoid drift" appears in the PRD; they are the architecture-facing substance that justifies the section's existence.
**Impact:** 0 words.

### 12. PRESERVE - "Inputs" bullet 2, the FT-1 Jira summary (line 15)
**Rationale:** It looks like a repeat of PRD §0/§7/§8 but is the only record of what the Jira description contained when the PRD was written, which the PRD's `[NOTE FOR PM]` (tree and notifications absent from Jira) relies on for tracing.
**Impact:** 0 words.

### 13. PRESERVE - The "This is why FR-13…" / "FR-12 therefore…" / "FR-6 … are written against this" clauses in the research bullets
**Rationale:** These clauses turn a research fact into a traceable decision rationale; without them the digest is trivia, and they are exactly the kind of rationale the review brief protects.
**Impact:** 0 words (they move with their bullets under Rec. 1 rather than being cut).

## Summary
- **Total recommendations:** 13 (1 CUT, 2 MERGE, 2 MOVE, 3 CONDENSE, 1 QUESTION, 4 PRESERVE)
- **Estimated reduction:** ~214 words (~17% of 1,234), from 6 sections to 5 (plus 4 new `###` subsections that add navigation, not text)
- **Meets length target:** No target specified. The brief was "cut anything that does not earn its place"; every proposed cut is either internal duplication (Recs. 1, 7) or a verbatim repeat of PRD text that a pointer replaces (Recs. 2, 3, 8).
- **Comprehension trade-offs:** None of the cuts remove a fact, URL, caveat, or rationale. The only reader-side cost is that the architecture section grows to ~300 words after Rec. 1; the one-bullet-per-mechanism schema and the `###` headings from Rec. 9 offset it. Rec. 6 is a correctness fix to a dangling reference rather than an editorial preference and should be applied regardless of the others.
