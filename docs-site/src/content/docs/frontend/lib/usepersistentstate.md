---
title: usePersistentState
description: localStorage-backed useState hook.
---

**File:** `src/lib/usePersistentState.ts`

A drop-in replacement for `useState` that mirrors its value to `localStorage`
and restores it on the next mount. Storage failures are silently swallowed —
persistence is best-effort.

## Hook

```ts
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (value: T) => void]
```

**Type parameter:** `T` — the state value type. Must be JSON-serializable.

**Parameters:**

| Param | Type | Purpose |
|-------|------|---------|
| `key` | `string` | `localStorage` key. Should be unique per usage to prevent cross-component collisions. The convention in this codebase is `'snabbit.<component>.<field>'`. |
| `initial` | `T` | Default value used when no stored value exists or when the stored value cannot be parsed. |

**Returns:** A tuple `[value, setValue]` identical in shape to `useState`'s
return. The setter does not accept a function updater — it only accepts a new
value directly.

## Implementation

### Initial value (lazy initializer)

```ts
const [value, setValue] = useState<T>(() => {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? (JSON.parse(raw) as T) : initial
  } catch {
    return initial
  }
})
```

The state is initialized with a **lazy initializer function** passed to
`useState`. React calls this function only on the first render, not on
subsequent renders — this matters because `localStorage.getItem` is a
synchronous DOM operation that should not run on every render.

Two failure modes are caught and fall back to `initial`:
- `localStorage` is not available (private browsing, storage quota exceeded,
  or disabled) — the `getItem` throws.
- The stored value is malformed JSON — `JSON.parse` throws.

### Sync effect

```ts
useEffect(() => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore write failures — persistence is best-effort.
  }
}, [key, value])
```

Runs after every render where `key` or `value` changed. Serializes `value` to
JSON and writes it. Write failures are silently ignored (e.g. storage quota
exceeded, private browsing that allows reads but not writes).

:::caution
The effect depends on `key`. If `key` changes between renders, the new key
will be written but the old key will not be deleted. In practice `key` is
always a string literal at the call site, so this cannot happen.
:::

## Serialization contract

`T` must be JSON-serializable. The hook uses `JSON.stringify` to write and
`JSON.parse` to read. Types with `undefined` values, `Date` objects, or
functions will not round-trip correctly — but `string` (used for `category` and
`sort`) serializes perfectly.

## Used by

`AgentGrid` with two keys:

```ts
const [category, setCategory] = usePersistentState<string>(
  'snabbit.agentGrid.category', 'All',
)
const [sort, setSort] = usePersistentState<SortKey>(
  'snabbit.agentGrid.sort', 'runs',
)
```

## Tests

The test setup (`src/test/setup.ts`) calls `localStorage.clear()` after each
test case to prevent state leakage between tests. `AgentGrid.test.tsx` has a
test that explicitly verifies persistence:

```
it('remembers the selected category across remounts')
```

The test mounts the grid, clicks the "Deploy" tab, unmounts, remounts, and
asserts that the "Deploy" tab still has `aria-pressed="true"`.
