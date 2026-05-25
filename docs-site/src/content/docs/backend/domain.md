---
title: domain
description: Reference for `server/src/domain.ts`
---

**File:** `server/src/domain.ts` · **Lines:** 33

<FILL: 2-4 sentence plain-language summary of what `domain.ts` is responsible for, what other files it integrates with, and what calls into it.>

## Symbols

This file exports 4 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| AgentStatus | type | no |
| AgentCategory | type | no |
| Agent | interface | no |
| Kpi | interface | no |

## AgentStatus

**Kind:** `type`

```ts
export type AgentStatus = 'running' | 'idle' | 'attention'
```

<FILL: 2-4 sentences explaining what AgentStatus does and why it exists. Ground every claim in the signature and source.>

### Used by

- `server/src/postgresStore.ts`

## AgentCategory

**Kind:** `type`

```ts
export type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'
```

<FILL: 2-4 sentences explaining what AgentCategory does and why it exists. Ground every claim in the signature and source.>

### Used by

- `server/src/postgresStore.ts`

## Agent

**Kind:** `interface`

```ts
export interface Agent { ... }
```

<FILL: 2-4 sentences explaining what Agent does and why it exists. Ground every claim in the signature and source.>

### Shape

| Name | Type | Description |
| --- | --- | --- |
| id | `string` | <FILL: id> |
| name | `string` | <FILL: name> |
| category | `AgentCategory` | <FILL: category> |
| description | `string` | <FILL: description> |
| status | `AgentStatus` | <FILL: status> |
| runsPerWeek | `number` | <FILL: runsPerWeek> |
| successRate | `number` | <FILL: successRate> |
| avgDuration | `string` | <FILL: avgDuration> |
| lastRun | `string` | <FILL: lastRun> |
| lastRunMinutes | `number` | <FILL: lastRunMinutes> |
| popular | `boolean` | <FILL: popular> |

### Used by

- `server/src/store.ts`
- `server/src/postgresStore.ts`
- `server/src/seed.ts`

## Kpi

**Kind:** `interface`

```ts
export interface Kpi { ... }
```

<FILL: 2-4 sentences explaining what Kpi does and why it exists. Ground every claim in the signature and source.>

### Shape

| Name | Type | Description |
| --- | --- | --- |
| id | `string` | <FILL: id> |
| label | `string` | <FILL: label> |
| value | `string` | <FILL: value> |
| delta | `string` | <FILL: delta> |
| positive | `boolean` | <FILL: positive> |
| hint | `string` | <FILL: hint> |
| trend | `number[]` | <FILL: trend> |

### Used by

- `server/src/store.ts`
- `server/src/postgresStore.ts`
- `server/src/seed.ts`

## Diagrams

<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>

## Source

Full file source for `server/src/domain.ts` (33 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (33 lines)</summary>

````ts
/*
 * Domain types for the Snabbit Agent Console API.
 * Mirrors the shapes the frontend expects.
 */

export type AgentStatus = 'running' | 'idle' | 'attention'

export type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'

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

export interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean
  hint: string
  trend: number[]
}

````

</details>
