---
title: "domain.ts — core types"
---

**File:** `server/src/domain.ts`

The backend's core domain types. Defines the shapes for agents and KPIs that flow from the database through the store and routes to the frontend. No business logic lives here — only type definitions.

## Full source

```ts
export type AgentStatus = 'running' | 'idle' | 'attention'
export type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'

export interface Agent {
  id: string; name: string; category: AgentCategory; description: string;
  status: AgentStatus; runsPerWeek: number; successRate: number;
  avgDuration: string; lastRun: string; lastRunMinutes: number; popular: boolean;
}

export interface Kpi {
  id: string; label: string; value: string; delta: string;
  positive: boolean; hint: string; trend: number[];
}
```

## `AgentStatus`

```ts
export type AgentStatus = 'running' | 'idle' | 'attention'
```

The three operational states an agent can be in:

| Value | Meaning |
|---|---|
| `'running'` | The agent is actively executing a job right now |
| `'idle'` | The agent is healthy but not currently running |
| `'attention'` | The agent requires operator review (e.g., elevated error rate) |

Stored as `TEXT` in the `agents` Postgres table. Cast from `string` to `AgentStatus` inside `rowToAgent()` in `postgresStore.ts`.

## `AgentCategory`

```ts
export type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'
```

The five agent categories, used to group agents in the dashboard:

| Value | Description |
|---|---|
| `'Review'` | Code review and migration review agents |
| `'Deploy'` | Deployment automation agents |
| `'Reliability'` | On-call, RCA, and alert triage agents |
| `'Quality'` | End-to-end testing, coverage, and flaky-test agents |
| `'Docs'` | Changelog and specification authoring agents |

Stored as `TEXT` in Postgres. Cast in `rowToAgent()`.

## `Agent` interface

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

| Field | Type | DB column | Notes |
|---|---|---|---|
| `id` | `string` | `id TEXT PRIMARY KEY` | Stable kebab-case slug (e.g. `'pr-reviewer'`) |
| `name` | `string` | `name TEXT` | Human-readable display name |
| `category` | `AgentCategory` | `category TEXT` | One of the five category values |
| `description` | `string` | `description TEXT` | One-sentence summary of what the agent does |
| `status` | `AgentStatus` | `status TEXT` | Current operational state |
| `runsPerWeek` | `number` | `runs_per_week INTEGER` | Weekly execution count |
| `successRate` | `number` | `success_rate INTEGER` | Percentage 0–100; percentage of runs that succeed |
| `avgDuration` | `string` | `avg_duration TEXT` | Human-readable average run time (e.g. `'2m 40s'`) |
| `lastRun` | `string` | `last_run TEXT` | Human-readable recency label (e.g. `'3m ago'`) |
| `lastRunMinutes` | `number` | `last_run_minutes INTEGER` | Numeric minutes since last run, used for sorting |
| `popular` | `boolean` | `popular BOOLEAN` | Whether this agent appears in the "popular" filter tab |

## `Kpi` interface

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

| Field | Type | DB column | Notes |
|---|---|---|---|
| `id` | `string` | `id TEXT PRIMARY KEY` | Stable identifier (e.g. `'agent-runs'`) |
| `label` | `string` | `label TEXT` | Metric display name (e.g. `'Agent runs · 7d'`) |
| `value` | `string` | `value TEXT` | Pre-formatted current value (e.g. `'1,284'`) |
| `delta` | `string` | `delta TEXT` | Pre-formatted period change (e.g. `'+18%'`) |
| `positive` | `boolean` | `positive BOOLEAN` | `true` when the delta is a favorable change |
| `hint` | `string` | `hint TEXT` | Sub-label shown beneath the sparkline |
| `trend` | `number[]` | `trend JSONB` | Seven-point numeric series for the sparkline |

:::note
The `Kpi` type does not include `sort_order`. That column exists only in the Postgres schema to preserve display order when rows are fetched. It is used in `ORDER BY sort_order ASC` and then discarded — it is never surfaced in the domain type or the API response.
:::

## Relationship to the frontend

The frontend (`src/data/agents.ts` and `src/data/kpis.ts`) defines `AgentStatus`, `AgentCategory`, `Agent`, and `Kpi` with structurally identical shapes. There is no shared type package — the two sets are kept in sync by hand.

:::caution
Any change to a field name, type, or the list of union values in `domain.ts` must be mirrored in the corresponding frontend type files. A mismatch will cause TypeScript errors on the frontend when it processes API responses.
:::

## Used by

- **`server/src/store.ts`** — `AgentStore`, `KpiStore`, and `Store` are parameterized by `Agent` and `Kpi`.
- **`server/src/postgresStore.ts`** — `rowToAgent()` and `rowToKpi()` map Postgres rows to these types.
- **`server/src/seed.ts`** — `SEED_AGENTS: Agent[]` and `SEED_KPIS: Kpi[]` are typed arrays.
- **`server/src/routes.ts`** — indirectly, through the `Store` methods.
