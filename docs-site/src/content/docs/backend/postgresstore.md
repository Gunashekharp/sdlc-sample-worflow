---
title: postgresStore.ts
description: PostgreSQL-backed Store implementation.
---

**File:** `server/src/postgresStore.ts`

The production data access layer. Wraps a `pg` connection pool and implements
the `Store` interface with SQL queries. Maps `snake_case` Postgres rows to
camelCase `Agent` and `Kpi` domain types.

## Internal types

### `AgentRow`

```ts
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
```

The raw shape returned by `pg` for a row in the `agents` table. `category` and
`status` are `string` here (not the union types) because `pg` does not know
about TypeScript union types — the cast happens in `rowToAgent`.

### `KpiRow`

```ts
interface KpiRow {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean
  hint: string
  trend: number[]
}
```

Note: `sort_order` is present in the database schema but absent from `KpiRow`
because it is never needed after the query orders the results — it is filtered
out naturally.

## Internal helper functions

### `rowToAgent`

```ts
function rowToAgent(row: AgentRow): Agent
```

Maps a `snake_case` Postgres row to the camelCase `Agent` domain type.

```ts
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
```

`row.category` and `row.status` are cast with `as AgentCategory` and `as AgentStatus`
respectively. These are type assertions, not runtime checks — the data is
trusted to be valid because it was inserted via the typed setup script. If the
database contained an invalid status value, the cast would succeed at runtime
but downstream components might render incorrectly.

### `rowToKpi`

```ts
function rowToKpi(row: KpiRow): Kpi
```

A straightforward field rename (KpiRow already uses camelCase-compatible names
except for being passed through as-is). The `trend` array is parsed from JSONB
automatically by `pg` — it arrives as a JavaScript array, not a string.

## `createPostgresStore`

```ts
export function createPostgresStore(pool: Pool): Store
```

**Parameters:**

| Param | Type | Purpose |
|-------|------|---------|
| `pool` | `Pool` | A `pg` connection pool. Shared across all queries — do not close it inside the store. |

**Returns:** A `Store` implementation backed by Postgres.

**Side effects:** Each method call issues a SQL query to the database.

### `listAgents`

```ts
async listAgents() {
  const { rows } = await pool.query(
    'SELECT * FROM agents ORDER BY runs_per_week DESC',
  )
  return (rows as AgentRow[]).map(rowToAgent)
}
```

Returns all agents ordered by run frequency. The Postgres-side ordering means
the frontend gets pre-sorted data without needing a JavaScript sort.

### `getAgent`

```ts
async getAgent(id: string) {
  const { rows } = await pool.query('SELECT * FROM agents WHERE id = $1', [id])
  const row = rows[0] as AgentRow | undefined
  return row ? rowToAgent(row) : null
}
```

The `$1` placeholder is a parameterized query — `pg` handles escaping, preventing
SQL injection. Returns `null` (not `undefined`) on no match, consistent with
the `AgentStore` interface contract.

### `listKpis`

```ts
async listKpis() {
  const { rows } = await pool.query(
    'SELECT * FROM kpis ORDER BY sort_order ASC',
  )
  return (rows as KpiRow[]).map(rowToKpi)
}
```

Returns KPIs in display order (ascending `sort_order`). The `sort_order` column
is not part of `KpiRow` or `Kpi` — it is consumed by the `ORDER BY` and then
discarded.

## Column mapping reference

| Domain field (`Agent`) | Postgres column | Type |
|------------------------|-----------------|------|
| `id` | `id` | TEXT PRIMARY KEY |
| `name` | `name` | TEXT |
| `category` | `category` | TEXT |
| `description` | `description` | TEXT |
| `status` | `status` | TEXT |
| `runsPerWeek` | `runs_per_week` | INTEGER |
| `successRate` | `success_rate` | INTEGER |
| `avgDuration` | `avg_duration` | TEXT |
| `lastRun` | `last_run` | TEXT |
| `lastRunMinutes` | `last_run_minutes` | INTEGER |
| `popular` | `popular` | BOOLEAN |

| Domain field (`Kpi`) | Postgres column | Type |
|----------------------|-----------------|------|
| `id` | `id` | TEXT PRIMARY KEY |
| — | `sort_order` | INTEGER (ordering only) |
| `label` | `label` | TEXT |
| `value` | `value` | TEXT |
| `delta` | `delta` | TEXT |
| `positive` | `positive` | BOOLEAN |
| `hint` | `hint` | TEXT |
| `trend` | `trend` | JSONB |

## Used by

`server/src/index.ts`:

```ts
const pool = new Pool({ connectionString: config.databaseUrl })
const store = createPostgresStore(pool)
```
