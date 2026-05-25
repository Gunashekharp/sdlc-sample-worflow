---
title: domain
description: Reference for `server/src/domain.ts`
---

**File:** `server/src/domain.ts` · **Lines:** 33

<!-- fill:file:summary -->
`domain.ts` defines the core data types for the Snabbit Agent Console API: the `AgentStatus` and `AgentCategory` string unions and the `Agent` and `Kpi` interfaces. These shapes are designed to mirror exactly what the frontend expects, so the same vocabulary flows from the database through the API to the UI. They are consumed by `store.ts` (the `Store` interface and in-memory store), `postgresStore.ts` (which maps SQL rows into `Agent` and `Kpi`), and `seed.ts` (which provides the seed catalogue). This file is pure type declarations with no runtime logic.
<!-- /fill:file:summary -->

## Symbols

This file exports 4 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| AgentStatus | type | no |
| AgentCategory | type | no |
| Agent | interface | no |
| Kpi | interface | no |

## AgentStatus

**Kind:** `type`

```ts
export type AgentStatus = 'running' | 'idle' | 'attention'
```

<!-- fill:sym:AgentStatus:summary -->
`AgentStatus` is a string-literal union restricting an agent's operational state to one of three values: `'running'`, `'idle'`, or `'attention'`. It exists to give the rest of the codebase a closed, type-checked vocabulary for agent state rather than an open `string`. `postgresStore.ts` casts the raw `status` text column to this type when mapping a database row into an `Agent`.
<!-- /fill:sym:AgentStatus:summary -->

### Used by

- `server/src/postgresStore.ts`

## AgentCategory

**Kind:** `type`

```ts
export type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'
```

<!-- fill:sym:AgentCategory:summary -->
`AgentCategory` is a string-literal union that classifies an agent into one of five fixed buckets: `'Review'`, `'Deploy'`, `'Reliability'`, `'Quality'`, or `'Docs'`. It exists so categories are constrained to a known set the frontend can group and filter on, instead of arbitrary strings. `postgresStore.ts` casts the raw `category` text column to this type when building an `Agent` from a row.
<!-- /fill:sym:AgentCategory:summary -->

### Used by

- `server/src/postgresStore.ts`

## Agent

**Kind:** `interface`

```ts
export interface Agent { ... }
```

<!-- fill:sym:Agent:summary -->
`Agent` is the central record describing a single automation agent in the console, combining identity (`id`, `name`), classification (`category`, `status`), and a set of usage metrics (`runsPerWeek`, `successRate`, `avgDuration`, `lastRun`, `lastRunMinutes`, `popular`). It exists as the canonical shape returned by the `/api/agents` endpoints and consumed by the frontend. The `Store` interface in `store.ts` returns `Agent[]` and `Agent | null`, `postgresStore.ts` assembles it from an `AgentRow`, and `seed.ts` supplies a hard-coded catalogue of these objects.
<!-- /fill:sym:Agent:summary -->

### Shape

| Name | Type | Description |
| --- | --- | --- |
| id | `string` | Stable unique identifier used to look the agent up (e.g. `'pr-reviewer'`). |
| name | `string` | Human-readable display name shown in the UI (e.g. `'PR Reviewer'`). |
| category | `AgentCategory` | One of the five fixed categories used to group and filter agents. |
| description | `string` | Short free-text summary of what the agent does. |
| status | `AgentStatus` | Current operational state: running, idle, or needing attention. |
| runsPerWeek | `number` | How many times the agent runs in a typical week; also the default sort key. |
| successRate | `number` | Fraction or percentage of runs that succeeded. |
| avgDuration | `string` | Pre-formatted average run duration for display (e.g. `'2m 30s'`). |
| lastRun | `string` | Pre-formatted timestamp/label of the most recent run for display. |
| lastRunMinutes | `number` | Minutes elapsed since the last run, for numeric comparisons. |
| popular | `boolean` | Whether the agent is flagged as popular/featured in the UI. |

### Used by

- `server/src/store.ts`
- `server/src/postgresStore.ts`
- `server/src/seed.ts`

## Kpi

**Kind:** `interface`

```ts
export interface Kpi { ... }
```

<!-- fill:sym:Kpi:summary -->
`Kpi` describes a single key-performance-indicator tile for the dashboard, pairing a `label` and pre-formatted `value` with a `delta`, a `positive` flag, a `hint`, and a `trend` array of points for a sparkline. It exists as the shape returned by the `/api/kpis` endpoint and rendered directly by the frontend KPI cards. The `KpiStore` interface in `store.ts` returns `Kpi[]`, `postgresStore.ts` builds it from a `KpiRow`, and `seed.ts` provides the seed list.
<!-- /fill:sym:Kpi:summary -->

### Shape

| Name | Type | Description |
| --- | --- | --- |
| id | `string` | Stable unique identifier for the KPI tile. |
| label | `string` | Human-readable name of the metric shown on the tile. |
| value | `string` | Pre-formatted headline value for display (e.g. `'98%'`). |
| delta | `string` | Pre-formatted change versus the previous period (e.g. `'+4%'`). |
| positive | `boolean` | Whether the delta is favourable, used to colour the indicator. |
| hint | `string` | Short explanatory tooltip/subtext for the metric. |
| trend | `number[]` | Series of data points used to draw the sparkline. |

### Used by

- `server/src/store.ts`
- `server/src/postgresStore.ts`
- `server/src/seed.ts`

## Diagrams

<!-- fill:file:diagrams -->

<!-- /fill:file:diagrams -->

## Source

Full file source for `server/src/domain.ts` (33 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (33 lines)</summary>

````ts
/*
 * Domain types for the Snabbit Agent Console API.
 * Mirrors the shapes the frontend expects.
 */

export type AgentStatus = 'running' | 'idle' | 'attention'

export type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'

export interface Agent {
  id: string
  name: string
  category: AgentCategory
  description: string
  status: AgentStatus
  runsPerWeek: number
  successRate: number
  avgDuration: string
  lastRun: string
  lastRunMinutes: number
  popular: boolean
}

export interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean
  hint: string
  trend: number[]
}

````

</details>
