---
title: api.ts
description: Typed HTTP client for the backend REST API.
---

**File:** `src/lib/api.ts`

The typed client for the Snabbit Agent Console backend. Currently exports types
and one fetch function for the pipelines endpoint.

## Configuration

```ts
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
```

The base URL is read from the Vite environment at build time. Vite exposes
`import.meta.env.VITE_*` variables during development (from `.env` files) and
replaces them at build time. If `VITE_API_URL` is not set, the client targets
`http://localhost:3001` (the backend's default port).

## Types

### `PipelineStatus`

```ts
export type PipelineStatus = 'passing' | 'failing' | 'running'
```

The three possible states for a CI/CD pipeline run.

### `Pipeline`

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

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique run ID (e.g. `'p-1041'` for mock, numeric string for GitHub) |
| `name` | `string` | Workflow or pipeline display name |
| `provider` | `'github-actions' \| 'jenkins'` | Source CI/CD system |
| `branch` | `string` | Git branch the run was triggered on |
| `status` | `PipelineStatus` | Current run status |
| `durationSeconds` | `number` | Elapsed or final run duration in seconds |
| `triggeredBy` | `string` | Actor who triggered the run (username or system name) |
| `updatedAt` | `string` | ISO 8601 timestamp of the last status update |

This type mirrors `Pipeline` in `server/src/integrations/cicd.ts`. The two are
kept in sync by hand — there is no shared package.

### `PipelineSummary`

```ts
export interface PipelineSummary {
  total: number
  passing: number
  failing: number
  running: number
  passRate: number
}
```

Aggregate counts returned alongside the pipeline list. `passRate` is 0–100
computed over finished (passing + failing) pipelines only.

### `PipelinesResponse`

```ts
export interface PipelinesResponse {
  provider: string
  summary: PipelineSummary
  pipelines: Pipeline[]
}
```

The complete shape returned by `GET /api/pipelines`. `provider` is the active
provider's name string (`'mock'` or `'github-actions'`).

## `fetchPipelines`

```ts
export async function fetchPipelines(
  signal?: AbortSignal,
): Promise<PipelinesResponse>
```

**Parameters:**

| Param | Type | Purpose |
|-------|------|---------|
| `signal` | `AbortSignal?` | Optional abort signal. Passed to `fetch()` so the request can be cancelled (e.g. on component unmount via `useFetch`). |

**Returns:** `Promise<PipelinesResponse>` — resolves to the parsed JSON response.

**Throws:** `Error("API responded <status>")` if the HTTP response status is
not in the 2xx range.

**Implementation:**

```ts
const res = await fetch(`${API_URL}/api/pipelines`, { signal })
if (!res.ok) {
  throw new Error(`API responded ${res.status}`)
}
return res.json() as Promise<PipelinesResponse>
```

The function is a module-level named export (not an arrow function inside a
component). This is intentional — `useFetch` requires a **referentially stable**
fetcher to avoid re-triggering the effect on every render, and module-level
functions are always stable.

## Used by

- `PipelinesPanel` — passes `fetchPipelines` to `useFetch`:
  ```ts
  const { data, loading, error, reload } = useFetch(fetchPipelines)
  ```
