---
title: Stores & database
---

Data access is abstracted behind a `Store` interface, with two
implementations: an in-memory store (used by tests) and a Postgres store (used
by the running server).

## The Store interface (`store.ts`)

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

All methods are async so the in-memory and Postgres implementations share the
same signatures.

## In-memory store

`createMemoryStore(agents, kpis)` returns a `Store` backed by plain arrays.
`listAgents` and `listKpis` return copies; `getAgent` looks up by `id` and
returns `null` when not found. It is used by the test suite — so `npm test`
needs no database — and as a quick local fallback.

## Postgres store (`postgresStore.ts`)

`createPostgresStore(pool)` returns a `Store` backed by a `pg` connection pool.

- `listAgents` → `SELECT * FROM agents ORDER BY runs_per_week DESC`
- `getAgent` → `SELECT * FROM agents WHERE id = $1` (parameterized), returns
  `null` for no row
- `listKpis` → `SELECT * FROM kpis ORDER BY sort_order ASC`

Internal `rowToAgent` / `rowToKpi` helpers map `snake_case` rows to the
camelCase domain types. Queries use parameterized placeholders (`$1`), avoiding
SQL injection.

## Schema (`db/schema.ts`)

`SCHEMA_SQL` is idempotent (`CREATE TABLE IF NOT EXISTS`).

```sql
CREATE TABLE IF NOT EXISTS agents (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  category         TEXT NOT NULL,
  description      TEXT NOT NULL,
  status           TEXT NOT NULL,
  runs_per_week    INTEGER NOT NULL,
  success_rate     INTEGER NOT NULL,
  avg_duration     TEXT NOT NULL,
  last_run         TEXT NOT NULL,
  last_run_minutes INTEGER NOT NULL,
  popular          BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS kpis (
  id         TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL,
  label      TEXT NOT NULL,
  value      TEXT NOT NULL,
  delta      TEXT NOT NULL,
  positive   BOOLEAN NOT NULL,
  hint       TEXT NOT NULL,
  trend      JSONB NOT NULL
);
```

The `kpis` table adds a `sort_order` column (not present on the domain type)
used to preserve display order; the `trend` array is stored as JSONB.

## Setup script (`db/setup.ts`)

`npm run db:setup` runs a one-shot script that:

1. Opens a `pg` pool from `DATABASE_URL`.
2. Runs `SCHEMA_SQL` to create the tables.
3. Upserts each seed agent and KPI with `INSERT … ON CONFLICT (id) DO UPDATE`,
   so re-running it refreshes the data without duplicating rows.
4. Closes the pool, logging the loaded counts.

Because it upserts, the script is safe to run repeatedly. On failure it logs
and exits with code 1.
