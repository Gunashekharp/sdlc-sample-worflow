---
title: "seed.ts — seed data"
---

**File:** `server/src/seed.ts`

Exports the canonical seed data for the backend: 12 agents typed as `Agent[]` and 4 KPIs typed as `Kpi[]`. This data serves two purposes:

1. **Database seeding** — `db/setup.ts` upserts all rows into Postgres when you run `npm run db:setup`.
2. **Test fixtures** — `api.test.ts` passes these arrays to `createMemoryStore` so tests have deterministic data without a database connection.

:::note
The seed data is structurally identical to the frontend's `src/data/agents.ts` (`AGENTS`) and `src/data/kpis.ts` (`KPIS`) arrays. There is no shared package — the two copies are maintained by hand. Any change to an agent or KPI must be mirrored in both places.
:::

## `SEED_AGENTS`

```ts
export const SEED_AGENTS: Agent[]
```

An array of 12 `Agent` objects in display order. When upserted into Postgres, `db/setup.ts` uses `ON CONFLICT (id) DO UPDATE` so re-running the script refreshes all fields back to these values.

### Agent catalogue

| ID | Name | Category | Status | Runs/wk | Success% | Popular |
|---|---|---|---|---|---|---|
| `pr-reviewer` | PR Reviewer | Review | running | 342 | 96 | yes |
| `deploy-bot` | Deploy Bot | Deploy | idle | 57 | 99 | yes |
| `rca-analyst` | RCA Analyst | Reliability | attention | 14 | 88 | no |
| `alert-triage` | Alert Triage | Reliability | running | 410 | 94 | yes |
| `changelog-author` | Changelog Author | Docs | idle | 38 | 99 | no |
| `e2e-verifier` | E2E Verifier | Quality | running | 122 | 91 | yes |
| `flaky-test-hunter` | Flaky Test Hunter | Quality | idle | 26 | 93 | no |
| `migration-reviewer` | Migration Reviewer | Review | idle | 19 | 97 | no |
| `dependency-bot` | Dependency Bot | Quality | idle | 64 | 95 | yes |
| `oncall-digest` | On-call Digest | Reliability | idle | 7 | 100 | no |
| `spec-author` | Spec Author | Docs | idle | 31 | 98 | no |
| `coverage-guard` | Coverage Guard | Quality | running | 88 | 92 | no |

When served from the Postgres store (`listAgents`), agents are returned ordered by `runs_per_week DESC`:
1. `alert-triage` (410)
2. `pr-reviewer` (342)
3. `e2e-verifier` (122)
4. `coverage-guard` (88)
5. `dependency-bot` (64)
6. `deploy-bot` (57)
7. `changelog-author` (38)
8. `spec-author` (31)
9. `flaky-test-hunter` (26)
10. `migration-reviewer` (19)
11. `rca-analyst` (14)
12. `oncall-digest` (7)

## `SEED_KPIS`

```ts
export const SEED_KPIS: Kpi[]
```

An array of 4 `Kpi` objects. The array index determines `sort_order` in Postgres (index 0 → `sort_order = 0`, etc.).

### KPI catalogue

| Index | ID | Label | Value | Delta | Positive |
|---|---|---|---|---|---|
| 0 | `agent-runs` | Agent runs · 7d | `1,284` | `+18%` | yes |
| 1 | `prs-reviewed` | PRs reviewed | `342` | `+9%` | yes |
| 2 | `time-to-merge` | Mean time to merge | `4h 12m` | `-22%` | yes |
| 3 | `suite-pass-rate` | Suite pass rate | `97.4%` | `+0.6%` | yes |

Each KPI has a 7-point `trend` array used by the sparkline chart:

| ID | Trend series |
|---|---|
| `agent-runs` | `[980, 1020, 1050, 1100, 1180, 1240, 1284]` |
| `prs-reviewed` | `[290, 298, 305, 315, 325, 334, 342]` |
| `time-to-merge` | `[340, 325, 310, 295, 275, 260, 252]` (decreasing = improving) |
| `suite-pass-rate` | `[96.2, 96.4, 96.7, 96.9, 97.1, 97.3, 97.4]` |

## Used by

- **`server/src/db/setup.ts`** — iterates `SEED_AGENTS` and `SEED_KPIS`, upserting each row into Postgres with `ON CONFLICT (id) DO UPDATE`.
- **`server/src/__tests__/api.test.ts`**:
  ```ts
  import { SEED_AGENTS, SEED_KPIS } from '../seed'
  import { createMemoryStore } from '../store'

  const store = createMemoryStore(SEED_AGENTS, SEED_KPIS)
  ```
