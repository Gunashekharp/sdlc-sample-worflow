---
title: Testing
description: Complete reference for all 49 Vitest tests across the frontend (37) and backend (12) packages.
---

Both packages use **Vitest**. The frontend adds **React Testing Library** and `@testing-library/user-event`; the backend adds **supertest** for HTTP-level assertions. Neither suite requires a database, a running server, or network access.

## Frontend

```bash
npm test            # run once (from repo root)
npm run test:watch  # watch mode
```

### Test environment configuration

Tests run in a `jsdom` environment with globals enabled. The relevant section of `vite.config.ts`:

```ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/test/setup.ts',
  css: true,
}
```

- `environment: 'jsdom'` — gives each test a simulated browser DOM.
- `globals: true` — makes `describe`, `it`, `expect`, `vi`, etc. available without imports.
- `setupFiles: './src/test/setup.ts'` — runs the setup module before each test file.
- `css: true` — enables CSS processing so Tailwind class assertions work.

### Setup file: `src/test/setup.ts`

```ts
import '@testing-library/jest-dom'
import { afterEach } from 'vitest'

// Keep tests isolated — persisted UI state must not leak between cases.
afterEach(() => {
  localStorage.clear()
})
```

The setup file does two things:

1. **Imports `@testing-library/jest-dom`** — this augments Vitest's `expect` with DOM-specific matchers such as `toBeInTheDocument()`, `toHaveAttribute()`, and `toHaveTextContent()`.
2. **Calls `localStorage.clear()` after every test** — `usePersistentState` writes the selected category tab and sort order to `localStorage`. Clearing it in `afterEach` prevents state from leaking between test cases and ensures each test starts from a clean slate.

### Test files — 37 tests total

| File | Tests | Covers |
|------|-------|--------|
| `src/App.test.tsx` | 4 | Top-level app rendering |
| `src/components/AgentGrid.test.tsx` | 7 | Filtering, sorting, selection, persistence |
| `src/components/PipelinesPanel.test.tsx` | 2 | Loading / error / data states |
| `src/components/Sparkline.test.tsx` | 3 | SVG rendering |
| `src/lib/filterAgents.test.ts` | 10 | `filterAgents` pure function |
| `src/lib/sortAgents.test.ts` | 5 | `sortAgents` pure function |
| `src/data/agents.test.ts` | 6 | Seed-data invariants |

### `App.test.tsx` — 4 tests

`<App />` is rendered with `global.fetch` stubbed via `vi.stubGlobal` to return an empty pipelines response, so `PipelinesPanel` does not make a real network call during these tests.

| Test | Asserts |
|------|---------|
| renders the featured agent | "Featured agent" eyebrow text and "PR Reviewer" name are in the document |
| renders the KPI strip | A region with an accessible name matching `/key metrics/i` is present |
| renders agents in the grid | Both "Deploy Bot" and "Alert Triage" appear in the document |
| renders the prompt input | An element with `aria-label="Prompt input"` is present |

### `AgentGrid.test.tsx` — 7 tests

All 7 tests render the full 12-agent `AGENTS` array. `userEvent.setup()` from `@testing-library/user-event` is used for all user interactions (clicking tabs, typing in the search input) to simulate real browser event sequences rather than firing synthetic events directly.

| Test | Asserts |
|------|---------|
| renders a card for every agent | All 12 agent names are present in the document |
| filters by search query | Typing "deploy" shows Deploy Bot and hides PR Reviewer |
| shows empty state | Typing "zzznotanagent" causes a "no agents match" message to appear |
| filters by category tab | Clicking the "Deploy" tab shows Deploy Bot and hides RCA Analyst |
| marks card as selected | Clicking a card flips its `aria-pressed` attribute from `false` to `true` |
| keeps agents after sort change | Changing the sort select leaves all 12 agents visible |
| remembers category across remounts | Selecting the "Deploy" tab, unmounting, then remounting the component shows "Deploy" still selected |

The persistence test (`remembers category across remounts`) exercises `usePersistentState` end-to-end: the value is written to `localStorage` on tab change and read back on mount. The `afterEach` `localStorage.clear()` in `setup.ts` ensures this state does not leak to subsequent tests.

### `PipelinesPanel.test.tsx` — 2 tests

`global.fetch` is stubbed per test with `vi.stubGlobal` and cleaned up in `afterEach` with `vi.unstubAllGlobals()`. This pattern replaces the global `fetch` function for the duration of a single test without affecting any other test.

| Test | Asserts |
|------|---------|
| renders pipelines from API | A resolved fetch with mock pipeline data causes "CI · build & test" and "E2E suite" to be visible |
| shows error on network failure | A rejected fetch (simulated network failure) causes text matching `/could not reach the api/i` to appear |

### `Sparkline.test.tsx` — 3 tests

| Test | Asserts |
|------|---------|
| one coordinate per value | A 4-point data series produces a `<polyline>` element with exactly 4 coordinate pairs |
| returns null for fewer than 2 points | A single-point series renders no `<polyline>` element |
| error color when not positive | When `positive={false}` the `<polyline>` `stroke` attribute contains `color-err` |

### `filterAgents.test.ts` — 10 tests

Tests use a three-agent fixture: PR Reviewer (category: Review, popular: true), Deploy Bot (category: Deploy, popular: true), RCA Analyst (category: Reliability, popular: false).

