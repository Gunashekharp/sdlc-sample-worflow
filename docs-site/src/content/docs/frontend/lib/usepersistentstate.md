---
title: usePersistentState
description: Reference for `src/lib/usePersistentState.ts`
---

**File:** `src/lib/usePersistentState.ts` · **Lines:** 31

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `lib/usePersistentState.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `react` | `useEffect`, `useState` | external |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| usePersistentState | hook | no |

## usePersistentState

**Kind:** `hook`

```ts
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (value: T) => void] { ... }
```

> Like useState, but the value is mirrored to localStorage under `key` and
> restored on the next mount. Storage failures (disabled storage, quota,
> malformed JSON) fall back to `initial` rather than throwing.

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| key | `string` | — | yes | <FILL: purpose of key> |
| initial | `T` | — | yes | <FILL: purpose of initial> |

**Returns:** `[T, (value: T) => void]`

<!-- fill:sym:usePersistentState:return -->
<FILL: describe the return value of usePersistentState — what it represents, when it can be null/undefined, units.>
<!-- /fill:sym:usePersistentState:return -->

### Line-by-line walkthrough

Each top-level statement of `usePersistentState`, in execution order. The line numbers reference the source file as it appears today.

**Line 12 — `FirstStatement`**

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

<!-- fill:sym:usePersistentState:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:usePersistentState:walk:0 -->

**Line 21 — `ExpressionStatement`**

```ts
useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore write failures — persistence is best-effort.
    }
  }, [key, value])
```

<!-- fill:sym:usePersistentState:walk:1 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:usePersistentState:walk:1 -->

**Line 29 — `ReturnStatement`**

```ts
return [value, setValue]
```

<!-- fill:sym:usePersistentState:walk:2 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:usePersistentState:walk:2 -->

### Examples

<!-- fill:sym:usePersistentState:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:usePersistentState:example -->

### Used by

- `src/components/AgentGrid.tsx`

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->

## Source

Full file source for `src/lib/usePersistentState.ts` (31 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (31 lines)</summary>

````ts
import { useEffect, useState } from 'react'

/**
 * Like useState, but the value is mirrored to localStorage under `key` and
 * restored on the next mount. Storage failures (disabled storage, quota,
 * malformed JSON) fall back to `initial` rather than throwing.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, (value: T) => void] {
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

````

</details>
