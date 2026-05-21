# Data stores

The backend reads the agent catalogue and KPIs through a small `Store`
abstraction. There are two implementations: an **in-memory** store (tests, quick
local runs) and a **Postgres-backed** store (the running server). The routes
depend only on the interface, so either can be injected via `createApp`.

## Domain types (`domain.ts`)

The store returns the domain shapes, which mirror what the frontend expects:

```ts
type AgentStatus = 'running' | 'idle' | 'attention'
type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'

interface Agent {
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

interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean
  hint: string
  trend: number[]
}
```

These match the frontend [`Agent`](../frontend/data.md#agentsts) and
[`Kpi`](../frontend/data.md#kpists) types field-for-field.

## The `Store` interface (`store.ts`)

```ts
interface AgentStore {
  listAgents(): Promise<Agent[]>
  getAgent(id: string): Promise<Agent | null>
}
interface KpiStore {
  listKpis(): Promise<Kpi[]>
}
type Store = AgentStore & KpiStore
```

All three methods are `async`, so the in-memory and Postgres implementations are
interchangeable from the route handlers' point of view.

## In-memory store (`store.ts`)

```ts
function createMemoryStore(agents: Agent[], kpis: Kpi[]): Store
```

- `listAgents()` returns a shallow copy (`[...agents]`).
- `getAgent(id)` returns the matching agent or `null`.
- `listKpis()` returns a shallow copy of the KPIs.

Used by the [test suite](testing.md) (seeded with `SEED_AGENTS` / `SEED_KPIS`)
so `npm test` needs no database, and available as a quick local fallback.

## Postgres store (`postgresStore.ts`)

```ts
function createPostgresStore(pool: Pool): Store
```

Backed by a `pg` `Pool`. Queries and ordering:

| Method            | Query                                                |
| ----------------- | ---------------------------------------------------- |
| `listAgents()`    | `SELECT * FROM agents ORDER BY runs_per_week DESC`   |
| `getAgent(id)`    | `SELECT * FROM agents WHERE id = $1` (parameterized) |
| `listKpis()`      | `SELECT * FROM kpis ORDER BY sort_order ASC`         |

### Row mapping

Postgres uses `snake_case` columns; the store maps each row to the `camelCase`
domain type via the private `rowToAgent` / `rowToKpi` functions. For agents:

| Column             | Domain field     |
| ------------------ | ---------------- |
| `runs_per_week`    | `runsPerWeek`    |
| `success_rate`     | `successRate`    |
| `avg_duration`     | `avgDuration`    |
| `last_run`         | `lastRun`        |
| `last_run_minutes` | `lastRunMinutes` |

`category` and `status` are cast from `string` to their union types
(`AgentCategory` / `AgentStatus`). For KPIs, `trend` is read straight from the
`JSONB` column as a `number[]`. `getAgent` returns `null` when no row matches.

!!! warning "Casts are unchecked"
    `row.category as AgentCategory` and `row.status as AgentStatus` trust the
    database to hold only valid values; there is no runtime validation of the
    stored strings.
