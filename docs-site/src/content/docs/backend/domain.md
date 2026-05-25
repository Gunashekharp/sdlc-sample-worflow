---
title: domain
description: Reference for `server/src/domain.ts`
---

<!-- structure:354170a781cb -->

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
| id | `string` | Stable unique identifier for the agent (e.g. `'pr-reviewer'`), used as the route param for `/api/agents/:id`. |
| name | `string` | Human-readable display name shown in the console, such as `'PR Reviewer'`. |
| category | `AgentCategory` | Bucket the agent belongs to, constrained to the five `AgentCategory` values for grouping and filtering. |
| description | `string` | One-sentence summary of what the agent does, shown in the agent card and detail view. |
| status | `AgentStatus` | Current operational state of the agent, one of running, idle, or attention. |
| runsPerWeek | `number` | Count of executions over the trailing week, used as a usage/activity metric. |
| successRate | `number` | Percentage of successful runs, expressed as an integer 0–100. |
| avgDuration | `string` | Pre-formatted average run duration string for display, e.g. `'2m 40s'`. |
| lastRun | `string` | Human-friendly relative time of the most recent run, e.g. `'3m ago'`. |
| lastRunMinutes | `number` | The same last-run time expressed as minutes ago, a numeric value for sorting and freshness checks. |
| popular | `boolean` | Whether the agent is flagged as popular, used to feature or highlight it in the UI. |

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
| id | `string` | Stable unique identifier for the KPI tile, used as a React key and to map seed rows. |
| label | `string` | Short caption describing the metric, displayed above the value on the tile. |
| value | `string` | Pre-formatted headline figure shown on the tile (formatting done server-side, so the UI renders it verbatim). |
| delta | `string` | Pre-formatted change indicator versus the prior period, e.g. `'+4%'`. |
| positive | `boolean` | Whether the `delta` represents a favourable movement, driving the up/down styling of the tile. |
| hint | `string` | Tooltip/explanatory text giving context for what the metric measures. |
| trend | `number[]` | Series of data points feeding the tile's sparkline, oldest to newest. |

### Used by

- `server/src/store.ts`
- `server/src/postgresStore.ts`
- `server/src/seed.ts`

## Diagrams

<!-- fill:file:diagrams -->
```mermaid
classDiagram
    class Agent {
        +string id
        +string name
        +AgentCategory category
        +string description
        +AgentStatus status
        +number runsPerWeek
        +number successRate
        +string avgDuration
        +string lastRun
        +number lastRunMinutes
        +boolean popular
    }
    class Kpi {
        +string id
        +string label
        +string value
        +string delta
        +boolean positive
        +string hint
        +number[] trend
    }
    class AgentStatus {
        <<union>>
        running | idle | attention
    }
    class AgentCategory {
        <<union>>
        Review | Deploy | Reliability | Quality | Docs
    }
    Agent ..> AgentStatus : status
    Agent ..> AgentCategory : category
```
<!-- /fill:file:diagrams -->
