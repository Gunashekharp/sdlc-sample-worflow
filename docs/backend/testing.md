# Backend testing

The backend suite uses **Vitest** and **supertest**. Run it with
`cd server && npm test`. It needs no database and no network: routes are tested
against the in-memory store and the mock CI/CD provider.

## Suite at a glance

12 tests across 2 files:

| File                              | Tests | Focus                                          |
| --------------------------------- | ----: | ---------------------------------------------- |
| `server/src/__tests__/api.test.ts`  | 6   | HTTP behaviour of every route                  |
| `server/src/__tests__/cicd.test.ts` | 6   | `summarizePipelines`, provider selection, mock |

## API tests (`api.test.ts`)

A `testApp()` helper builds the app from the in-memory store and mock provider:

```ts
function testApp() {
  return createApp({
    store: createMemoryStore(SEED_AGENTS, SEED_KPIS),
    cicd: createMockCicdProvider(),
  })
}
```

supertest then drives each route:

- `GET /api/health` → `200`, body `status: 'ok'`.
- `GET /api/agents` → `200`, length equals `SEED_AGENTS.length`.
- `GET /api/agents/pr-reviewer` → `200`, `name === 'PR Reviewer'`.
- `GET /api/agents/does-not-exist` → `404` with an `error` field.
- `GET /api/kpis` → `200`, length equals `SEED_KPIS.length`.
- `GET /api/pipelines` → `200`, `provider === 'mock'`, a non-empty
  `pipelines` array, and `summary.total` equal to the pipeline count.

## CI/CD tests (`cicd.test.ts`)

Covers the pure and selection logic of the adapter, using a `pipe(status)`
fixture factory:

- **`summarizePipelines`** — counts each status; computes a 67% pass rate over
  finished pipelines (2 passing, 1 failing, 1 running); returns all-zero for an
  empty list.
- **`getCicdProvider`** — falls back to `'mock'` with no credentials; selects
  `'github-actions'` when both token and repo are present.
- **Mock provider** — `listPipelines()` returns a non-empty list where every
  pipeline has a truthy `id` and a status in
  `['passing', 'failing', 'running']`.

!!! note "The live GitHub provider is not hit"
    Tests only assert that `getCicdProvider` *selects* the GitHub provider by
    name; they never make a real network call. The mapping in
    `githubRunToPipeline` is not directly exercised by the suite.
