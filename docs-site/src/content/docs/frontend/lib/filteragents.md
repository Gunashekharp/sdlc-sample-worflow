---
title: filterAgents
description: Reference for `src/lib/filterAgents.ts`
---

<!-- structure:84f9ad55e270 -->

**File:** `src/lib/filterAgents.ts` · **Lines:** 33

<!-- fill:file:summary -->
This module provides `filterAgents`, a pure helper that narrows an `Agent[]` (from `../data/agents`) down to those matching a category selection and a free-text query. It also exports the `AgentFilter` interface describing those two criteria. `AgentGrid.tsx` uses it to drive the agent list as the user types or switches tabs, and `filterAgents.test.ts` exercises it directly. Because it has no side effects it can be unit tested in isolation.
<!-- /fill:file:summary -->

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

<!-- fill:sym:filterAgents:return -->
A new `Agent[]` containing only the agents that satisfy both the category and the query, preserving their original order. It is never `null`; when nothing matches it is an empty array. The input array is not mutated — `Array.filter` returns a fresh array.
<!-- /fill:sym:filterAgents:return -->

### Line-by-line walkthrough

Each top-level statement of `filterAgents`, in execution order. The line numbers reference the source file as it appears today.

**Line 15 — `FirstStatement`**

```ts
const query = filter.query.trim().toLowerCase()
```

<!-- fill:sym:filterAgents:walk:0 -->
Normalizes the search term once, up front: `trim()` strips surrounding whitespace and `toLowerCase()` folds case so the later `includes` checks are case-insensitive. Computing `query` outside the filter callback avoids redoing this work for every agent.
<!-- /fill:sym:filterAgents:walk:0 -->

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

<!-- fill:sym:filterAgents:walk:1 -->
Returns the filtered array. Per agent it first computes `matchesCategory`: `'All'` matches everything, `'Popular'` matches when `agent.popular` is true, otherwise the agent's `category` must equal the filter category exactly. Agents failing the category test are dropped immediately. With no query the agent is kept; otherwise it is kept only if the lowercased `name` or `description` contains the normalized `query`. Both checks must pass, so category and query compose as an AND.
<!-- /fill:sym:filterAgents:walk:1 -->

### Examples

<!-- fill:sym:filterAgents:example -->
Given three agents `a` (PR Reviewer, Review, popular), `b` (Deploy Bot, Deploy, popular), and `c` (RCA Analyst, Reliability):

```ts
filterAgents(agents, { category: 'All', query: '' }).map(a => a.id)
// → ['a', 'b', 'c']

filterAgents(agents, { category: 'Popular', query: '' }).map(a => a.id)
// → ['a', 'b']

filterAgents(agents, { category: 'All', query: 'root cause' }).map(a => a.id)
// → ['c']  (matched against the description)

filterAgents(agents, { category: 'Popular', query: 'reviewer' }).map(a => a.id)
// → ['a']  (category AND query)

filterAgents(agents, { category: 'All', query: 'nonexistent' })
// → []
```
<!-- /fill:sym:filterAgents:example -->

### Used by

- `src/components/AgentGrid.tsx`
- `src/lib/filterAgents.test.ts`

## AgentFilter

**Kind:** `interface`

```ts
export interface AgentFilter { ... }
```

<!-- fill:sym:AgentFilter:summary -->
`AgentFilter` is the parameter object `filterAgents` accepts. It pairs a free-text `query` with a `category` selector, so callers express both filtering dimensions in one value. It exists to keep the filter signature stable as criteria are added and to mirror the controls rendered in `AgentGrid.tsx`.
<!-- /fill:sym:AgentFilter:summary -->

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

<!-- fill:file:diagrams -->
```mermaid
flowchart TD
  In["agents, filter"] --> Norm["query = filter.query.trim().toLowerCase()"]
  Norm --> Each["for each agent"]
  Each --> Cat{"matches category?"}
  Cat -->|"no"| Drop["drop agent"]
  Cat -->|"yes"| HasQ{"query empty?"}
  HasQ -->|"yes"| Keep["keep agent"]
  HasQ -->|"no"| Match{"name or description includes query?"}
  Match -->|"yes"| Keep
  Match -->|"no"| Drop
  Keep --> Out["return filtered Agent[]"]
  Drop --> Out
```
<!-- /fill:file:diagrams -->
