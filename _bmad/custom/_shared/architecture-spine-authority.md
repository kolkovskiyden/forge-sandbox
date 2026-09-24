# Architecture spine authority

The canonical story-level architecture contract is `{planning_artifacts}/**/ARCHITECTURE-SPINE.md`.

- For userstory-scoped architecture, a spine is authoritative only when its frontmatter contains both `status: final` and `altitude: user-story`. A missing, non-final, or wrong-altitude spine is non-authoritative and must never be hidden by a fallback.
- Cite the spine's local `AD-n` and inherited `initiative-ADRn` / `epic-ADRn` IDs directly; do not derive a separate requirement namespace.
- Only when no canonical spine exists may the exact legacy `{planning_artifacts}/architecture.md` file be read as migration context.
- Architecture context is optional for quick_flow implementation workflows: its absence is non-blocking.
