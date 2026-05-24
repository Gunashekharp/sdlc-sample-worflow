---
title: "postgresStore.ts — PostgreSQL store"
---

**File:** `server/src/postgresStore.ts`

The production data access layer. Wraps a `pg` connection pool and implements the `Store` interface with three parameterized SQL queries. Maps `snake_case` Postgres column names to camelCase domain types.

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

The raw shape that `pg` returns for a row from the `agents` table. `category` and `status` are typed as `string` here — not the union types — because `pg` has no knowledge of TypeScript union types. The narrowing cast is applied in `rowToAgent`.

| Column | `AgentRow` field | Notes |
|---|---|---|
| `id` | `id` | Unchanged |
| `name` | `name` | Unchanged |
| `category` | `category` | `string`, not `AgentCategory` |
| `description` | `description` | Unchanged |
| `status` | `status` | `string`, not `AgentStatus` |
| `runs_per_week` | `runs_per_week` | snake_case (DB naming) |
| `success_rate` | `success_rate` | snake_case |
| `avg_duration` | `avg_duration` | snake_case |
| `last_run` | `last_run` | snake_case |
| `last_run_minutes` | `last_run_minutes` | snake_case |
| `popular` | `popular` | Unchanged |

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

The raw shape for a row from the `kpis` table. `sort_order` is intentionally absent — the query orders by it, but the value is never needed after that.

:::note
`pg` automatically deserializes `JSONB` columns into native JavaScript values. `trend JSONB` arrives as `number[]` — no `JSON.parse()` call is needed in `rowToKpi`.
:::

## Internal helper functions

### `rowToAgent(row)`

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

Maps a `snake_case` Postgres row to the camelCase `Agent` domain type. All snake_case names are converted to camelCase:

- `runs_per_week` → `runsPerWeek`
- `success_rate` → `successRate`
- `avg_duration` → `avgDuration`
- `last_run` → `lastRun`
- `last_run_minutes` → `lastRunMinutes`

`row.category` and `row.status` are cast with `as AgentCategory` and `as AgentStatus` respectively. These are TypeScript type assertions — no runtime validation occurs. The data is trusted because it was inserted via the typed `db/setup.ts` script. An invalid value in the database would pass the cast silently and potentially render incorrectly in the frontend.

### `rowToKpi(row)`

```ts
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
```

A straightforward field copy. The `KpiRow` field names already match the `Kpi` interface names — no renaming needed. `trend` is passed through directly as `pg` already parsed the JSONB into a `number[]`.

## `createPostgresStore(pool)`

```ts
export function createPostgresStore(pool: Pool): Store
```

**Parameters:**

| Parameter | Type | Purpose |
|---|---|---|
| `pool` | `Pool` | A `pg` connection pool instance. Shared across all queries — `createPostgresStore` never calls `pool.end()`. |

**Returns:** A `Store` implementation backed by Postgres.

**Side effects at construction:** None — no queries are issued until a method is called.

### `listAgents()`

```ts
async listAgents() {
  const { rows } = await pool.query('SELECT * FROM agents ORDER BY runs_per_week DESC')
  return (rows as AgentRow[]).map(rowToAgent)
}
```

Fetches all rows from the `agents` table, ordered by weekly run frequency descending. The sort happens in Postgres — no client-side sorting is performed. Returns `Agent[]` after mapping through `rowToAgent`.

### `getAgent(id)`

```ts
async getAgent(id: string) {
  const { rows } = await pool.query('SELECT * FROM agents WHERE id = $1', [id])
  const row = rows[0] as AgentRow | undefined
  return row ? rowToAgent(row) : null
}
```

Uses a parameterized query (`$1`) to prevent SQL injection — `pg` escapes the value before substitution. `rows[0]` is `undefined` when no row matches; the ternary converts that to `null` to satisfy the `AgentStore.getAgent` return type of `Promise<Agent | null>`.

### `listKpis()`

```ts
async listKpis() {
  const { rows } = await pool.query('SELECT * FROM kpis ORDER BY sort_order ASC')
  return (rows as KpiRow[]).map(rowToKpi)
}
```

Fetches all rows from the `kpis` table, ordered by `sort_order ASC`. The `sort_order` column is used only for ordering — it is not included in `KpiRow` and never surfaces in the returned `Kpi[]`.

## Column mapping reference

### `agents` table

| Domain field (`Agent`) | `AgentRow` field | Postgres column | Type |
|---|---|---|---|
| `id` | `id` | `id` | `TEXT PRIMARY KEY` |
| `name` | `name` | `name` | `TEXT NOT NULL` |
| `category` | `category` (cast) | `category` | `TEXT NOT NULL` |
| `description` | `description` | `description` | `TEXT NOT NULL` |
| `status` | `status` (cast) | `status` | `TEXT NOT NULL` |
| `runsPerWeek` | `runs_per_week` | `runs_per_week` | `INTEGER NOT NULL` |
| `successRate` | `success_rate` | `success_rate` | `INTEGER NOT NULL` |
| `avgDuration` | `avg_duration` | `avg_duration` | `TEXT NOT NULL` |
| `lastRun` | `last_run` | `last_run` | `TEXT NOT NULL` |
| `lastRunMinutes` | `last_run_minutes` | `last_run_minutes` | `INTEGER NOT NULL` |
| `popular` | `popular` | `popular` | `BOOLEAN NOT NULL` |

### `kpis` table

| Domain field (`Kpi`) | `KpiRow` field | Postgres column | Type |
|---|---|---|---|
| `id` | `id` | `id` | `TEXT PRIMARY KEY` |
| — | — | `sort_order` | `INTEGER NOT NULL` (ordering only; absent from `KpiRow`) |
| `label` | `label` | `label` | `TEXT NOT NULL` |
| `value` | `value` | `value` | `TEXT NOT NULL` |
| `delta` | `delta` | `delta` | `TEXT NOT NULL` |
| `positive` | `positive` | `positive` | `BOOLEAN NOT NULL` |
| `hint` | `hint` | `hint` | `TEXT NOT NULL` |
| `trend` | `trend` | `trend` | `JSONB NOT NULL` (auto-parsed by `pg`) |

## Used by

`server/src/index.ts`:

```ts
const pool = new Pool({ connectionString: config.databaseUrl })
const store = createPostgresStore(pool)
```
