---
title: usePersistentState hook
---

**File:** `src/lib/usePersistentState.ts`

A drop-in replacement for `useState` that persists its value to `localStorage` and restores it on the next mount. Storage failures at both read and write time are silently swallowed — persistence is best-effort.

## Hook signature

```ts
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (value: T) => void]
```

### Type parameter

`T` — the state value type. Must be JSON-serializable (i.e. round-trips correctly through `JSON.stringify` / `JSON.parse`). `string` and `number` work perfectly. `Date`, `undefined` values inside objects, and `function` values do not round-trip.

### Parameters

| Parameter | Type | Purpose |
|---|---|---|
| `key` | `string` | The `localStorage` key under which the value is stored. Should be globally unique across the application to prevent collisions. The convention in this codebase is `'snabbit.<component>.<field>'`. |
| `initial` | `T` | The default value used when no stored value is found, when the stored value cannot be parsed, or when storage is unavailable. |

### Returns

A tuple `[value, setValue]` with the same shape as `useState`'s return value. The setter takes a new value directly — it does not accept a function updater.

## Full implementation

```ts
export function usePersistentState<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore write failures — persistence is best-effort.
    }
  }, [key, value])

  return [value, setValue]
}
```

## Lazy initializer (read from `localStorage` on first render)

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

The initializer is passed as a **function** to `useState`. React calls this function exactly once — on the first render — and ignores it on subsequent renders. This matters because `localStorage.getItem` is a synchronous DOM operation; running it on every render would be wasteful.

### Read failure modes caught by `try/catch`

| Scenario | Why it throws | Result |
|---|---|---|
| `localStorage` is disabled | Private browsing modes in some browsers throw `SecurityError` on `localStorage` access | Falls back to `initial` |
| Storage quota exceeded | Some browsers throw when the storage is full, even on read (rare) | Falls back to `initial` |
| Malformed JSON | A previous write produced a non-JSON string (bug, manual editing) — `JSON.parse` throws `SyntaxError` | Falls back to `initial` |

The `raw !== null` check before `JSON.parse` handles the case where the key has never been written (returns `null` from `getItem`) — in that case `initial` is returned without attempting a parse.

## Sync effect (write to `localStorage` on value change)

```ts
useEffect(() => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore write failures — persistence is best-effort.
  }
}, [key, value])
```

Runs after every render where `key` or `value` has changed. `JSON.stringify(value)` serializes the current state and writes it to `localStorage` under `key`.

### Write failure modes silently ignored

| Scenario | Why it throws | Behavior |
|---|---|---|
| Storage quota exceeded | Browser's `localStorage` is full | Write is silently skipped; in-memory state is unaffected |
| Private browsing (write-blocked) | Some browsers allow `getItem` but throw on `setItem` in private mode | Write is silently skipped |
| `localStorage` disabled | `SecurityError` on access | Write is silently skipped |

The comment in the source — `// Ignore write failures — persistence is best-effort.` — is intentional documentation: callers should not assume the value was successfully persisted.

### Dependency on `key`

The effect depends on both `key` and `value`. If `key` changes between renders (which cannot happen in practice because all call sites use string literals), the new key is written but the old key is not deleted. This is not a concern given current usage.

## `localStorage` keys used by the application

| Key | `T` | Default | Used in |
|---|---|---|---|
| `snabbit.agentGrid.category` | `string` | `'All'` | `AgentGrid` — the active category tab |
| `snabbit.agentGrid.sort` | `SortKey` | `'runs'` | `AgentGrid` — the active sort order |

## AgentGrid usage

```ts
// AgentGrid.tsx
const [category, setCategory] = usePersistentState<string>(
  'snabbit.agentGrid.category',
  'All',
)
const [sort, setSort] = usePersistentState<SortKey>(
  'snabbit.agentGrid.sort',
  'runs',
)
```

When a user clicks a category tab or changes the sort select, `setCategory` / `setSort` updates the in-memory state (triggering a re-render immediately) and the `useEffect` writes the new value to `localStorage`. On the next page load, the lazy initializer reads the stored value and the grid starts in the user's last-used state.

## Test isolation

`src/test/setup.ts` calls `localStorage.clear()` in an `afterEach` hook to prevent state leakage between test cases. Without this, a test that writes `'Deploy'` to `'snabbit.agentGrid.category'` would cause the next test's `AgentGrid` to mount in the `'Deploy'` category instead of `'All'`, producing flaky, order-dependent failures.

`AgentGrid.test.tsx` explicitly tests persistence:

```ts
it('remembers the selected category across remounts', async () => {
  await user.click(screen.getByRole('button', { name: 'Deploy' }))
  first.unmount()
  render(<AgentGrid agents={AGENTS} />)
  expect(
    screen.getByRole('button', { name: 'Deploy' })
  ).toHaveAttribute('aria-pressed', 'true')
})
```

This test mounts the grid, clicks "Deploy", unmounts, remounts, and asserts the "Deploy" tab is still selected — verifying that `usePersistentState` correctly restored the stored value.
