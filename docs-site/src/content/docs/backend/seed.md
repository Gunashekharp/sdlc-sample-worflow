---
title: seed
description: Reference for `server/src/seed.ts`
---

<!-- structure:93f58033f290 -->

**File:** `server/src/seed.ts` · **Lines:** 218

<!-- fill:file:summary -->
This file holds the seed data for the Snabbit Agent Console: the agent catalogue (`SEED_AGENTS`) and the dashboard KPIs (`SEED_KPIS`), both typed against the `Agent` and `Kpi` types imported from `./domain`. `db/setup.ts` reads these constants to upsert rows into Postgres during `npm run db:setup`, and the test suite (`__tests__/api.test.ts`) loads them directly into the in-memory store as fixtures. It contains pure data only — no logic, I/O, or runtime behaviour.
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `./domain` | `Agent`, `Kpi` | type-only · internal |


## Symbols

This file exports 2 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| SEED_AGENTS | const | no |
| SEED_KPIS | const | no |

## SEED_AGENTS

**Kind:** `const`

```ts
const SEED_AGENTS: Agent[]
```

<!-- fill:sym:SEED_AGENTS:summary -->
A static `Agent[]` of twelve sample agents (PR Reviewer, Deploy Bot, RCA Analyst, and so on), each with an id, name, category, description, status, and usage metrics like `runsPerWeek`, `successRate`, `avgDuration`, and `lastRun`. It is the canonical demo dataset: `db/setup.ts` upserts it into the `agents` table and the API tests seed the in-memory store from it so responses are deterministic.
<!-- /fill:sym:SEED_AGENTS:summary -->

### Used by

- `server/src/__tests__/api.test.ts`
- `server/src/db/setup.ts`

## SEED_KPIS

**Kind:** `const`

```ts
const SEED_KPIS: Kpi[]
```

<!-- fill:sym:SEED_KPIS:summary -->
A static `Kpi[]` of four headline dashboard metrics — agent runs over 7 days, PRs reviewed, mean time to merge, and suite pass rate — each with a label, formatted value, delta, `positive` flag, hint, and a `trend` sparkline array. Like `SEED_AGENTS`, it is upserted into the `kpis` table by `db/setup.ts` (where its array index becomes the row's `sort_order`) and used as a fixture by the API tests.
<!-- /fill:sym:SEED_KPIS:summary -->

### Used by

- `server/src/__tests__/api.test.ts`
- `server/src/db/setup.ts`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
