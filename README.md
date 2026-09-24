<!-- VENTION-SDLC-MANAGED:BEGIN -->
## Vention SDLC workspace — managed by `vsdlc`

This README block is managed by the Vention SDLC framework (`@vention/sdlc`).
The bytes between the BEGIN / END markers are rewritten on every `vsdlc install` run.

- **Workspace:** `forge-sandbox` (scenario: `single-repo`)
- **Issue tracker:** `jira` at `https://cyber-sun.atlassian.net` (project: `FT`)

## Getting started

New developers landing in this workspace should run the following steps in order:

- Clone the workspace repository with `git clone` and `cd` into the resulting directory.
- Install the per-developer environment by running `vsdlc install` from the workspace
  root. The framework will scaffold the IDE wiring, hook configurations, and shell-rc
  managed blocks for your machine.
- Install the toolchain by running `mise install` after `vsdlc install` completes. The
  per-tool versions are pinned by the framework so every workspace member runs the same
  binaries.

Refer to your team's onboarding notes OUTSIDE the BEGIN / END markers for any
team-specific steps not covered above. See `AGENTS.md` for the full agent guide
(work types, MCP usage, slash-command catalogue, hook behaviour).

## Issue tracker integration

The framework wires this workspace to the configured issue tracker via the
`issue-tracker` capability adapter.

- **Adapter:** `jira`
- **Base URL:** `https://cyber-sun.atlassian.net`
- **Project key:** `FT`
- **Auth:** browser OAuth session managed by the vendor CLI (see the adapter's
  `SKILL.md` for the exact re-login command); the framework stores no token.

Agents that need to read or write issue-tracker state MUST go through the adapter
operations — never call the vendor CLI or vendor MCP tool directly.

## AI Forge integration

The framework uses the AI Forge platform for metric-event submission on unit-of-work
completion. The in-scope MCP tool family is `mcp__AI-Forge__*` (chiefly
`track_metric_event`); the MCP server registry key in `.mcp.json` is `AI-Forge`.


This workspace is bound to an AI Forge workspace id. The
`Workspace-Id-Readable: ai-belarus-dk` header binds Forge MCP events to the right tenant.

## What this block is

Everything between the BEGIN / END markers is framework-managed and gets rewritten on
every `vsdlc install`. Add your team's onboarding notes OUTSIDE the markers — they will
be preserved byte-for-byte across upgrades.

> Run `vsdlc install` to refresh this block. Do not edit between the markers.
<!-- VENTION-SDLC-MANAGED:END -->
