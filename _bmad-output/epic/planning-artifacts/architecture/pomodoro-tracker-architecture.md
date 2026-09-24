---
date: 2026-09-24
author: Denis
status: completed
# draft     — one or more ADRs are still open
# completed — all ADRs are decided and the document is finalized
inputDocuments:
  - _bmad-output/epic/planning-artifacts/prd-ft-1/prd.md
  - _bmad-output/epic/planning-artifacts/prd-ft-1/addendum.md
  - _bmad-output/epic/planning-artifacts/briefs/brief-forge-sandbox-2026-09-24/brief.md
  - _bmad-output/epic/planning-artifacts/briefs/brief-forge-sandbox-2026-09-24/addendum.md
  - _bmad-output/epic/planning-artifacts/ft-1-drift-resolutions.md
  - .mise.toml (toolchain pins: Node 22, @playwright/cli)
---

# Epic Architecture: Pomodoro tracker

## Summary

Epic FT-1 delivers a single-user, no-login Pomodoro web app: a browser SPA backed by a small REST API with persistent storage, running on the author's macOS machine. The PRD's hard parts are not the CRUD screens but three cross-cutting mechanics: a timer that is always right regardless of tab throttling or sleep (FR-6), Interval-end Alerts delivered within 2 seconds from a background tab (FR-11 to FR-14), and "no finished Pomodoro goes unrecorded" even when the server is down (FR-18), with a second tab showing the same state and only the owning tab alerting (§7, narrowed to same-browser tabs in ADR4).

**Fixed inputs (not ADRs).** Set by the architect before this document and by the PRD:

- Backend: Node.js 22 (pinned in `.mise.toml`) + TypeScript, ESM.
- Frontend: React + Vite + TypeScript.
- Storage: SQLite, one file on the author's machine.
- Single user, no authentication, server bound to localhost only, zero recurring cost, no third-party runtime calls, no telemetry (PRD §6, §7, §8).
- Guiding principle from the architect: keep it minimal. Every decision below favours the least added code and dependencies.

**Codebase state.** The repository is greenfield: no application code, no `package.json`, no CI. Every ADR here is a first-time choice, not a change to an existing pattern.

This document records nine epic-level decisions. Everything else (exact endpoints, field names, component tree, Tree visuals) is left to story-level implementation and the UX stage.

---

## ADR1: Repository layout, toolchain, and run topology

The server and the client share one contract (Task, Pomodoro Record, Settings, Timer State). How the code is laid out decides whether that contract is shared by import or by copy, and how the app is started in development and in daily use. Notification permission and audio unlock are per browser origin, so the production origin should be a single stable `http://localhost:<port>`.

**Status:** decided

### Decision

**An npm workspaces monorepo with one production origin.** Three workspaces: `apps/server` (Node 22 + TypeScript, ESM, `tsx watch` in dev, `tsc` build), `apps/web` (React + Vite + TypeScript), `packages/shared` (zod schemas and the TypeScript types inferred from them: Task, Pomodoro Record, Settings, the timer state machine, the statistics aggregation). Root scripts: `dev` starts both processes with Vite on 5173 proxying `/api` to the server on 3000; `build` builds both; `start` runs the server, which serves `apps/web/dist` and the API from a single `http://localhost:3000`. The SQLite file lives at `./data/pomodoro.sqlite` (gitignored); port and file path are overridable by environment variables.

### Rationale

The contract is shared by import rather than by copy, so client and server cannot drift. Node and DOM type environments stay separate, which avoids the tsconfig juggling of a single package. One origin in daily use means notification permission and audio unlock are granted once and never lost by switching ports. The setup cost is one short scaffolding story.

## ADR2: Backend HTTP framework and API contract style

The API is tiny (Tasks, Pomodoro Records, Settings, a singleton Timer State) but must validate input, serve the built SPA, and be easy to test without a network. The framework choice fixes how validation, static serving and testing are done in every server story.

**Status:** decided

### Decision

**Hono on `@hono/node-server` with zod validation from `packages/shared`.** REST JSON, resource-oriented routes under `/api` (tasks, pomodoros, settings). Request bodies are validated with `@hono/zod-validator` against the shared schemas; the client parses responses with the same schemas. The built SPA is served with Hono's `serveStatic`. Error responses use one shape, `{ error: { code, message } }`. No OpenAPI generation. Tests call `app.request()` in-process.

### Rationale

Hono is the smallest framework that still gives typed routes, validation and static serving, and it is testable without opening a port. Fastify would work equally well but adds plugin encapsulation and type-provider concepts this three-resource API does not need. Express 5 would require extra libraries for everything the other two include.

## ADR3: SQLite driver, schema conventions, and migrations

