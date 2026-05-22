---
title: sortAgents
description: Pure function for sorting the agent list.
---

**File:** `src/lib/sortAgents.ts`

A pure, non-mutating sort function for arrays of `Agent` objects. Supports four
sort keys, all exposed via the `SORT_LABELS` lookup for use in the UI select.

## Types

### `SortKey`

```ts
export type SortKey = 'runs' | 'success' | 'name' | 'recent'
```

The four available sort strategies.

### `SORT_LABELS`

```ts
export const SORT_LABELS: Record<SortKey, string> = {
  runs:    'Most runs',
  success: 'Success rate',
  name:    'Name (A–Z)',
  recent:  'Recently run',
}
```

Display strings for each key, in the order they appear in the `AgentGrid` sort
`<select>`. Exported so `AgentGrid` can iterate them without hardcoding strings.

## `sortAgents`

```ts
export function sortAgents(agents: Agent[], key: SortKey): Agent[]
```

**Parameters:**

| Param | Type | Purpose |
|-------|------|---------|
| `agents` | `Agent[]` | The source array to sort. Not mutated. |
| `key` | `SortKey` | The field to sort by. |

**Returns:** A new array containing the same agents in sorted order.

**Side effects:** None — pure function.

**Mutations:** Does not modify the input array. Makes a shallow copy with
`[...agents]` before sorting.

## Implementation

```ts
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
```

The spread `[...agents]` creates a shallow copy first. Without this, `Array.sort`
would sort in place and mutate the `agents` prop, which could cause unexpected
re-renders in React.

### Sort strategies

| Key | Field | Order | Notes |
|-----|-------|-------|-------|
| `'runs'` | `runsPerWeek` | Descending | Most active first |
| `'success'` | `successRate` | Descending | Best performing first |
| `'name'` | `name` | Ascending | A–Z via `localeCompare` |
| `'recent'` | `lastRunMinutes` | Ascending | Smallest elapsed time first (most recent first) |

`localeCompare` is used for name sorting to handle any non-ASCII characters
and respect the user's locale collation order, rather than relying on
code-point ordering.

`lastRunMinutes` is the orderable numeric companion to the human-readable
`lastRun` string (e.g. `3` for `'3m ago'`, `1440` for `'1d ago'`).

## Tests

`src/lib/sortAgents.test.ts` — 5 tests:

Three-agent fixture: Charlie (50 runs, 90% success, 30 min), Alpha (300 runs,
80%, 5 min), Bravo (100 runs, 99%, 120 min).

| Test | Expected order | Reason |
|------|----------------|--------|
| `'runs'` | Alpha → Bravo → Charlie | 300 → 100 → 50 |
| `'success'` | Bravo → Charlie → Alpha | 99% → 90% → 80% |
| `'name'` | Alpha → Bravo → Charlie | A → B → C |
| `'recent'` | Alpha → Charlie → Bravo | 5m → 30m → 120m |
| No mutation | Source unchanged | `[...agents]` copy |

## Used by

`AgentGrid` — composed with `filterAgents`:

```ts
const visible = useMemo(
  () => sortAgents(filterAgents(agents, { query, category }), sort),
  [agents, query, category, sort],
)
```
