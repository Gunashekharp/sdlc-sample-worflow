---
title: agents.ts — agent catalogue
---

**File:** `src/data/agents.ts`

The frontend's static agent catalogue. Exports two union types, one interface, the 12-agent array, the featured-agent ID constant, and the canonical category list.

:::note
This is static seed data bundled at build time. The backend holds a matching copy in `server/src/seed.ts`. If you add or modify an agent here, update the backend seed file as well.
:::

## `AgentStatus` type

```ts
export type AgentStatus = 'running' | 'idle' | 'attention'
```

The three operational states an agent can be in at any moment.

| Value | Meaning | `StatusDot` rendering |
|---|---|---|
| `'running'` | The agent is actively executing a task right now | Pulsing pink circle (CSS `animate-pulse`, `--color-accent`) |
| `'idle'` | The agent is healthy and waiting for its next trigger | Static grey circle (`--color-text-faint`) |
| `'attention'` | The agent has encountered an issue and requires human review | Static amber circle (`--color-warn`) |

## `AgentCategory` type

```ts
export type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'
```

The five categories used to bucket agents in `AgentGrid`'s tab filter. The canonical display order is defined by `AGENT_CATEGORIES` below.

| Category | Domain |
|---|---|
| `'Review'` | Code review automation (PRs, database migrations) |
| `'Deploy'` | Deployment automation and health checks |
| `'Reliability'` | Incident response, alert triage, on-call support |
| `'Quality'` | Testing, coverage, dependency hygiene |
| `'Docs'` | Documentation and specification writing |

## `Agent` interface

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

### Field reference

| Field | Type | Display-only? | Purpose |
|---|---|---|---|
| `id` | `string` | No | Stable kebab-case slug (e.g. `'pr-reviewer'`). Used as the React `key` in lists, as the `FEATURED_AGENT_ID` lookup key, and as the anchor for future URL routing. Never changes. |
| `name` | `string` | Yes | Human-readable display name (e.g. `'PR Reviewer'`). Shown in `AgentCard`, `FeaturedAgent`, and as the search match target. |
| `category` | `AgentCategory` | No | Category bucket. Used by `filterAgents` for the category tab filter and by `AgentGrid` to build the tab bar via `AGENT_CATEGORIES`. |
| `description` | `string` | Yes | One-sentence plain-English summary of what the agent does. Shown in `AgentCard` and `FeaturedAgent`. Also searched by `filterAgents` when a query is typed. |
| `status` | `AgentStatus` | Yes | Current operational state. Drives `StatusDot` color and animation. |
| `runsPerWeek` | `number` | Yes | Approximate number of executions in the last 7 days. Shown in the `AgentCard` stats row. Used by `sortAgents` for the `'runs'` sort key (descending). |
| `successRate` | `number` | Yes | Percentage of successful runs, 0–100. Shown in `AgentCard`. Used by `sortAgents` for the `'success'` sort key (descending). |
| `avgDuration` | `string` | Yes | Human-readable average run duration (e.g. `'2m 40s'`). Display-only; not used for sorting or filtering. |
| `lastRun` | `string` | Yes | Human-readable time since the last run (e.g. `'3m ago'`, `'just now'`, `'1d ago'`). Display-only companion to `lastRunMinutes`. |
| `lastRunMinutes` | `number` | No | Numeric minutes since the last run (e.g. `3`, `0`, `1440`). Used by `sortAgents` for the `'recent'` sort key (ascending — smaller value = more recent). |
| `popular` | `boolean` | No | When `true`, the agent appears under the `'Popular'` tab in `AgentGrid`. Set manually; not derived from any metric. |

## `AGENTS` array

```ts
export const AGENTS: Agent[] = [ /* 12 agents */ ]
```

The complete catalogue. Each agent has a unique `id` — this invariant is verified by `src/data/agents.test.ts`.

### Full catalogue

| ID | Name | Category | Status | Runs/wk | Success | Popular |
|---|---|---|---|---|---|---|
| `pr-reviewer` | PR Reviewer | Review | `running` | 342 | 96% | Yes |
| `deploy-bot` | Deploy Bot | Deploy | `idle` | 57 | 99% | Yes |
| `rca-analyst` | RCA Analyst | Reliability | `attention` | 14 | 88% | No |
| `alert-triage` | Alert Triage | Reliability | `running` | 410 | 94% | Yes |
| `changelog-author` | Changelog Author | Docs | `idle` | 38 | 99% | No |
| `e2e-verifier` | E2E Verifier | Quality | `running` | 122 | 91% | Yes |
| `flaky-test-hunter` | Flaky Test Hunter | Quality | `idle` | 26 | 93% | No |
| `migration-reviewer` | Migration Reviewer | Review | `idle` | 19 | 97% | No |
| `dependency-bot` | Dependency Bot | Quality | `idle` | 64 | 95% | Yes |
| `oncall-digest` | On-call Digest | Reliability | `idle` | 7 | 100% | No |
| `spec-author` | Spec Author | Docs | `idle` | 31 | 98% | No |
| `coverage-guard` | Coverage Guard | Quality | `running` | 88 | 92% | No |

:::note
`coverage-guard` has `popular: false` despite its relatively high run volume (88/wk). The `popular` flag is set manually in the source and is not derived from `runsPerWeek` or any other metric.
:::

## `FEATURED_AGENT_ID` constant

```ts
export const FEATURED_AGENT_ID = 'pr-reviewer'
```

The `id` of the agent displayed in the `FeaturedAgent` hero card at the top of the dashboard. `App.tsx` uses this value to split `AGENTS`:

```ts
const featured = AGENTS.find((a) => a.id === FEATURED_AGENT_ID) ?? AGENTS[0]
const rest = AGENTS.filter((a) => a.id !== featured.id)
```

The `?? AGENTS[0]` fallback ensures the app renders correctly even if `FEATURED_AGENT_ID` is changed to an ID that no longer exists in `AGENTS`.

## `AGENT_CATEGORIES` constant

```ts
export const AGENT_CATEGORIES: AgentCategory[] = [
  'Review', 'Deploy', 'Reliability', 'Quality', 'Docs',
]
```

The canonical list of categories in their intended display order. Used by `AgentGrid` to build the tab bar:

```ts
const TABS: string[] = ['All', 'Popular', ...AGENT_CATEGORIES]
// → ['All', 'Popular', 'Review', 'Deploy', 'Reliability', 'Quality', 'Docs']
```

Iterating `AGENT_CATEGORIES` here (rather than hardcoding the tab list) means adding a new category to the type and the array automatically adds the tab to the UI.

## Tests

`src/data/agents.test.ts` — 6 invariant checks:

| Test | Assertion |
|---|---|
| has at least one agent | `AGENTS.length > 0` |
| all IDs are unique | `new Set(ids).size === AGENTS.length` |
| `FEATURED_AGENT_ID` exists in `AGENTS` | `AGENTS.some((a) => a.id === FEATURED_AGENT_ID)` |
| all categories are known | Every `agent.category` is in `AGENT_CATEGORIES` |
| success rates are in range | `successRate >= 0 && successRate <= 100` for every agent |
| names and descriptions are non-empty | Both fields are truthy after `.trim()` |
