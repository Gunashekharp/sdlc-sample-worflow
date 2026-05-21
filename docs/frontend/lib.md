# Library & hooks

`src/lib/` holds the non-UI logic: the typed API client, two React hooks, and
two pure helpers for filtering and sorting agents. The pure helpers are
deliberately side-effect free so they can be unit-tested without rendering.

## API client (`api.ts`)

A typed client for the backend. The base URL is read once at module load:

```ts
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
```

### Pipeline types

```ts
type PipelineStatus = 'passing' | 'failing' | 'running'

interface Pipeline {
  id: string
  name: string
  provider: 'github-actions' | 'jenkins'
  branch: string
  status: PipelineStatus
  durationSeconds: number
  triggeredBy: string
  updatedAt: string            // ISO 8601
}

interface PipelineSummary {
  total: number
  passing: number
  failing: number
  running: number
  passRate: number             // 0–100, over finished pipelines
}

interface PipelinesResponse {
  provider: string
  summary: PipelineSummary
  pipelines: Pipeline[]
}
```

These mirror the backend's [CI/CD types](../backend/cicd-integration.md).

### `fetchPipelines(signal?)`

```ts
async function fetchPipelines(signal?: AbortSignal): Promise<PipelinesResponse>
```

Issues `GET ${API_URL}/api/pipelines`, forwarding the optional `AbortSignal`.
Throws `Error("API responded {status}")` on a non-OK response; otherwise returns
the parsed `PipelinesResponse`. It is referentially stable (a module-level
function), which is exactly what [`useFetch`](#usefetch) requires.

## `useFetch` (`useFetch.ts`)

A small data-fetching hook that runs an async fetcher on mount and exposes
loading/error/data plus a manual reload.

```ts
interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
  reload: () => void
}

function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>): FetchState<T>
```

**Behaviour:**

- Starts with `loading: true`, `data: null`, `error: null`.
- On mount (and whenever `fetcher` or the internal `nonce` changes) it creates an
  `AbortController`, resets loading/error, and calls `fetcher(controller.signal)`.
- On success it stores `data` and clears loading **unless the signal was
  aborted** (the aborted check prevents setting state after unmount).
- On failure it stores `err.message` (or `"Request failed"`) and clears loading,
  again skipping aborted requests.
- The effect cleanup calls `controller.abort()`.
- `reload()` bumps an internal `nonce` (via `useCallback`, stable identity) to
  re-run the effect.

!!! warning "The fetcher must be referentially stable"
    The effect depends on `fetcher`. If you pass an inline arrow function it will
    be a new reference every render and the effect will re-run on every render.
    Pass a module-level function (like `fetchPipelines`) or memoize it.

## `usePersistentState` (`usePersistentState.ts`)

A `useState` variant that mirrors its value to `localStorage` and restores it on
the next mount.

```ts
function usePersistentState<T>(key: string, initial: T): [T, (value: T) => void]
```

- **Initial read** is lazy: it tries `localStorage.getItem(key)` and
  `JSON.parse`; on any failure (storage disabled, quota, malformed JSON) it falls
  back to `initial` instead of throwing.
- An effect writes `JSON.stringify(value)` back to `localStorage` whenever `key`
  or `value` changes. Write failures are swallowed — persistence is best-effort.

Used by [`AgentGrid`](components.md#agentgrid) for the
`snabbit.agentGrid.category` and `snabbit.agentGrid.sort` preferences.

!!! note "Tests reset storage between cases"
    `src/test/setup.ts` clears `localStorage` in an `afterEach`, so persisted UI
    state never leaks between tests.

## `filterAgents` (`filterAgents.ts`)

Pure category + free-text filter.

```ts
interface AgentFilter { query: string; category: string }
function filterAgents(agents: Agent[], filter: AgentFilter): Agent[]
```

- The query is trimmed and lower-cased once up front.
- **Category match:** `'All'` matches everything; `'Popular'` matches
  `agent.popular`; any other value must equal `agent.category` exactly.
- If the category does not match, the agent is dropped immediately.
- If the query is empty, a category match is enough.
- Otherwise the agent matches when the (lower-cased) query is a substring of its
  `name` **or** `description`.

It does not mutate the input (it returns the result of `Array.prototype.filter`).

## `sortAgents` (`sortAgents.ts`)

Pure, non-mutating sort. Also exports the `SORT_LABELS` map used to populate the
grid's sort `<select>`.

```ts
type SortKey = 'runs' | 'success' | 'name' | 'recent'

const SORT_LABELS: Record<SortKey, string> = {
  runs: 'Most runs',
  success: 'Success rate',
  name: 'Name (A–Z)',
  recent: 'Recently run',
}

function sortAgents(agents: Agent[], key: SortKey): Agent[]
```

It copies the array first (`[...agents]`) so the input is never mutated, then:

| Key       | Order                                              |
| --------- | -------------------------------------------------- |
| `runs`    | `runsPerWeek` descending                           |
| `success` | `successRate` descending                           |
| `name`    | `name` ascending via `localeCompare`               |
| `recent`  | `lastRunMinutes` ascending (most recent run first) |
