---
title: setup
description: Reference for `server/src/db/setup.ts`
---

**File:** `server/src/db/setup.ts` · **Lines:** 68

<FILL: 2-4 sentence plain-language summary of what `db/setup.ts` is responsible for, what other files it integrates with, and what calls into it.>

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `pg` | `Pool` | external |
| `../config` | `config` | internal |
| `./schema` | `SCHEMA_SQL` | internal |
| `../seed` | `SEED_AGENTS`, `SEED_KPIS` | internal |


:::caution
No exported symbols detected by the AST. This file is likely a side-effect entrypoint, re-export barrel, or runtime bootstrap. The source appendix below contains the full file.
:::

## Diagrams

<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>

## Source

Full file source for `server/src/db/setup.ts` (68 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (68 lines)</summary>

````ts
/*
 * One-shot database setup: create tables and upsert seed data.
 * Run with `npm run db:setup` (requires DATABASE_URL to point at Postgres).
 */
import { Pool } from 'pg'
import { config } from '../config'
import { SCHEMA_SQL } from './schema'
import { SEED_AGENTS, SEED_KPIS } from '../seed'

async function main() {
  const pool = new Pool({ connectionString: config.databaseUrl })
  try {
    await pool.query(SCHEMA_SQL)

    for (const a of SEED_AGENTS) {
      await pool.query(
        `INSERT INTO agents
           (id, name, category, description, status, runs_per_week,
            success_rate, avg_duration, last_run, last_run_minutes, popular)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           category = EXCLUDED.category,
           description = EXCLUDED.description,
           status = EXCLUDED.status,
           runs_per_week = EXCLUDED.runs_per_week,
           success_rate = EXCLUDED.success_rate,
           avg_duration = EXCLUDED.avg_duration,
           last_run = EXCLUDED.last_run,
           last_run_minutes = EXCLUDED.last_run_minutes,
           popular = EXCLUDED.popular`,
        [
          a.id, a.name, a.category, a.description, a.status, a.runsPerWeek,
          a.successRate, a.avgDuration, a.lastRun, a.lastRunMinutes, a.popular,
        ],
      )
    }

    for (let i = 0; i < SEED_KPIS.length; i++) {
      const k = SEED_KPIS[i]
      await pool.query(
        `INSERT INTO kpis (id, sort_order, label, value, delta, positive, hint, trend)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET
           sort_order = EXCLUDED.sort_order,
           label = EXCLUDED.label,
           value = EXCLUDED.value,
           delta = EXCLUDED.delta,
           positive = EXCLUDED.positive,
           hint = EXCLUDED.hint,
           trend = EXCLUDED.trend`,
        [k.id, i, k.label, k.value, k.delta, k.positive, k.hint, JSON.stringify(k.trend)],
      )
    }

    console.log(
      `Database ready: ${SEED_AGENTS.length} agents, ${SEED_KPIS.length} KPIs.`,
    )
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error('Database setup failed:', err)
  process.exit(1)
})

````

</details>
