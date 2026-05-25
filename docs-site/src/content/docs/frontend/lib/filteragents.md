---
title: filterAgents
description: Reference for `src/lib/filterAgents.ts`
---

**File:** `src/lib/filterAgents.ts` · **Lines:** 33

<FILL: 2-4 sentence plain-language summary of what `lib/filterAgents.ts` is responsible for, what other files it integrates with, and what calls into it.>

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `../data/agents` | `Agent` | type-only · internal |


## Symbols

This file exports 2 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| filterAgents | function | no |
| AgentFilter | interface | no |

## filterAgents

**Kind:** `function`

```ts
export function filterAgents(agents: Agent[], filter: AgentFilter): Agent[] { ... }
```

> Filter the agent list by category and free-text query.
> Pure and side-effect free so it can be unit tested directly.

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| agents | `Agent[]` | — | yes | <FILL: purpose of agents> |
| filter | `AgentFilter` | — | yes | <FILL: purpose of filter> |

**Returns:** `Agent[]`

<FILL: describe the return value of filterAgents — what it represents, when it can be null/undefined, units.>

### Line-by-line walkthrough

Each top-level statement of `filterAgents`, in execution order. The line numbers reference the source file as it appears today.

**Line 15 — `FirstStatement`**

```ts
const query = filter.query.trim().toLowerCase()
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 17 — `ReturnStatement`**

```ts
return agents.filter((agent) => {
    const matchesCategory =
      filter.category === 'All' ||
      (filter.category === 'Popular'
        ? agent.popular
        : agent.category === filter.category)

    if (!matchesCategory) return false
    if (!query) return true

    return (
      agent.name.toLowerCase().includes(query) ||
      agent.description.toLowerCase().includes(query)
    )
  })
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

### Examples

<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>

### Used by

- `src/components/AgentGrid.tsx`
- `src/lib/filterAgents.test.ts`

## AgentFilter

**Kind:** `interface`

```ts
export interface AgentFilter { ... }
```

<FILL: 2-4 sentences explaining what AgentFilter does and why it exists. Ground every claim in the signature and source.>

### Shape

| Name | Type | Description |
| --- | --- | --- |
| query | `string` | Free-text query matched against agent name and description. |
| category | `string` | 'All', 'Popular', or one of the AgentCategory values. |

## Tests

| Suite | Test | Asserts |
| --- | --- | --- |
| filterAgents | returns every agent for the All category and empty query | <FILL: assertion summary> |
| filterAgents | filters by an exact category | <FILL: assertion summary> |
| filterAgents | filters by the Popular pseudo-category | <FILL: assertion summary> |
| filterAgents | matches the query against the agent name | <FILL: assertion summary> |
| filterAgents | matches the query against the description | <FILL: assertion summary> |
| filterAgents | is case-insensitive | <FILL: assertion summary> |
| filterAgents | ignores surrounding whitespace in the query | <FILL: assertion summary> |
| filterAgents | applies category and query together | <FILL: assertion summary> |
| filterAgents | returns an empty array when nothing matches | <FILL: assertion summary> |
| filterAgents | does not mutate the input array | <FILL: assertion summary> |

## Diagrams

<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>

## Source

Full file source for `src/lib/filterAgents.ts` (33 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (33 lines)</summary>

````ts
import type { Agent } from '../data/agents'

export interface AgentFilter {
  /** Free-text query matched against agent name and description. */
  query: string
  /** 'All', 'Popular', or one of the AgentCategory values. */
  category: string
}

/**
 * Filter the agent list by category and free-text query.
 * Pure and side-effect free so it can be unit tested directly.
 */
export function filterAgents(agents: Agent[], filter: AgentFilter): Agent[] {
  const query = filter.query.trim().toLowerCase()

  return agents.filter((agent) => {
    const matchesCategory =
      filter.category === 'All' ||
      (filter.category === 'Popular'
        ? agent.popular
        : agent.category === filter.category)

    if (!matchesCategory) return false
    if (!query) return true

    return (
      agent.name.toLowerCase().includes(query) ||
      agent.description.toLowerCase().includes(query)
    )
  })
}

````

</details>