| Test | Asserts |
|------|---------|
| All + empty query | All 3 agents returned when category is `'All'` and query is `''` |
| Exact category match | Category `'Review'` returns only PR Reviewer |
| Popular filter | `popular: true` filter returns the 2 popular agents |
| Name match | Query `"deploy"` returns only Deploy Bot |
| Description match | Query `"root cause"` returns only RCA Analyst |
| Case-insensitive name | Query `"REVIEWER"` returns PR Reviewer |
| Whitespace trimming | Query `"  bot  "` (with surrounding spaces) returns Deploy Bot |
| Category and query combined | Category `'All'` + popular filter + query `"reviewer"` returns only PR Reviewer |
| No match | Query `"nonexistent"` returns an empty array `[]` |
| Input array not mutated | The source array is unchanged after calling `filterAgents` |

### `sortAgents.test.ts` — 5 tests

Tests use a three-agent fixture: Charlie (50 runs/week, 90% success, 30 min last run), Alpha (300 runs/week, 80% success, 5 min last run), Bravo (100 runs/week, 99% success, 120 min last run).

| Test | Sort key | Expected order | Sorted by |
|------|----------|----------------|-----------|
| sorts by runs | `'runs'` | Alpha → Bravo → Charlie | `runsPerWeek` descending |
| sorts by success rate | `'success'` | Bravo → Charlie → Alpha | `successRate` descending |
| sorts by name | `'name'` | Alpha → Bravo → Charlie | locale-aware A–Z |
| sorts by recency | `'recent'` | Alpha → Charlie → Bravo | `lastRunMinutes` ascending (smallest = most recent) |
| does not mutate input | any | Source array unchanged | `[...copy]` spread in implementation |

### `agents.test.ts` — 6 tests

Invariant checks against the live `AGENTS` export from `src/data/agents.ts`. These tests catch regressions introduced by editing the seed data.

| Test | Asserts |
|------|---------|
| at least one agent | `AGENTS.length > 0` |
| unique IDs | No two agents share the same `id` value |
| featured agent exists | `FEATURED_AGENT_ID` is the `id` of some agent in `AGENTS` |
| known categories | Every agent's `category` is a member of `AGENT_CATEGORIES` |
| success rates in range | Every agent's `successRate` is between 0 and 100 inclusive |
| non-empty name and description | Every agent's `name` and `description` are non-empty after `.trim()` |

## Backend

```bash
cd server
npm test
```

### Test environment configuration

Tests run in a Node environment. `server/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

- `environment: 'node'` — no DOM globals; the backend never needs them.
- `include: ['src/**/*.test.ts']` — explicit glob so the server config does not accidentally pick up frontend test files.

This config is kept separate from the root `vite.config.ts` so the server suite does not inherit the frontend's `jsdom` environment or `setupFiles`.

### How each test builds the app

Every test (or test file) calls a `testApp()` helper that constructs a fresh Express application with injected test doubles:

```ts
createApp({
  store: createMemoryStore(SEED_AGENTS, SEED_KPIS),
  cicd: createMockCicdProvider(),
})
```

This means every test runs against a clean in-memory store seeded with `SEED_AGENTS` and `SEED_KPIS`. No database connection is established; no HTTP calls leave the process.

### Test files — 12 tests total

| File | Tests | Covers |
|------|-------|--------|
| `src/__tests__/api.test.ts` | 6 | REST endpoints via supertest |
| `src/__tests__/cicd.test.ts` | 6 | `summarizePipelines`, provider selection, mock data |

### `api.test.ts` — 6 tests

Uses `supertest` to make real HTTP requests against a `testApp()` instance without binding to a port. Each assertion checks both the HTTP status code and the response body.

| Test | HTTP call | Asserts |
|------|-----------|---------|
| `GET /api/health` returns 200 | `GET /api/health` | Status 200, `body.status === 'ok'` |
| `GET /api/agents` returns all agents | `GET /api/agents` | Status 200, `body.length === SEED_AGENTS.length` |
| `GET /api/agents/:id` returns the agent | `GET /api/agents/pr-reviewer` | Status 200, `body.name === 'PR Reviewer'` |
| `GET /api/agents/:id` returns 404 for unknown | `GET /api/agents/does-not-exist` | Status 404, `body.error` is defined |
| `GET /api/kpis` returns all KPIs | `GET /api/kpis` | Status 200, `body.length === SEED_KPIS.length` |
| `GET /api/pipelines` returns mock data | `GET /api/pipelines` | Status 200, `body.provider === 'mock'`, summary totals match pipeline list |

### `cicd.test.ts` — 6 tests

Split into three logical groups testing the `summarizePipelines` helper, the `getCicdProvider` factory, and the mock provider's output shape.

**`summarizePipelines` — 3 tests:**

| Test | Input | Asserts |
|------|-------|---------|
| counts each status | 2 passing + 1 failing + 1 running pipelines | `{ total: 4, passing: 2, failing: 1, running: 1 }` |
| pass rate over finished only | 2 passing + 1 failing (3 finished, 1 running) | `passRate: 67` (2/3 = 66.7 → rounded to 67) |
| empty list | `[]` | All counts and `passRate` are zero |

**`getCicdProvider` — 2 tests:**

| Test | Environment | Asserts |
|------|-------------|---------|
| returns mock when no credentials | `GITHUB_TOKEN` and `GITHUB_REPO` both absent | `provider.name === 'mock'` |
| returns GitHub provider when credentials set | Both `GITHUB_TOKEN` and `GITHUB_REPO` present | `provider.name === 'github-actions'` |

**Mock CI/CD provider — 1 test:**

| Test | Asserts |
|------|---------|
| well-formed pipeline list | `listPipelines()` returns a non-empty array; every entry has a truthy `id`, a `status` drawn from the known set (`'passing'`, `'failing'`, `'running'`, `'queued'`), and other required fields |