Durability (PRD §6) rests on SQLite; the driver and migration approach decide how every table is created and evolved. Node 22 ships `node:sqlite` (unflagged since 22.13), so a zero-dependency option exists. The data model is three tables: `tasks`, `pomodoros`, `settings` (single row). The running timer is not stored on the server (ADR4).

**Status:** decided

### Decision

**Built-in `node:sqlite`, hand-written SQL, migrations tracked by `PRAGMA user_version`.** The server opens the database with `journal_mode=WAL` and `foreign_keys=ON`, then applies numbered SQL migration scripts inside one transaction, advancing `user_version` after each. Three tables: `tasks`, `pomodoros`, `settings` (single row). Conventions: timestamps are INTEGER epoch milliseconds in UTC; ids are TEXT UUIDs (client-minted for pomodoros, see ADR6); Task-name uniqueness among Open Tasks is a partial unique index on `lower(name)` where the Task is not Done. Tests use `:memory:`. If `node:sqlite` proves unstable, `better-sqlite3` is the drop-in replacement with a near-identical prepare/run/get/all API.

### Rationale

Zero native dependencies and no build step on a three-table schema; SQL stays visible, which suits a learning project. The residual risk of the module's "active development" label is contained to one database module with a known one-file fallback.

## ADR4: Timer authority and the "one live instance" model

The PRD requires: remaining time derived from timestamps, never ticks (FR-6); a Running or Paused Pomodoro survives reload and browser restart (FR-17); the timer keeps working when the server is unreachable (FR-18); a second tab or browser shows the same state, and only the instance that started the Interval issues Alerts (§7); automatic start after a Break depends on whether the end was seen in the browser (FR-5). Where the Running Interval lives decides the shape of the whole timer feature.

**Status:** decided

### Decision

**Client-only timer, no server mirror.** The running Interval `{ kind, taskId, pomodoroId, startedAt, endsAt, pausedAt, pausedTotalMs, instanceId }` lives in `localStorage` as the single source of truth. Every transition is broadcast on a `BroadcastChannel`, so other tabs of the same browser show the same state immediately; the tab that pressed Start (an `instanceId` kept in `sessionStorage`) is the owner and is the only one that issues Alerts and writes Pomodoro Records. On load a tab reconciles from `localStorage` and applies the FR-6 rules (Work Interval end passed while closed → Completed at scheduled end; Break end passed → Idle; pause time-out passed → Interrupted). The server stores no timer state: there is no `timer_state` table and no `/api/timer` endpoint. PRD §7 "a second open tab or browser shows the same state" is narrowed by the architect to **tabs of the same browser**; a second browser sees the same Pomodoro Records (FR-16) but not a Running Interval.

### Rationale

The architect confirmed on 2026-09-24 that same-browser tabs are sufficient. Dropping the mirror removes an endpoint, a table, a polling loop and a two-copy reconciliation for a capability with no real use for one person on one machine. The timer becomes a pure state machine over timestamps in `packages/shared`, fully testable with a fake clock, and keeps working with the server down (FR-18). The PRD should be amended to record the narrowed §7 wording.

## ADR5: Interval-end detection and Alert delivery under tab throttling

FR-6, FR-12 and FR-14 demand end detection and Alerts within 2 seconds while the tab is in the background. Chrome 88+ throttles page timers in hidden tabs to once per minute after five minutes hidden; Safari and Firefox throttle to at best one second. A mechanism that is not itself throttled is required (PRD addendum, mechanism notes). Notification and audio need a user gesture for permission and unlock, and macOS Focus mode may swallow notifications, so the tab title and the return-to-app summary must stand alone.

**Status:** decided

### Decision

**A dedicated Web Worker schedules Interval ends; the main thread performs the Alert.** The main thread posts the current schedule (`endsAt`, or "paused") to a module Web Worker, which arms one `setTimeout` for `endsAt` plus a 1-second tick and posts `tick` and `ended` messages. On `ended` the owning tab runs the state transition (ADR4), appends the Pomodoro Record to the outbox (ADR6), shows `new Notification(...)`, plays the Completion Sound and updates `document.title`. On `visibilitychange`, `focus`, `online` and `pageshow` the main thread recomputes from the clock to cover system sleep. The `AudioContext` is created or resumed and the single built-in sound decoded inside the Start click handler; notification permission is requested inside the first Start handler and never again automatically (FR-13). The title is set on every worker tick, satisfying FR-11 in foreground and background. Chrome and Safari background-tab behaviour is verified by a manual checklist in the Alerts story.

### Rationale

Chrome documents that intensive timer throttling applies to page timers, not to workers, and worker messages wake the page's event loop, so the 2-second bound (FR-6, FR-12, FR-14) is met without any server or push infrastructure. Main-thread timers are rejected on that same documented behaviour. Web Push would require vendor push services, which PRD §6 forbids, and the PRD does not require Alerts while the app is closed.

