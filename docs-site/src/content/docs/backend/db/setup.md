---
title: "db/setup.ts — database setup"
---

**File:** `server/src/db/setup.ts`

A one-shot Node.js script that creates the Postgres tables and upserts the seed data. It is designed to be idempotent — running it multiple times on the same database is safe: tables are created only if they do not already exist, and rows are updated rather than re-inserted.

## How to run

```bash
cd server
npm run db:setup
```

The `db:setup` script is defined in `server/package.json` as:

```
"db:setup": "tsx src/db/setup.ts"
```

Set `DATABASE_URL` before running if you are not using the local default:

```bash
DATABASE_URL=postgres://user:password@hostname:5432/dbname npm run db:setup
```

**On success:**
```
Database ready: 12 agents, 4 KPIs.
```

**On failure:**
```
Database setup failed: <error message>
```
The process exits with code `1`.

## What the script does

The `main()` function executes four steps in sequence, wrapped in a `try/finally` that always closes the pool:

### Step 1 — Create tables

```ts
await pool.query(SCHEMA_SQL)
```

Runs the two `CREATE TABLE IF NOT EXISTS` statements from `db/schema.ts`. If the tables already exist, this is a no-op. If the database does not exist or credentials are wrong, this step throws and the process exits with code 1.

### Step 2 — Upsert agents

```ts
for (const a of SEED_AGENTS) {
  await pool.query(
    `INSERT INTO agents
       (id, name, category, description, status, runs_per_week,
        success_rate, avg_duration, last_run, last_run_minutes, popular)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (id) DO UPDATE SET
       name            = EXCLUDED.name,
       category        = EXCLUDED.category,
       description     = EXCLUDED.description,
       status          = EXCLUDED.status,
       runs_per_week   = EXCLUDED.runs_per_week,
       success_rate    = EXCLUDED.success_rate,
       avg_duration    = EXCLUDED.avg_duration,
       last_run        = EXCLUDED.last_run,
       last_run_minutes = EXCLUDED.last_run_minutes,
       popular         = EXCLUDED.popular`,
    [a.id, a.name, a.category, a.description, a.status, a.runsPerWeek,
     a.successRate, a.avgDuration, a.lastRun, a.lastRunMinutes, a.popular],
  )
}
```

Each of the 12 agents in `SEED_AGENTS` is upserted with `INSERT … ON CONFLICT (id) DO UPDATE`. If a row with the same `id` already exists, all non-key columns are updated to the seed values. This is the standard Postgres "upsert" pattern — the `EXCLUDED` pseudo-table refers to the values that would have been inserted.

The positional parameter mapping is:

| `$n` | `Agent` field | Column |
|---|---|---|
| `$1` | `a.id` | `id` |
| `$2` | `a.name` | `name` |
| `$3` | `a.category` | `category` |
| `$4` | `a.description` | `description` |
| `$5` | `a.status` | `status` |
| `$6` | `a.runsPerWeek` | `runs_per_week` |
| `$7` | `a.successRate` | `success_rate` |
| `$8` | `a.avgDuration` | `avg_duration` |
| `$9` | `a.lastRun` | `last_run` |
| `$10` | `a.lastRunMinutes` | `last_run_minutes` |
| `$11` | `a.popular` | `popular` |

### Step 3 — Upsert KPIs

```ts
for (let i = 0; i < SEED_KPIS.length; i++) {
  const k = SEED_KPIS[i]
  await pool.query(
    `INSERT INTO kpis (id, sort_order, label, value, delta, positive, hint, trend)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (id) DO UPDATE SET
       sort_order = EXCLUDED.sort_order,
       label      = EXCLUDED.label,
       value      = EXCLUDED.value,
       delta      = EXCLUDED.delta,
       positive   = EXCLUDED.positive,
       hint       = EXCLUDED.hint,
       trend      = EXCLUDED.trend`,
    [k.id, i, k.label, k.value, k.delta, k.positive, k.hint, JSON.stringify(k.trend)],
  )
}
```

Each of the 4 KPIs is upserted. Key points:

- **`sort_order = i`** — the loop index is used as `sort_order` (0-based). This preserves the display order as defined in the `SEED_KPIS` array without requiring a separate ordering field on the `Kpi` domain type.
- **`JSON.stringify(k.trend)`** — the `trend` array is serialized to a JSON string before being passed to `pg`. The `kpis.trend` column is `JSONB`; Postgres accepts either a JSON string or a JavaScript object from `pg`, but explicit stringification makes the intent unambiguous.

The positional parameter mapping is:

| `$n` | Value | Column |
|---|---|---|
| `$1` | `k.id` | `id` |
| `$2` | `i` (loop index) | `sort_order` |
| `$3` | `k.label` | `label` |
| `$4` | `k.value` | `value` |
| `$5` | `k.delta` | `delta` |
| `$6` | `k.positive` | `positive` |
| `$7` | `k.hint` | `hint` |
| `$8` | `JSON.stringify(k.trend)` | `trend` |

### Step 4 — Close pool

```ts
} finally {
  await pool.end()
}
```

The `finally` block closes all pool connections even if an earlier step threw. Without this, the Node process would hang indefinitely on an open database connection.

## Error handling

```ts
main().catch((err) => {
  console.error('Database setup failed:', err)
  process.exit(1)
})
```

Any unhandled error from `main()` is caught at the top level. The error is printed to `stderr` and the process exits with code `1`. This signals failure to the calling shell or CI system.

## Script flow

```mermaid
flowchart TD
    Start["npm run db:setup"]
    Pool["new Pool(config.databaseUrl)"]
    Schema["pool.query(SCHEMA_SQL)\nCREATE TABLE IF NOT EXISTS agents\nCREATE TABLE IF NOT EXISTS kpis"]
    Agents["for each of 12 SEED_AGENTS\nINSERT ... ON CONFLICT (id) DO UPDATE"]
    Kpis["for each of 4 SEED_KPIS\nINSERT ... ON CONFLICT (id) DO UPDATE\nsort_order = loop index i"]
    Log["console.log: Database ready: 12 agents, 4 KPIs."]
    Close["pool.end()"]
    Err["console.error + process.exit(1)"]

    Start --> Pool
    Pool --> Schema
    Schema --> Agents
    Agents --> Kpis
    Kpis --> Log
    Log --> Close
    Schema -->|throws| Err
    Agents -->|throws| Err
    Kpis -->|throws| Err
    Err --> Close
```

:::caution
Re-running `npm run db:setup` on a production database resets all agent and KPI rows back to the seed values, overwriting any live data changes. Use with care in environments where database state is expected to persist across deployments.
:::
