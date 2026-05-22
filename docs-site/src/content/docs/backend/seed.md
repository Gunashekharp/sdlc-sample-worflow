---
title: seed.ts
description: Seed agents and KPIs for Postgres setup and tests.
---

**File:** `server/src/seed.ts`

Exports the canonical seed data for the backend: 12 agents and 4 KPIs. This
data serves two purposes:

1. **Database setup** — `db/setup.ts` upserts this data into Postgres when you
   run `npm run db:setup`.
2. **Test fixture** — `api.test.ts` injects it into `createMemoryStore` so the
   test suite has deterministic data without a database.

## `SEED_AGENTS`

```ts
export const SEED_AGENTS: Agent[]
```

12 agents, identical to the frontend's `src/data/agents.ts` `AGENTS` array.
The data is duplicated by design — there is no shared package.

## `SEED_KPIS`

```ts
export const SEED_KPIS: Kpi[]
```

4 KPIs, identical to the frontend's `src/data/kpis.ts` `KPIS` array.

## Agent catalogue

| ID | Name | Category | Status | Runs/wk | Success% | Popular |
|----|------|----------|--------|---------|----------|---------|
| `pr-reviewer` | PR Reviewer | Review | running | 342 | 96 | true |
| `deploy-bot` | Deploy Bot | Deploy | idle | 57 | 99 | true |
| `rca-analyst` | RCA Analyst | Reliability | attention | 14 | 88 | false |
| `alert-triage` | Alert Triage | Reliability | running | 410 | 94 | true |
| `changelog-author` | Changelog Author | Docs | idle | 38 | 99 | false |
| `e2e-verifier` | E2E Verifier | Quality | running | 122 | 91 | true |
| `flaky-test-hunter` | Flaky Test Hunter | Quality | idle | 26 | 93 | false |
| `migration-reviewer` | Migration Reviewer | Review | idle | 19 | 97 | false |
| `dependency-bot` | Dependency Bot | Quality | idle | 64 | 95 | true |
| `oncall-digest` | On-call Digest | Reliability | idle | 7 | 100 | false |
| `spec-author` | Spec Author | Docs | idle | 31 | 98 | false |
| `coverage-guard` | Coverage Guard | Quality | running | 88 | 92 | false |

## KPI catalogue

| ID | Label | Value | Delta | Trend |
|----|-------|-------|-------|-------|
| `agent-runs` | Agent runs · 7d | `1,284` | `+18%` | 980→1284 (7pts) |
| `prs-reviewed` | PRs reviewed | `342` | `+9%` | 290→342 (7pts) |
| `time-to-merge` | Mean time to merge | `4h 12m` | `-22%` | 340→252 min (7pts) |
| `suite-pass-rate` | Suite pass rate | `97.4%` | `+0.6%` | 96.2→97.4% (7pts) |

## Used by

- `server/src/db/setup.ts` — iterates `SEED_AGENTS` and `SEED_KPIS`, upserting
  each row into Postgres.
- `server/src/__tests__/api.test.ts`:
  ```ts
  createApp({
    store: createMemoryStore(SEED_AGENTS, SEED_KPIS),
    cicd: createMockCicdProvider(),
  })
  ```
