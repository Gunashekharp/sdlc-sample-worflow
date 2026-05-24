---
title: api.ts — API client
---

**File:** `src/lib/api.ts`

The typed HTTP client for the Snabbit Agent Console backend. Exports four TypeScript types and one async fetch function. Currently covers a single endpoint: `GET /api/pipelines`.

## `API_URL` constant

```ts
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
```

The base URL for all API calls. Resolved at module load time (before any function is called):

- **At build time:** Vite replaces `import.meta.env.VITE_API_URL` with its literal value, or with `undefined` if the variable is not set.
- **Fallback:** The `?? 'http://localhost:3001'` provides the local development default when the variable is absent.
- **Override:** Set `VITE_API_URL` in `.env.local` (for development) or `.env.production` (for production builds).

See [vite-env.d.ts](../vite-env) for the TypeScript declaration that types this variable.

## `PipelineStatus` type

```ts
export type PipelineStatus = 'passing' | 'failing' | 'running'
```

The three possible states for a CI/CD pipeline run:

| Value | Meaning |
|---|---|
| `'passing'` | The run completed successfully |
| `'failing'` | The run completed with failures |
| `'running'` | The run is currently in progress |

## `Pipeline` interface

```ts
export interface Pipeline {
  id: string
  name: string
  provider: 'github-actions' | 'jenkins'
  branch: string
  status: PipelineStatus
  durationSeconds: number
  triggeredBy: string
  updatedAt: string
}
```

Represents a single CI/CD pipeline run returned by the backend.

| Field | Type | Purpose |
|---|---|---|
| `id` | `string` | Unique run identifier. For the mock provider this is a string like `'p-1041'`; for GitHub Actions this is the numeric run ID as a string. |
| `name` | `string` | Workflow or pipeline display name (e.g. `'CI'`, `'Deploy to Production'`). |
| `provider` | `'github-actions' \| 'jenkins'` | The CI/CD system that produced this run. Determines the icon and link format in `PipelineRow`. |
| `branch` | `string` | The git branch the run was triggered on (e.g. `'main'`, `'feat/my-feature'`). |
| `status` | `PipelineStatus` | Current run status. Drives the status indicator color in `PipelineRow`. |
| `durationSeconds` | `number` | Elapsed (for running) or final (for passing/failing) duration in seconds. |
| `triggeredBy` | `string` | The actor that triggered the run — a GitHub username, a Jenkins user, or `'scheduler'` for automated triggers. |
| `updatedAt` | `string` | ISO 8601 timestamp of the most recent status update (e.g. `'2025-05-24T10:30:00Z'`). |

:::note
`Pipeline` mirrors the `Pipeline` type in `server/src/integrations/cicd.ts`. The two are kept in sync by hand — there is no shared package or code generation.
:::

## `PipelineSummary` interface

```ts
export interface PipelineSummary {
  total: number
  passing: number
  failing: number
  running: number
  passRate: number
}
```

Aggregate counts returned alongside the individual pipeline list. Rendered in `PipelinesPanel` as summary badges above the pipeline rows.

| Field | Type | Purpose |
|---|---|---|
| `total` | `number` | Total number of pipeline runs in the response |
| `passing` | `number` | Count of runs with status `'passing'` |
| `failing` | `number` | Count of runs with status `'failing'` |
| `running` | `number` | Count of runs currently in progress |
| `passRate` | `number` | Percentage of finished (passing + failing) runs that passed, 0–100. Runs with status `'running'` are excluded from this calculation. |

## `PipelinesResponse` interface

```ts
export interface PipelinesResponse {
  provider: string
  summary: PipelineSummary
  pipelines: Pipeline[]
}
```

The complete JSON shape returned by `GET /api/pipelines`.

| Field | Type | Purpose |
|---|---|---|
| `provider` | `string` | The active provider's name (`'mock'`, `'github-actions'`, `'jenkins'`). Shown as a badge in `PipelinesPanel`. |
| `summary` | `PipelineSummary` | Aggregate counts for the strip of summary badges. |
| `pipelines` | `Pipeline[]` | The individual pipeline run records, ordered by `updatedAt` descending. |

## `fetchPipelines` function

```ts
export async function fetchPipelines(
  signal?: AbortSignal,
): Promise<PipelinesResponse>
```

Fetches the pipelines endpoint and returns the parsed response.

### Parameters

| Parameter | Type | Required | Purpose |
|---|---|---|---|
| `signal` | `AbortSignal` | No | An abort signal from an `AbortController`. When the signal fires, the underlying `fetch()` call is cancelled. This is the integration point with `useFetch`, which creates a controller per effect run and aborts it on cleanup. |

### Returns

`Promise<PipelinesResponse>` — resolves to the parsed JSON body when the request succeeds.

### Throws

`Error("API responded <status>")` — thrown when the HTTP response status is not in the 2xx range (i.e. `res.ok` is `false`). The error message includes the numeric status code. `useFetch` catches this and stores the message in its `error` state.

### Implementation

```ts
export async function fetchPipelines(signal?: AbortSignal): Promise<PipelinesResponse> {
  const res = await fetch(`${API_URL}/api/pipelines`, { signal })
  if (!res.ok) throw new Error(`API responded ${res.status}`)
  return res.json() as Promise<PipelinesResponse>
}
```

The function is exported as a **named module-level function** (not an inline arrow or a closure). This is intentional: `useFetch` includes the `fetcher` argument in its `useEffect` dependency array. A module-level function is referentially stable — its identity never changes between renders — so the effect does not re-trigger on every render.

If `fetchPipelines` were defined inline inside `PipelinesPanel` (e.g. `const fetcher = (s) => fetch(...)`) it would be a new function reference on every render, causing `useFetch`'s effect to run on every render and producing an infinite request loop.

### Signal and AbortController

The `signal` parameter threads through to `fetch(url, { signal })`. When `useFetch` cleans up its effect (on unmount or before re-running due to `reload()`), it calls `controller.abort()`. This fires the signal, which cancels the in-flight `fetch()` call. The browser then rejects the fetch promise with an `AbortError`, which is caught by `useFetch`'s `.catch()` handler. The `controller.signal.aborted` guard inside the handler silently discards the error.

## Used by

`PipelinesPanel` — the only consumer:

```ts
const { data, loading, error, reload } = useFetch(fetchPipelines)
```

`fetchPipelines` is passed by reference (without calling it) so `useFetch` controls when and how it is invoked.
