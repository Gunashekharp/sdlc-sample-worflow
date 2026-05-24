---
title: "db/schema.ts — database schema"
---

**File:** `server/src/db/schema.ts`

Exports the SQL string that creates both Postgres tables. The SQL is stored as a TypeScript constant so it can be imported and executed by `db/setup.ts` without reading a separate `.sql` file.

## `SCHEMA_SQL` constant

```ts
export const SCHEMA_SQL: string
```

A single string containing two `CREATE TABLE IF NOT EXISTS` statements separated by a semicolon. Both statements are idempotent — running them on a database that already has the tables is a no-op.

## Full schema SQL

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

## `agents` table columns

| Column | SQL type | Notes |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Kebab-case slug; must be unique across all agents |
| `name` | `TEXT NOT NULL` | Human-readable display name |
| `category` | `TEXT NOT NULL` | Plain text; one of `Review`, `Deploy`, `Reliability`, `Quality`, `Docs` |
| `description` | `TEXT NOT NULL` | One-sentence summary |
| `status` | `TEXT NOT NULL` | Plain text; one of `running`, `idle`, `attention` |
| `runs_per_week` | `INTEGER NOT NULL` | Weekly execution count |
| `success_rate` | `INTEGER NOT NULL` | Integer percentage 0–100 |
| `avg_duration` | `TEXT NOT NULL` | Human-readable string (e.g. `'2m 40s'`) |
| `last_run` | `TEXT NOT NULL` | Human-readable string (e.g. `'3m ago'`) |
| `last_run_minutes` | `INTEGER NOT NULL` | Numeric minutes for sorting |
| `popular` | `BOOLEAN NOT NULL` | Dashboard "popular" tab membership flag |

`category` and `status` intentionally use `TEXT` instead of Postgres `ENUM`. Enum types require `ALTER TYPE … ADD VALUE` migrations when new values are added; plain `TEXT` does not. The union-type narrowing is handled in the application layer (`rowToAgent()` in `postgresStore.ts`).

## `kpis` table columns

| Column | SQL type | Notes |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Stable identifier |
| `sort_order` | `INTEGER NOT NULL` | Ascending display order; set to array index at seed time |
| `label` | `TEXT NOT NULL` | Metric display name |
| `value` | `TEXT NOT NULL` | Pre-formatted display value |
| `delta` | `TEXT NOT NULL` | Pre-formatted period change string |
| `positive` | `BOOLEAN NOT NULL` | Favorable outcome flag |
| `hint` | `TEXT NOT NULL` | Sub-label beneath the sparkline |
| `trend` | `JSONB NOT NULL` | Seven-point numeric array; stored in binary JSON format |

`trend` is `JSONB` rather than `JSON` for better read performance and future indexing capability. `pg` deserializes `JSONB` columns into JavaScript arrays automatically on read.

`sort_order` is not present in the `Kpi` domain type — it is a database-only ordering column.

## Idempotency

Both statements use `CREATE TABLE IF NOT EXISTS`. This means:

- Running `db/setup.ts` on a fresh database creates both tables.
- Running `db/setup.ts` on a database that already has the tables performs no schema changes.
- The subsequent upsert statements then refresh or insert seed data.

:::tip
You can safely run `npm run db:setup` multiple times. Each run is idempotent for schema creation and refreshes agent and KPI data back to seed values via `ON CONFLICT DO UPDATE`.
:::

## Used by

`server/src/db/setup.ts`:

```ts
import { SCHEMA_SQL } from './schema'

await pool.query(SCHEMA_SQL)
```
