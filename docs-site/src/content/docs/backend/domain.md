---
title: domain.ts
description: Backend domain types — Agent and Kpi.
---

**File:** `server/src/domain.ts`

The backend's core domain types. Mirrors the shapes the frontend expects.
There is no shared type package — the frontend (`src/data/agents.ts`) and
backend maintain structurally identical types by convention.

## `AgentStatus`

```ts
export type AgentStatus = 'running' | 'idle' | 'attention'
```

The three operational states of an agent.

## `AgentCategory`

```ts
export type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'
```

The five agent categories.

## `Agent`

```ts
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
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Stable kebab-case slug, primary key in Postgres |
| `name` | `string` | Display name |
| `category` | `AgentCategory` | Stored as `TEXT` in Postgres, cast to `AgentCategory` by `rowToAgent` |
| `description` | `string` | One-sentence summary |
| `status` | `AgentStatus` | Stored as `TEXT`, cast to `AgentStatus` by `rowToAgent` |
| `runsPerWeek` | `number` | Maps to `runs_per_week INTEGER` in Postgres |
| `successRate` | `number` | Maps to `success_rate INTEGER` (0–100) |
| `avgDuration` | `string` | Maps to `avg_duration TEXT`, human-readable |
| `lastRun` | `string` | Maps to `last_run TEXT`, human-readable |
| `lastRunMinutes` | `number` | Maps to `last_run_minutes INTEGER`, for sorting |
| `popular` | `boolean` | Maps to `popular BOOLEAN` |

## `Kpi`

```ts
export interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean
  hint: string
  trend: number[]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Stable identifier, primary key in Postgres |
| `label` | `string` | Metric name |
| `value` | `string` | Pre-formatted display value |
| `delta` | `string` | Pre-formatted period change |
| `positive` | `boolean` | Whether the delta is a good outcome |
| `hint` | `string` | Sub-label for the sparkline |
| `trend` | `number[]` | 7-point series, stored as JSONB in Postgres |

The `Kpi` type does not include `sort_order` — that is a Postgres-only
ordering column, read by the store but not exposed in the domain type.

## Relationship to the frontend types

Both the frontend (`src/data/agents.ts`) and backend (`server/src/domain.ts`)
define `AgentStatus`, `AgentCategory`, `Agent`, and `Kpi`. The two sets are
kept structurally identical by hand. Any change to one must be mirrored in the
other.

## Used by

- `server/src/store.ts` — defines `AgentStore`, `KpiStore`, `Store` in terms
  of `Agent` and `Kpi`.
- `server/src/postgresStore.ts` — maps Postgres rows to these types.
- `server/src/seed.ts` — typed seed data arrays.
- `server/src/routes.ts` — implicit through `Store` usage.