## ADR6: Durable submission of Pomodoro Records (offline outbox and idempotency)

FR-18: a record that cannot reach the server is kept in the browser and submitted later without duplicates, with a "not saved yet" indicator; FR-4 requires the Completed record to be stored locally before the Break is shown. The deduplication strategy decides the write API's shape.

**Status:** decided

### Decision

**Client-minted UUID per Pomodoro, `localStorage` outbox, idempotent `PUT /api/pomodoros/:id`.** The id is created at Start as part of the running-Interval record. At Interval end the finished record is appended to the outbox first (satisfying FR-4's "stored locally before the Break is shown"), then sent with `PUT`; the server upserts by primary key, so retries are no-ops. Retries fire on the `online` event, on the tab becoming visible, on app load, and by a capped exponential backoff while the outbox is non-empty. The "not saved yet" indicator (FR-18) is "outbox length > 0". Tasks and Settings are online-only and have no outbox.

### Rationale

Deduplication falls out of the primary key, so no idempotency table or header protocol is needed. The four retry triggers cover every way the server can come back. Keeping Tasks and Settings online-only avoids building a generic sync layer the PRD does not ask for.

## ADR7: Where statistics and Tree sizes are computed

FR-19 and FR-22 require the Tree size and today's numbers to include Completed records that have not yet reached the server. Day and Week boundaries are defined in the browser's local time zone (PRD §3). Both facts push the arithmetic toward the browser; the question is how far.

**Status:** decided

### Decision

**Client-side aggregation over a range query.** The server exposes `GET /api/pomodoros?from=<ms>&to=<ms>` returning raw records in a half-open epoch range, and `GET /api/tasks` returning each Task with its server-side `completed_count`. The client computes the local Day or Week range, fetches the rows, merges outbox records, and aggregates per Day and per Task with pure functions in `packages/shared`. Tree size is `completed_count` plus outbox Completed records for that Task and is never stored.

### Rationale

Unsynced records are included by construction (FR-19, FR-22), local-midnight Day and Monday-start Week boundaries are computed in the only place that knows the browser's time zone, and the server has no statistics endpoints or stored counters to drift. Data volume is a few dozen rows per Week.

## ADR8: Frontend state, data fetching, and navigation

The client has two kinds of state: the timer machine (owned locally, persisted to `localStorage`, driven by worker messages and by clicks) and server resources (Tasks, Pomodoro Records, Settings) that need caching and refetching after mutations. The app has five views: Main, Day, Week, Garden, Settings.

**Status:** decided

### Decision

**Zustand for the timer machine, TanStack Query for server resources, no router.** The timer store is a vanilla Zustand store, driven from the worker message handler and from clicks outside React, with the `persist` middleware to `localStorage` and a `BroadcastChannel` listener for same-browser tab sync (ADR4). TanStack Query owns fetching, cache invalidation after mutations, retry and refetch on window focus for Tasks, Pomodoro Records and Settings. Navigation is a `view` value (Main, Day, Week, Garden, Settings) held in state or `location.hash`; no router library. Styling is plain CSS modules with no UI framework.

### Rationale

Two small, well-known libraries replace exactly the code that hides bugs: cache invalidation and retry. A store that lives outside React is the natural home for a state machine driven by worker messages and storage events. Five sibling views do not justify a router.

## ADR9: Test infrastructure

The riskiest logic is time arithmetic (FR-6, FR-2 time-out, FR-5 seen-end window, Day/Week bucketing) and the offline outbox (FR-18). Browser Alert primitives (Worker timing, Notification, AudioContext) cannot be unit-tested. The test stack must make the first kind cheap and deterministic and be honest about the second.

**Status:** decided

### Decision

**Vitest for unit and API tests, one Playwright smoke journey, manual Alert checklist.** The timer state machine, statistics aggregation and outbox logic in `packages/shared` are tested with `vi.useFakeTimers()` and `vi.setSystemTime()`. Server routes are tested in-process with Hono `app.request()` against a `:memory:` SQLite database. React components use Testing Library only where logic lives in the component. Playwright (pinned in `.mise.toml`) runs one smoke journey: create a Task, start, reload, state restored, using `page.clock` to skip time. Chrome and Safari Alert behaviour (Worker timing, Notification, sound in a background tab) is verified by a manual checklist attached to the Alerts story's acceptance criteria. No CI is required; GitHub Actions can be added later without changes.

### Rationale

One runner with deterministic time makes every time-arithmetic story cheap to test. The parts that cannot be automated are named as manual rather than pretended. The smoke test is the first thing to cut if the timebox bites.
