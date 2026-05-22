---
title: agents.ts
description: Frontend agent catalogue — types, seed data and exports.
---

**File:** `src/data/agents.ts`

The frontend's static agent catalogue. Exports the domain types, a 12-agent
array, the featured agent ID, and the canonical category list.

:::note
This is static seed data bundled into the frontend at build time. The backend
holds an identical copy in `server/src/seed.ts` and populates Postgres from it.
Migrating the frontend to load agents from the API is the top backlog item.
:::

## Types

### `AgentStatus`

```ts
export type AgentStatus = 'running' | 'idle' | 'attention'
```

| Value | Meaning | `StatusDot` rendering |
|-------|---------|----------------------|
| `'running'` | Agent is actively executing | Pulsing pink dot |
| `'idle'` | Agent is waiting for a trigger | Static grey dot |
| `'attention'` | Agent needs human intervention | Static amber dot |

### `AgentCategory`

```ts
export type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'
```

The five categories used to bucket agents in the grid's tab filter.

### `Agent`

```ts
export interface Agent {
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
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Stable kebab-case slug (e.g. `'pr-reviewer'`). Used as React key and for URL routing |
| `name` | `string` | Display name (e.g. `'PR Reviewer'`) |
| `category` | `AgentCategory` | Category bucket |
| `description` | `string` | One-sentence summary shown in the card and featured block |
| `status` | `AgentStatus` | Current operational state |
| `runsPerWeek` | `number` | Approximate executions in the last 7 days |
| `successRate` | `number` | Successful-run percentage, 0–100 |
| `avgDuration` | `string` | Human-readable average run duration (e.g. `'2m 40s'`) |
| `lastRun` | `string` | Human-readable time since last run (e.g. `'3m ago'`, `'just now'`) |
| `lastRunMinutes` | `number` | Numeric companion to `lastRun` in minutes. Used for the `'recent'` sort. |
| `popular` | `boolean` | Whether the agent appears under the "Popular" tab in `AgentGrid` |

## Exports

### `AGENTS`

```ts
export const AGENTS: Agent[] = [ /* 12 agents */ ]
```

The complete 12-agent catalogue. Each agent has a unique `id` — this is
enforced by `agents.test.ts`.

### `FEATURED_AGENT_ID`

```ts
export const FEATURED_AGENT_ID = 'pr-reviewer'
```

The `id` of the agent rendered in the `FeaturedAgent` hero card at the top of
the dashboard. `App.tsx` uses this to split `AGENTS` into the featured agent
and the rest:

```ts
const featured = AGENTS.find((a) => a.id === FEATURED_AGENT_ID) ?? AGENTS[0]
const rest = AGENTS.filter((a) => a.id !== featured.id)
```

The `?? AGENTS[0]` fallback ensures rendering continues if `FEATURED_AGENT_ID`
is changed to an ID that no longer exists in `AGENTS`.

### `AGENT_CATEGORIES`

```ts
export const AGENT_CATEGORIES: AgentCategory[] = [
  'Review', 'Deploy', 'Reliability', 'Quality', 'Docs',
]
```

The category list in display order. Used by `AgentGrid` to build the tab bar:

```ts
const TABS: string[] = ['All', 'Popular', ...AGENT_CATEGORIES]
```

## Agent catalogue

| ID | Name | Category | Status | Runs/wk | Success | Popular |
|----|------|----------|--------|---------|---------|---------|
| `pr-reviewer` | PR Reviewer | Review | running | 342 | 96% | Yes |
| `deploy-bot` | Deploy Bot | Deploy | idle | 57 | 99% | Yes |
| `rca-analyst` | RCA Analyst | Reliability | attention | 14 | 88% | No |
| `alert-triage` | Alert Triage | Reliability | running | 410 | 94% | Yes |
| `changelog-author` | Changelog Author | Docs | idle | 38 | 99% | No |
| `e2e-verifier` | E2E Verifier | Quality | running | 122 | 91% | Yes |
| `flaky-test-hunter` | Flaky Test Hunter | Quality | idle | 26 | 93% | No |
| `migration-reviewer` | Migration Reviewer | Review | idle | 19 | 97% | No |
| `dependency-bot` | Dependency Bot | Quality | idle | 64 | 95% | Yes |
| `oncall-digest` | On-call Digest | Reliability | idle | 7 | 100% | No |
| `spec-author` | Spec Author | Docs | idle | 31 | 98% | No |
| `coverage-guard` | Coverage Guard | Quality | running | 88 | 92% | No |

Popular agents (5): PR Reviewer, Deploy Bot, Alert Triage, E2E Verifier,
Dependency Bot.

:::note
`coverage-guard` has `popular: false` despite its high run volume (88/wk).
The `popular` flag is set manually in the source — it is not derived from
`runsPerWeek` or any other metric.
:::

## Tests

`src/data/agents.test.ts` — 6 invariant checks:

| Test | Assertion |
|------|-----------|
| has at least one agent | `AGENTS.length > 0` |
| unique IDs | `new Set(ids).size === AGENTS.length` |
| featured agent exists | `AGENTS.some(a => a.id === FEATURED_AGENT_ID)` |
| known categories only | Every `category` ∈ `AGENT_CATEGORIES` |
| success rates in range | `0 ≤ successRate ≤ 100` for every agent |
| non-empty name and description | Both fields are non-empty after `.trim()` |
