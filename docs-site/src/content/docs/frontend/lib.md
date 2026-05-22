---
title: Library — hooks & logic
---

`src/lib/` holds the frontend's non-visual logic: the typed API client, two
React hooks, and two pure list-transformation functions. Keeping this code out
of components makes it directly unit-testable.

## API client (`api.ts`)

A typed client for the backend. The base URL defaults to
`http://localhost:3001` and can be overridden at build time with `VITE_API_URL`:

```ts
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
```

### Types

- `PipelineStatus` — `'passing' | 'failing' | 'running'`.
- `Pipeline` — `id`, `name`, `provider` (`'github-actions' | 'jenkins'`),
  `branch`, `status`, `durationSeconds`, `triggeredBy`, `updatedAt`.
- `PipelineSummary` — `total`, `passing`, `failing`, `running`, `passRate`.
- `PipelinesResponse` — `provider`, `summary`, `pipelines`.

### `fetchPipelines(signal?)`

Fetches `GET /api/pipelines`, throws `Error("API responded <status>")` on a
non-OK response, and otherwise resolves to a `PipelinesResponse`. Accepts an
optional `AbortSignal` so callers can cancel the request.

## Hooks

### `useFetch(fetcher)`

Runs an async `fetcher` on mount and exposes `{ data, loading, error, reload }`.

- Aborts the in-flight request on unmount via an `AbortController`, and ignores
  results once the signal is aborted.
- `error` is the thrown error's message, or `'Request failed'` for non-`Error`
  throws.
- `reload()` bumps an internal nonce to re-run the fetcher.

:::caution
The `fetcher` must be **referentially stable** (e.g. a module-level function
like `fetchPipelines`). An inline arrow created each render would re-trigger
the effect on every render.
:::

### `usePersistentState(key, initial)`

A `useState` variant that mirrors its value to `localStorage` under `key` and
restores it on the next mount. Storage failures — disabled storage, quota
errors, malformed JSON — fall back to `initial` rather than throwing, and write
failures are silently ignored. Persistence is best-effort.

Used by `AgentGrid` for the `category` and `sort` selections.

## Pure list logic

### `filterAgents(agents, filter)` (`filterAgents.ts`)

Filters by category and a free-text query. The `AgentFilter` shape is
`{ query, category }`.

- `category` of `'All'` matches everything; `'Popular'` matches
  `agent.popular`; any other value is matched against `agent.category`.
- A non-empty `query` is trimmed and lowercased, then matched as a substring
  against the agent's name **or** description.

Pure and side-effect free.

### `sortAgents(agents, key)` (`sortAgents.ts`)

Returns a **new** sorted array (does not mutate the input). The `SortKey` union
and its menu labels (`SORT_LABELS`):

| Key       | Label          | Order                                  |
| --------- | -------------- | -------------------------------------- |
| `runs`    | Most runs      | `runsPerWeek` descending               |
| `success` | Success rate   | `successRate` descending               |
| `name`    | Name (A–Z)     | `name` via `localeCompare`             |
| `recent`  | Recently run   | `lastRunMinutes` ascending             |

`AgentGrid` composes the two: `sortAgents(filterAgents(agents, …), sort)`.
