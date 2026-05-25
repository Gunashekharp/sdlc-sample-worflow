---
title: useFetch
description: Reference for `src/lib/useFetch.ts`
---

**File:** `src/lib/useFetch.ts` · **Lines:** 47

<FILL: 2-4 sentence plain-language summary of what `lib/useFetch.ts` is responsible for, what other files it integrates with, and what calls into it.>

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `react` | `useCallback`, `useEffect`, `useState` | external |


## Symbols

This file exports 2 symbols. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| useFetch | hook | no |
| FetchState | interface | no |

## useFetch

**Kind:** `hook`

```ts
export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
): FetchState<T> { ... }
```

> Run an async fetcher on mount and expose loading/error/data state.
> The `fetcher` must be referentially stable (e.g. a module-level function),
> otherwise the effect re-runs every render.

### Parameters

| Name | Type | Default | Required | Purpose |
| --- | --- | --- | --- | --- |
| fetcher | `(signal: AbortSignal) => Promise<T>` | — | yes | <FILL: purpose of fetcher> |

**Returns:** `FetchState<T>`

<FILL: describe the return value of useFetch — what it represents, when it can be null/undefined, units.>

### Line-by-line walkthrough

Each top-level statement of `useFetch`, in execution order. The line numbers reference the source file as it appears today.

**Line 18 — `FirstStatement`**

```ts
const [data, setData] = useState<T | null>(null)
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 19 — `FirstStatement`**

```ts
const [loading, setLoading] = useState(true)
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 20 — `FirstStatement`**

```ts
const [error, setError] = useState<string | null>(null)
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 21 — `FirstStatement`**

```ts
const [nonce, setNonce] = useState(0)
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 23 — `FirstStatement`**

```ts
const reload = useCallback(() => setNonce((n) => n + 1), [])
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 25 — `ExpressionStatement`**

```ts
useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetcher(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setData(result)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Request failed')
        setLoading(false)
      })

    return () => controller.abort()
  }, [fetcher, nonce])
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

**Line 45 — `ReturnStatement`**

```ts
return { data, loading, error, reload }
```

<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>

### Examples

<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>

### Used by

- `src/components/PipelinesPanel.tsx`

## FetchState

**Kind:** `interface`

```ts
export interface FetchState<T> { ... }
```

<FILL: 2-4 sentences explaining what FetchState does and why it exists. Ground every claim in the signature and source.>

### Shape

| Name | Type | Description |
| --- | --- | --- |
| data | `T` | <FILL: data> |
| loading | `boolean` | <FILL: loading> |
| error | `string` | <FILL: error> |
| reload | `() => void` | <FILL: reload> |

## Diagrams

<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>

## Source

Full file source for `src/lib/useFetch.ts` (47 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (47 lines)</summary>

````ts
import { useCallback, useEffect, useState } from 'react'

export interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
  reload: () => void
}

/**
 * Run an async fetcher on mount and expose loading/error/data state.
 * The `fetcher` must be referentially stable (e.g. a module-level function),
 * otherwise the effect re-runs every render.
 */
export function useFetch<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
): FetchState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetcher(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setData(result)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Request failed')
        setLoading(false)
      })

    return () => controller.abort()
  }, [fetcher, nonce])

  return { data, loading, error, reload }
}

````

</details>
