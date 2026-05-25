---
title: sortAgents
description: Reference for `src/lib/sortAgents.ts`
---

**File:** `src/lib/sortAgents.ts` · **Lines:** 30

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `lib/sortAgents.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `../data/agents` | `Agent` | type-only · internal |


## Symbols

This file exports 3 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| sortAgents | function | no |
| SortKey | type | no |
| SORT_LABELS | const | no |

## sortAgents

**Kind:** `function`

```ts
export function sortAgents(agents: Agent[], key: SortKey): Agent[] { ... }
```

> Return a new array of agents sorted by the given key.
> Pure — does not mutate the input array.

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| agents | `Agent[]` | — | yes | <FILL: purpose of agents> |
| key | `SortKey` | — | yes | <FILL: purpose of key> |

**Returns:** `Agent[]`

<!-- fill:sym:sortAgents:return -->
<FILL: describe the return value of sortAgents — what it represents, when it can be null/undefined, units.>
<!-- /fill:sym:sortAgents:return -->

### Line-by-line walkthrough

Each top-level statement of `sortAgents`, in execution order. The line numbers reference the source file as it appears today.

**Line 18 — `FirstStatement`**

```ts
const copy = [...agents]
```

<!-- fill:sym:sortAgents:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:sortAgents:walk:0 -->

**Line 19 — `SwitchStatement`**

```ts
switch (key) {
    case 'runs':
      return copy.sort((a, b) => b.runsPerWeek - a.runsPerWeek)
    case 'success':
      return copy.sort((a, b) => b.successRate - a.successRate)
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'recent':
      return copy.sort((a, b) => a.lastRunMinutes - b.lastRunMinutes)
  }
```

<!-- fill:sym:sortAgents:walk:1 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:sortAgents:walk:1 -->

### Examples

<!-- fill:sym:sortAgents:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:sortAgents:example -->

### Used by

- `src/components/AgentGrid.tsx`
- `src/lib/sortAgents.test.ts`

## SortKey

**Kind:** `type`

```ts
export type SortKey = 'runs' | 'success' | 'name' | 'recent'
```

<!-- fill:sym:SortKey:summary -->
<FILL: 2-4 sentences explaining what SortKey does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:SortKey:summary -->

### Used by

- `src/components/AgentGrid.tsx`

## SORT_LABELS

**Kind:** `const`

```ts
const SORT_LABELS: Record<SortKey, string>
```

> Display labels for each sort key, in menu order.

### Used by

- `src/components/AgentGrid.tsx`

## Tests

| Suite | Test | Asserts |
| --- | --- | --- |
| sortAgents | sorts by runs, descending | <FILL: assertion summary> |
| sortAgents | sorts by success rate, descending | <FILL: assertion summary> |
| sortAgents | sorts by name, ascending | <FILL: assertion summary> |
| sortAgents | sorts by most recent run first | <FILL: assertion summary> |
| sortAgents | does not mutate the input array | <FILL: assertion summary> |

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->

## Source

Full file source for `src/lib/sortAgents.ts` (30 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (30 lines)</summary>

````ts
import type { Agent } from '../data/agents'

export type SortKey = 'runs' | 'success' | 'name' | 'recent'

/** Display labels for each sort key, in menu order. */
export const SORT_LABELS: Record<SortKey, string> = {
  runs: 'Most runs',
  success: 'Success rate',
  name: 'Name (A–Z)',
  recent: 'Recently run',
}

/**
 * Return a new array of agents sorted by the given key.
 * Pure — does not mutate the input array.
 */
export function sortAgents(agents: Agent[], key: SortKey): Agent[] {
  const copy = [...agents]
  switch (key) {
    case 'runs':
      return copy.sort((a, b) => b.runsPerWeek - a.runsPerWeek)
    case 'success':
      return copy.sort((a, b) => b.successRate - a.successRate)
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'recent':
      return copy.sort((a, b) => a.lastRunMinutes - b.lastRunMinutes)
  }
}

````

</details>
