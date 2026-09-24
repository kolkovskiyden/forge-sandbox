# Deferred work

- source_spec: `_bmad-output/story/implementation-artifacts/spec-ft-4-create-rename-pick-tasks.md`
  summary: Keep the Current Task in step across open tabs of the same browser (listen for the `storage` event).
  evidence: FT-4 review (Edge Case Hunter). Picking different Tasks in two tabs leaves each showing its own choice until reload. Belongs with the timer story's same-browser tab sync (epic-ADR4).
- source_spec: `_bmad-output/story/implementation-artifacts/spec-ft-4-create-rename-pick-tasks.md`
  summary: Add component tests for the Task Picker, create/rename forms and stale-Current-Task clearing.
  evidence: FT-4 review (Blind Hunter). Only `resolveCurrentTask` is unit-tested on the web side. Testing Library is not an approved dependency yet (epic-ADR9 allows it where logic lives in components).
