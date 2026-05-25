---
title: postgresStore
description: Reference for `server/src/postgresStore.ts`
---

**File:** `server/src/postgresStore.ts` · **Lines:** 81

<FILL: 2-4 sentence plain-language summary of what `postgresStore.ts` is responsible for, what other files it integrates with, and what calls into it.>

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `pg` | `Pool` | type-only · external |
| `./domain` | `Agent`, `AgentCategory`, `AgentStatus`, `Kpi` | type-only · internal |
| `./store` | `Store` | type-only · internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| createPostgresStore | function | no |

## createPostgresStore

**Kind:** `function`

```ts
export function createPostgresStore(pool: Pool): Store { ... }
```

> Postgres-backed store. Used by the running server.

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| pool | `Pool` | — | yes | <FILL: purpose of pool> |

**Returns:** `Store`

<FILL: describe the return value of createPostgresStore — what it represents, when it can be null/undefined, units.>

### Line-by-line walkthrough

Each top-level statement of `createPostgresStore`, in execution order. The line numbers reference the source file as it appears today.

**Line 59 — `ReturnStatement`**

```ts
return {
    async listAgents() {
      const { rows } = await pool.query(
        'SELECT * FROM agents ORDER BY runs_per_week DESC',
      )
      return (rows as AgentRow[]).map(rowToAgent)
    },
    async getAgent(id: string) {
      const { rows } = await pool.query('SELECT * FROM agents WHERE id = $1', [
        id,
      ])
      const row = rows[0] as AgentRow | undefined
      return row ? rowToAgent(row) : null
    },
    async listKpis() {
      const { rows } = await pool.query(
        'SELECT * FROM kpis ORDER BY sort_order ASC',
      )
      return (rows as KpiRow[]).map(rowToKpi)
    },
  }
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

### Examples

<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>

### Used by

- `server/src/index.ts`

## Diagrams

<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>

## Source

Full file source for `server/src/postgresStore.ts` (81 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (81 lines)</summary>

````ts
import type { Pool } from 'pg'
import type { Agent, AgentCategory, AgentStatus, Kpi } from './domain'
import type { Store } from './store'

interface AgentRow {
  id: string
  name: string
  category: string
  description: string
  status: string
  runs_per_week: number
  success_rate: number
  avg_duration: string
  last_run: string
  last_run_minutes: number
  popular: boolean
}

interface KpiRow {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean
  hint: string
  trend: number[]
}

function rowToAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    name: row.name,
    category: row.category as AgentCategory,
    description: row.description,
    status: row.status as AgentStatus,
    runsPerWeek: row.runs_per_week,
    successRate: row.success_rate,
    avgDuration: row.avg_duration,
    lastRun: row.last_run,
    lastRunMinutes: row.last_run_minutes,
    popular: row.popular,
  }
}

function rowToKpi(row: KpiRow): Kpi {
  return {
    id: row.id,
    label: row.label,
    value: row.value,
    delta: row.delta,
    positive: row.positive,
    hint: row.hint,
    trend: row.trend,
  }
}

/** Postgres-backed store. Used by the running server. */
export function createPostgresStore(pool: Pool): Store {
  return {
    async listAgents() {
      const { rows } = await pool.query(
        'SELECT * FROM agents ORDER BY runs_per_week DESC',
      )
      return (rows as AgentRow[]).map(rowToAgent)
    },
    async getAgent(id: string) {
      const { rows } = await pool.query('SELECT * FROM agents WHERE id = $1', [
        id,
      ])
      const row = rows[0] as AgentRow | undefined
      return row ? rowToAgent(row) : null
    },
    async listKpis() {
      const { rows } = await pool.query(
        'SELECT * FROM kpis ORDER BY sort_order ASC',
      )
      return (rows as KpiRow[]).map(rowToKpi)
    },
  }
}

````

</details>
