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
| <PipelinesPanel /> | renders pipelines returned by the API | After the fetch resolves, the returned pipelines appear as rows. |
| <PipelinesPanel /> | shows an error state when the API is unreachable | A failed request renders the error message prompting to check the server on port 3001. |

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

## Source

Full file source for `src/components/PipelinesPanel.tsx` (93 lines). The line-by-line walkthroughs above reference these line numbers.

<details>
<summary>View source (93 lines)</summary>

````tsx
import { fetchPipelines } from '../lib/api'
import type { Pipeline } from '../lib/api'
import { useFetch } from '../lib/useFetch'

const STATUS_STYLES: Record<Pipeline['status'], { dot: string; label: string }> = {
  passing: { dot: 'bg-ok', label: 'Passing' },
  failing: { dot: 'bg-err', label: 'Failing' },
  running: { dot: 'bg-accent', label: 'Running' },
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`
}

function PanelMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3.5 py-10 text-center text-sm text-text-faint">{children}</p>
  )
}

function PipelineRow({ pipeline }: { pipeline: Pipeline }) {
  const style = STATUS_STYLES[pipeline.status]
  return (
    <li className="flex items-center gap-3 px-3.5 py-2.5">
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`}
        title={style.label}
      />
      <span className="truncate text-sm font-medium">{pipeline.name}</span>
      <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[11px] text-text-muted">
        {pipeline.branch}
      </span>
      <span className="ml-auto shrink-0 font-mono text-[11px] text-text-faint">
        {formatDuration(pipeline.durationSeconds)}
      </span>
      <span className="hidden shrink-0 text-xs text-text-faint sm:inline">
        {pipeline.triggeredBy}
      </span>
    </li>
  )
}

/** Live CI/CD pipeline panel — data comes from the backend API. */
export default function PipelinesPanel() {
  const { data, loading, error, reload } = useFetch(fetchPipelines)

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
}

````

</details>
