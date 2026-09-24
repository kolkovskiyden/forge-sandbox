## 2026-09-24 — FT-4 drift resolutions (archival gate, --with-code)

- Server refuses non-loopback Host names and large bodies — medium — kept code.
  Code: apps/server/src/app.ts:23, :60–61 (Host check, 403), :17, :67–69 (16 KB limit, 413).
  Confirmed: "It also refuses requests addressed to any host name other than `localhost`, `127.0.0.1` or `[::1]`, and request bodies larger than 16 KB." (Deliverable 1); spec: "It refuses requests whose Host is not a loopback name (403) and bodies over 16 KB (413)."
  Affected statements: FT-4 (ticket) Deliverable 1; the story doc (story-ft-4-task-picker.md:30); the spec (:30).
  Write-back: pending.

- Screens built from Tailkit free components; the rest hand-written — low — kept code.
  Code: apps/web/src/components/EmptyState.tsx:1, TimerPlaceholder.tsx:1, TomatoIcon.tsx:1 ("Not from Tailkit"); AppShell.tsx:1, TaskNameForm.tsx:1, TaskPicker.tsx:1, SectionHeading.tsx:1 ("Adapted from Tailkit (free)").
  Confirmed: "…not installed as a runtime package; parts the free set does not offer (the empty state, the tomato timer placeholder) are hand-written in the same style." (Deliverable 8); spec: components "copied from Tailkit's free set, chosen with the author".
  Affected statements: FT-4 (ticket) Deliverable 8; the story doc (:37); the spec (:19, :30, :84; agrees at :94).
  Write-back: pending.

- API error codes include internal_error — low — kept code.
  Code: packages/shared/src/errors.ts:9; apps/server/src/app.ts:89.
  Confirmed: "Error codes are `name_required`, `name_too_long`, `duplicate_name`, `invalid_request`, `not_found` and `internal_error`."
  Affected statements: the spec (:30; agrees at :109).
  Write-back: pending.

- Database backstop folds ASCII letters only — low — kept code.
  Code: apps/server/src/migrations.ts:15; packages/shared/src/task.ts:61; apps/server/src/tasks.ts:51.
  Confirmed: "…is enforced by the API for all letters, and backed up by the database (a unique index on the lower-cased name limited to Open Tasks, which folds ASCII letters only)." (Deliverable 3)
  Affected statements: FT-4 (ticket) Deliverable 3; the story doc (:32); the spec agrees (:108).
  Write-back: pending.

- Task names are normalized before the rules apply — low — kept code.
  Code: packages/shared/src/task.ts:39–41, :49.
  Confirmed: "The name is normalized (Unicode NFC, line breaks and tabs turned into spaces, zero-width spaces removed) and trimmed of leading and trailing whitespace; it must not be empty after trimming, and a name made only of invisible characters counts as empty" (Deliverable 5); spec Design Notes gains the same rule.
  Affected statements: FT-4 (ticket) Deliverable 5; the story doc (:34); the spec (I/O Matrix Create and Empty name rows; Design Notes).
  Write-back: pending.

- Write-back: the spec (spec-ft-4-create-rename-pick-tasks.md) — written, 6 edits across 4 drifts.
- Write-back: the story doc (story-ft-4-task-picker.md) — written, 4 edits across 4 drifts.
- Write-back: FT-4 (ticket) — written, 4 edits across 4 drifts (description re-fetched and unchanged before the write).

## Not reached
- AC4 machine reboot — not run; server restart only
- AC3 browser quit and reopen — reload and localStorage persistence checked, full browser restart not run
- Deliverable 8 "calm and plain" — visual tone; nothing in the code to compare against
