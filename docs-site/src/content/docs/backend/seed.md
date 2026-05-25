---
title: seed
description: Reference for `server/src/seed.ts`
---

**File:** `server/src/seed.ts` · **Lines:** 218

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `seed.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `./domain` | `Agent`, `Kpi` | type-only · internal |


## Symbols

This file exports 2 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| SEED_AGENTS | const | no |
| SEED_KPIS | const | no |

## SEED_AGENTS

**Kind:** `const`

```ts
const SEED_AGENTS: Agent[]
```

<!-- fill:sym:SEED_AGENTS:summary -->
<FILL: 2-4 sentences explaining what SEED_AGENTS does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:SEED_AGENTS:summary -->

### Used by

- `server/src/__tests__/api.test.ts`
- `server/src/db/setup.ts`

## SEED_KPIS

**Kind:** `const`

```ts
const SEED_KPIS: Kpi[]
```

<!-- fill:sym:SEED_KPIS:summary -->
<FILL: 2-4 sentences explaining what SEED_KPIS does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:SEED_KPIS:summary -->

### Used by

- `server/src/__tests__/api.test.ts`
- `server/src/db/setup.ts`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->

## Source

Full file source for `server/src/seed.ts` (218 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (218 lines)</summary>

````ts
import type { Agent, Kpi } from './domain'

/*
 * Seed data — the agent catalogue and KPIs.
 * Loaded into Postgres by `npm run db:setup` and used directly by the
 * in-memory store in tests.
 */

export const SEED_AGENTS: Agent[] = [
  {
    id: 'pr-reviewer',
    name: 'PR Reviewer',
    category: 'Review',
    description:
      'Reviews open pull requests for correctness, security, and style, and leaves inline comments before merge.',
    status: 'running',
    runsPerWeek: 342,
    successRate: 96,
    avgDuration: '2m 40s',
    lastRun: '3m ago',
    lastRunMinutes: 3,
    popular: true,
  },
  {
    id: 'deploy-bot',
    name: 'Deploy Bot',
    category: 'Deploy',
    description:
      'Ships approved changes to staging and production with health checks and automated rollback on failure.',
    status: 'idle',
    runsPerWeek: 57,
    successRate: 99,
    avgDuration: '6m 10s',
    lastRun: '1h ago',
    lastRunMinutes: 60,
    popular: true,
  },
  {
    id: 'rca-analyst',
    name: 'RCA Analyst',
    category: 'Reliability',
    description:
      'Investigates incidents and drafts a root-cause analysis from logs, traces, and recent deploys.',
    status: 'attention',
    runsPerWeek: 14,
    successRate: 88,
    avgDuration: '8m 30s',
    lastRun: '22m ago',
    lastRunMinutes: 22,
    popular: false,
  },
  {
    id: 'alert-triage',
    name: 'Alert Triage',
    category: 'Reliability',
    description:
      'Triages PagerDuty and Datadog alerts, dedupes noise, and routes each to the right owner.',
    status: 'running',
    runsPerWeek: 410,
    successRate: 94,
    avgDuration: '0m 45s',
    lastRun: 'just now',
    lastRunMinutes: 0,
    popular: true,
  },
  {
    id: 'changelog-author',
    name: 'Changelog Author',
    category: 'Docs',
    description:
      'Generates release notes and changelog entries from merged pull requests and linked issues.',
    status: 'idle',
    runsPerWeek: 38,
    successRate: 99,
    avgDuration: '1m 20s',
    lastRun: '5h ago',
    lastRunMinutes: 300,
    popular: false,
  },
  {
    id: 'e2e-verifier',
    name: 'E2E Verifier',
    category: 'Quality',
    description:
      'Runs Playwright end-to-end suites against preview deploys and reports failures and flakes.',
    status: 'running',
    runsPerWeek: 122,
    successRate: 91,
    avgDuration: '11m 05s',
    lastRun: '8m ago',
    lastRunMinutes: 8,
    popular: true,
  },
  {
    id: 'flaky-test-hunter',
    name: 'Flaky Test Hunter',
    category: 'Quality',
    description:
      'Detects flaky tests across CI history, quarantines them, and opens a tracking issue.',
    status: 'idle',
    runsPerWeek: 26,
    successRate: 93,
    avgDuration: '4m 15s',
    lastRun: '1d ago',
    lastRunMinutes: 1440,
    popular: false,
  },
  {
    id: 'migration-reviewer',
    name: 'Migration Reviewer',
    category: 'Review',
    description:
      'Checks database migrations for lock risk, missing backfills, and reversibility before merge.',
    status: 'idle',
    runsPerWeek: 19,
    successRate: 97,
    avgDuration: '3m 50s',
    lastRun: '6h ago',
    lastRunMinutes: 360,
    popular: false,
  },
  {
    id: 'dependency-bot',
    name: 'Dependency Bot',
    category: 'Quality',
    description:
      'Opens dependency-upgrade pull requests, runs the full suite, and validates the diff.',
    status: 'idle',
    runsPerWeek: 64,
    successRate: 95,
    avgDuration: '5m 30s',
    lastRun: '3h ago',
    lastRunMinutes: 180,
    popular: true,
  },
  {
    id: 'oncall-digest',
    name: 'On-call Digest',
    category: 'Reliability',
    description:
      'Summarizes the overnight on-call shift: alerts fired, deploys shipped, and incidents opened.',
    status: 'idle',
    runsPerWeek: 7,
    successRate: 100,
    avgDuration: '2m 00s',
    lastRun: '9h ago',
    lastRunMinutes: 540,
    popular: false,
  },
  {
    id: 'spec-author',
    name: 'Spec Author',
    category: 'Docs',
    description:
      'Drafts technical specs and architecture decision records from a short natural-language prompt.',
    status: 'idle',
    runsPerWeek: 31,
    successRate: 98,
    avgDuration: '1m 45s',
    lastRun: '2h ago',
    lastRunMinutes: 120,
    popular: false,
  },
  {
    id: 'coverage-guard',
    name: 'Coverage Guard',
    category: 'Quality',
    description:
      'Blocks pull requests that drop test coverage below the configured threshold.',
    status: 'running',
    runsPerWeek: 88,
    successRate: 92,
    avgDuration: '0m 55s',
    lastRun: '12m ago',
    lastRunMinutes: 12,
    popular: false,
  },
]

export const SEED_KPIS: Kpi[] = [
  {
    id: 'agent-runs',
    label: 'Agent runs · 7d',
    value: '1,284',
    delta: '+18%',
    positive: true,
    hint: 'Total agent executions in the last 7 days.',
    trend: [980, 1010, 1060, 1040, 1120, 1180, 1284],
  },
  {
    id: 'prs-reviewed',
    label: 'PRs reviewed',
    value: '342',
    delta: '+9%',
    positive: true,
    hint: 'Pull requests reviewed by agents this week.',
    trend: [290, 300, 285, 310, 320, 330, 342],
  },
  {
    id: 'time-to-merge',
    label: 'Mean time to merge',
    value: '4h 12m',
    delta: '-22%',
    positive: true,
    hint: 'Average time from PR open to merge.',
    trend: [340, 330, 318, 300, 285, 270, 252],
  },
  {
    id: 'suite-pass-rate',
    label: 'Suite pass rate',
    value: '97.4%',
    delta: '+0.6%',
    positive: true,
    hint: 'Share of CI runs passing on the first attempt.',
    trend: [96.2, 96.5, 96.8, 96.6, 97.0, 97.1, 97.4],
  },
]

````

</details>
