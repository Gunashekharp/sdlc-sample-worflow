---
title: sortAgents.ts
---

**File:** `src/lib/sortAgents.ts`

A pure, non-mutating sort function for arrays of `Agent` objects. Supports four sort strategies, all exposed via the `SORT_LABELS` lookup used by the `AgentGrid` sort `<select>`.

## `SortKey` type

```ts
export type SortKey = 'runs' | 'success' | 'name' | 'recent'
```

The four available sort strategies. `SortKey` is also used by `usePersistentState` in `AgentGrid` to persist the user's sort preference:

```ts
const [sort, setSort] = usePersistentState<SortKey>('snabbit.agentGrid.sort', 'runs')
```

## `SORT_LABELS` record

```ts
export const SORT_LABELS: Record<SortKey, string> = {
  runs:    'Most runs',
  success: 'Success rate',
  name:    'Name (A–Z)',
  recent:  'Recently run',
}
```

Human-readable display strings for each sort key, in the intended display order for the `<select>` menu in `AgentGrid`. Exported so `AgentGrid` can iterate them without hardcoding strings:

```ts
{(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
  <option key={key} value={key}>{SORT_LABELS[key]}</option>
))}
```

## `sortAgents` function

```ts
export function sortAgents(agents: Agent[], key: SortKey): Agent[]
```

### Parameters

| Parameter | Type | Purpose |
|---|---|---|
| `agents` | `Agent[]` | The source array to sort. Never mutated. A shallow copy is made before sorting. |
| `key` | `SortKey` | The sort strategy to apply. |

### Returns

A new `Agent[]` containing the same agents in sorted order. The original array is not modified.

### Side effects

None. The function is pure — given the same inputs it always returns the same output and has no observable side effects.

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

### Why `[...agents]`

`Array.prototype.sort` mutates the array in place. Without the spread copy, calling `sortAgents` would modify the `agents` prop that was passed to `AgentGrid`. In React, mutating props can suppress re-renders because the old and new references are identical, producing stale UI. The spread creates a shallow copy (a new array of the same `Agent` object references) so the sort operates on the copy and the original array is untouched.

### Sort strategies

| Key | Field sorted | Order | Comparator |
|---|---|---|---|
| `'runs'` | `runsPerWeek` | Descending | `b.runsPerWeek - a.runsPerWeek` — highest run count first |
| `'success'` | `successRate` | Descending | `b.successRate - a.successRate` — best success rate first |
| `'name'` | `name` | Ascending (A–Z) | `a.name.localeCompare(b.name)` — locale-aware alphabetical |
| `'recent'` | `lastRunMinutes` | Ascending | `a.lastRunMinutes - b.lastRunMinutes` — smallest elapsed time first (most recently run first) |

### `localeCompare` for name sort

`localeCompare` is used instead of the `<` / `>` operator to handle non-ASCII characters correctly and respect the user's locale collation order. For the current English-only agent names this makes no difference, but it future-proofs the sort for internationalized agent names.

### `lastRunMinutes` for recency sort

`lastRun` is a human-readable string (`'3m ago'`, `'just now'`, `'1d ago'`). It cannot be sorted directly. `lastRunMinutes` is the numeric companion field — minutes elapsed since the last run. Sorting ascending by this value puts the most recently run agents first (`0` = "just now" < `3` = "3m ago" < `1440` = "1d ago").

## Tests

`src/lib/sortAgents.test.ts` — 5 tests.

Test fixture: three agents — Charlie (50 runs/wk, 90% success, 30 min since last run), Alpha (300 runs/wk, 80% success, 5 min), Bravo (100 runs/wk, 99% success, 120 min).

| Test | Expected order | Why |
|---|---|---|
| `'runs'` | Alpha, Bravo, Charlie | 300 → 100 → 50 (descending) |
| `'success'` | Bravo, Charlie, Alpha | 99% → 90% → 80% (descending) |
| `'name'` | Alpha, Bravo, Charlie | A → B → C (ascending, localeCompare) |
| `'recent'` | Alpha, Charlie, Bravo | 5 min → 30 min → 120 min (ascending) |
| No mutation | Original array unchanged | `[...agents]` copy confirmed |

## Used by

`AgentGrid` composes `sortAgents` with `filterAgents` inside `useMemo`:

```ts
const visible = useMemo(
  () => sortAgents(filterAgents(agents, { query, category }), sort),
  [agents, query, category, sort],
)
```

`filterAgents` runs first, reducing the set; `sortAgents` then orders the result. The `useMemo` ensures neither function runs unless one of the four dependencies changes.
