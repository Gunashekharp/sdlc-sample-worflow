---
title: PipelinesPanel
description: Reference for `src/components/PipelinesPanel.tsx`
---

**File:** `src/components/PipelinesPanel.tsx` · **Lines:** 93

<!-- fill:file:summary -->
`PipelinesPanel.tsx` is the live CI/CD pipelines widget, fetching pipeline data from the backend and rendering it as a list with loading, error, and empty states plus a refresh button. It calls `fetchPipelines` (and uses the `Pipeline` type) from `../lib/api`, driving the request through the `useFetch` hook from `../lib/useFetch`. Local helpers (`STATUS_STYLES`, `formatDuration`, `PanelMessage`, `PipelineRow`) handle per-row presentation. It is mounted by `App.tsx` and tested in `PipelinesPanel.test.tsx`.
<!-- /fill:file:summary -->

## Imports

This file pulls in the following modules. Relative imports point to other documented files; external imports are libraries from `node_modules`.

| Module | Imports | Kind |
| --- | --- | --- |
| `../lib/api` | `fetchPipelines` | internal |
| `../lib/api` | `Pipeline` | type-only · internal |
| `../lib/useFetch` | `useFetch` | internal |


## Symbols

This file exports 1 symbol. Every export is documented below, in declaration order.

| Name | Kind | Default |
| --- | --- | --- |
| PipelinesPanel | component | yes |

## PipelinesPanel (default export)

**Kind:** `component`

```ts
export default function PipelinesPanel() { ... }
```

> Live CI/CD pipeline panel — data comes from the backend API.

### Line-by-line walkthrough

Each top-level statement of `PipelinesPanel`, in execution order. The line numbers reference the source file as it appears today.

**Line 47 — `FirstStatement`**

```ts
const { data, loading, error, reload } = useFetch(fetchPipelines)
```

<!-- fill:sym:PipelinesPanel:walk:0 -->
Destructures `{ data, loading, error, reload }` from `useFetch(fetchPipelines)`. The hook invokes the async `fetchPipelines` request (typically on mount), exposing the resolved payload as `data`, the in-flight flag as `loading`, any failure message as `error`, and a `reload` callback to re-run the request. Centralizing the async lifecycle in `useFetch` keeps this component free of manual `useEffect`/state plumbing.
<!-- /fill:sym:PipelinesPanel:walk:0 -->

**Line 49 — `ReturnStatement`**

```ts
return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <h2 className="text-sm font-semibold">CI/CD pipelines</h2>
        {data && (
          <span className="text-xs text-text-faint">
            {data.summary.passRate}% pass rate · {data.summary.running} running ·{' '}
            {data.provider}
          </span>
        )}
        <button
          type="button"
          onClick={reload}
          className="ml-auto rounded-md border border-border px-2 py-1 text-xs text-text-muted hover:border-border-strong hover:text-text"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-lg border border-border bg-surface">
        {loading && <PanelMessage>Loading pipelines…</PanelMessage>}

        {error && !loading && (
          <PanelMessage>
            Could not reach the API ({error}). Is the server running on port
            3001?
          </PanelMessage>
        )}

        {data && !loading && !error && data.pipelines.length === 0 && (
          <PanelMessage>No recent pipeline runs.</PanelMessage>
        )}

        {data && !loading && !error && data.pipelines.length > 0 && (
          <ul className="divide-y divide-border">
            {data.pipelines.map((pipeline) => (
              <PipelineRow key={pipeline.id} pipeline={pipeline} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
```

<!-- fill:sym:PipelinesPanel:walk:1 -->
Returns the panel. The header shows the "CI/CD pipelines" title; when `data` is present it appends a summary line (`data.summary.passRate`% pass rate, `data.summary.running` running, and `data.provider`), and a right-aligned "Refresh" button wires `onClick` to `reload`. The body is a sequence of mutually exclusive conditionals: `loading` shows a "Loading pipelines…" `PanelMessage`; `error && !loading` shows a reachability message interpolating `error`; `data && !loading && !error && data.pipelines.length === 0` shows "No recent pipeline runs."; and the success branch (`data.pipelines.length > 0`) renders a `<ul>` mapping each pipeline to a `PipelineRow`. The guard chain ensures exactly one state renders at a time.
<!-- /fill:sym:PipelinesPanel:walk:1 -->

### Examples

<!-- fill:sym:PipelinesPanel:example -->
```tsx
import PipelinesPanel from './components/PipelinesPanel'

// Takes no props — it fetches its own data via useFetch(fetchPipelines).
<PipelinesPanel />
```

On mount it shows "Loading pipelines…", then either lists the pipelines returned by the API (test "renders pipelines returned by the API") or, if the request fails, the error message asking whether the server is running on port 3001 (test "shows an error state when the API is unreachable").
<!-- /fill:sym:PipelinesPanel:example -->

### Used by

- `src/App.tsx`
- `src/components/PipelinesPanel.test.tsx`

## Tests

| Suite | Test | Asserts |
| --- | --- | --- |
| <PipelinesPanel /> | renders pipelines returned by the API | With `fetch` stubbed to resolve, both pipeline names ("CI · build & test", "E2E suite") appear in the document. |
| <PipelinesPanel /> | shows an error state when the API is unreachable | With `fetch` stubbed to reject, the "could not reach the API" message is rendered. |

## Diagrams

<!-- fill:file:diagrams -->
```mermaid
flowchart TD
  M[useFetch fetchPipelines] --> S{state}
  S -->|loading| L[Loading pipelines…]
  S -->|error and not loading| E[API unreachable message]
  S -->|data, no error, 0 pipelines| Z[No recent pipeline runs]
  S -->|data, no error, >0 pipelines| R[render PipelineRow list]
  R -.-> RF[Refresh button → reload]
  RF --> M
```
<!-- /fill:file:diagrams -->
