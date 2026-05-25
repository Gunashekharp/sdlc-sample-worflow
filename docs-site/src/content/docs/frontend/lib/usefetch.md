---
title: useFetch
description: Reference for `src/lib/useFetch.ts`
---

**File:** `src/lib/useFetch.ts` · **Lines:** 47

<!-- fill:file:summary -->
<FILL: 2-4 sentence plain-language summary of what `lib/useFetch.ts` is responsible for, what other files it integrates with, and what calls into it.>
<!-- /fill:file:summary -->

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

<!-- fill:sym:useFetch:return -->
<FILL: describe the return value of useFetch — what it represents, when it can be null/undefined, units.>
<!-- /fill:sym:useFetch:return -->

### Line-by-line walkthrough

Each top-level statement of `useFetch`, in execution order. The line numbers reference the source file as it appears today.

**Line 18 — `FirstStatement`**

```ts
const [data, setData] = useState<T | null>(null)
```

<!-- fill:sym:useFetch:walk:0 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:useFetch:walk:0 -->

**Line 19 — `FirstStatement`**

```ts
const [loading, setLoading] = useState(true)
```

<!-- fill:sym:useFetch:walk:1 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:useFetch:walk:1 -->

**Line 20 — `FirstStatement`**

```ts
const [error, setError] = useState<string | null>(null)
```

<!-- fill:sym:useFetch:walk:2 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:useFetch:walk:2 -->

**Line 21 — `FirstStatement`**

```ts
const [nonce, setNonce] = useState(0)
```

<!-- fill:sym:useFetch:walk:3 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:useFetch:walk:3 -->

**Line 23 — `FirstStatement`**

```ts
const reload = useCallback(() => setNonce((n) => n + 1), [])
```

<!-- fill:sym:useFetch:walk:4 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:useFetch:walk:4 -->

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

<!-- fill:sym:useFetch:walk:5 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:useFetch:walk:5 -->

**Line 45 — `ReturnStatement`**

```ts
return { data, loading, error, reload }
```

<!-- fill:sym:useFetch:walk:6 -->
<FILL: explain what this statement does. Reference variables, side effects, and why this exact construct was chosen.>
<!-- /fill:sym:useFetch:walk:6 -->

### Examples

<!-- fill:sym:useFetch:example -->
<FILL: at least one concrete input → output example. For components, a JSX usage snippet. For functions, an input + return value. Pull from tests when available so the example is real.>
<!-- /fill:sym:useFetch:example -->

### Used by

- `src/components/PipelinesPanel.tsx`

## FetchState

**Kind:** `interface`

```ts
export interface FetchState<T> { ... }
```

<!-- fill:sym:FetchState:summary -->
<FILL: 2-4 sentences explaining what FetchState does and why it exists. Ground every claim in the signature and source.>
<!-- /fill:sym:FetchState:summary -->

### Shape

| Name | Type | Description |
| --- | --- | --- |
| data | `T` | <FILL: data> |
| loading | `boolean` | <FILL: loading> |
| error | `string` | <FILL: error> |
| reload | `() => void` | <FILL: reload> |

## Diagrams

<!-- fill:file:diagrams -->
<FILL: if this file has non-trivial control flow, async sequences, or state transitions, include a Mermaid diagram here. Use `flowchart`, `sequenceDiagram`, or `stateDiagram-v2`. Skip this section entirely — do not write "no diagram" — if the file is trivial.>
<!-- /fill:file:diagrams -->
