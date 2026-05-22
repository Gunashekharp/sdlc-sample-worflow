---
title: Testing
---

Both packages use **Vitest**. The frontend adds **React Testing Library**; the
backend adds **supertest** for HTTP-level assertions.

## Frontend

From the repository root:

```bash
npm test            # run once
npm run test:watch  # watch mode
```

Tests run in a `jsdom` environment with globals enabled (`vite.config.ts`). The
setup file `src/test/setup.ts` imports `@testing-library/jest-dom` and calls
`localStorage.clear()` after every test so persisted UI state from
`usePersistentState` cannot leak between cases.

### Test files

| File | Tests | Covers |
| ---------------------------------------- | ----- | ------------------------------------ |
| `src/App.test.tsx` | 4 | Top-level app rendering |
| `src/components/AgentGrid.test.tsx` | 7 | Filtering, sorting, selection, persistence |
| `src/components/PipelinesPanel.test.tsx` | 2 | Loading / error / data states |
| `src/components/Sparkline.test.tsx` | 3 | Sparkline rendering |
| `src/lib/filterAgents.test.ts` | 10 | `filterAgents` logic |
| `src/lib/sortAgents.test.ts` | 5 | `sortAgents` logic |
| `src/data/agents.test.ts` | 6 | Seed-data invariants |

**Total: 37 tests**

### `App.test.tsx`

`<App />` is rendered with `global.fetch` stubbed to return an empty pipelines
response so `PipelinesPanel` does not make a real network call. The stub is
installed with `vi.stubGlobal` and torn down after each test.

| Test | Asserts |
| ------------------------------ | ---------------------------------------------------------- |
| renders the featured agent | Finds the "Featured agent" eyebrow and "PR Reviewer" name |
| renders the KPI strip | Finds a region with accessible name matching `/key metrics/i` |
| renders agents in the grid | Finds "Deploy Bot" and "Alert Triage" in the document |
| renders the prompt input | Finds an element with `aria-label="Prompt input"` |

### `AgentGrid.test.tsx`

All tests render the full 12-agent `AGENTS` array. `userEvent.setup()` is used
for user interactions.

| Test | Asserts |
| -------------------------------------------- | -------------------------------------------------- |
| renders a card for every agent | All 12 agent names are present in the document |
| filters agents by the search query | Typing "deploy" → Deploy Bot visible, PR Reviewer hidden |
| shows an empty state when nothing matches | Typing "zzznotanagent" → "no agents match" message |
| filters agents by category tab | Clicking "Deploy" → Deploy Bot visible, RCA Analyst hidden |
| marks a card as selected when clicked | Deploy Bot card `aria-pressed` flips `false` → `true` |
| keeps every agent visible after changing sort | Selecting "name" sort → all 12 agents still in the DOM |
| remembers the selected category across remounts | "Deploy" tab survives unmount/remount (`aria-pressed` stays `true`) |

### `PipelinesPanel.test.tsx`

`global.fetch` is stubbed per test with `vi.stubGlobal` and cleaned up in
`afterEach`.

| Test | Asserts |
| ----------------------------------------------- | ----------------------------------------- |
| renders pipelines returned by the API | Finds "CI · build & test" and "E2E suite" |
| shows an error state when the API is unreachable | Rejected fetch → text matching `/could not reach the api/i` |

### `Sparkline.test.tsx`

| Test | Asserts |
| ------------------------------------------- | ------------------------------------------------------- |
| renders a polyline with one coordinate per value | 4-point series → `<polyline>` with 4 coordinate pairs |
| renders nothing when given fewer than two points | Single point → no `<polyline>` in the DOM |
| uses the error color when not positive | `positive={false}` → `stroke` attribute contains `color-err` |

### `filterAgents.test.ts`

Tests use a three-agent fixture: PR Reviewer (Review, popular), Deploy Bot
(Deploy, popular), RCA Analyst (Reliability, not popular).

| Test | Asserts |
| ---------------------------------------- | ----------------------------------------------- |
| returns every agent for All + empty query | All 3 agents returned |
| filters by an exact category | `Review` → only PR Reviewer |
| filters by the Popular pseudo-category | The 2 popular agents returned |
| matches the query against the agent name | "deploy" → Deploy Bot only |
| matches the query against the description | "root cause" → RCA Analyst only |
| is case-insensitive | "REVIEWER" → PR Reviewer |
| ignores surrounding whitespace | "  bot  " → Deploy Bot |
| applies category and query together | Popular + "reviewer" → PR Reviewer only |
| returns an empty array when nothing matches | "nonexistent" → `[]` |
| does not mutate the input array | Input array unchanged after the call |

### `sortAgents.test.ts`

Three fixture agents: Charlie (50 runs/wk, 90% success, 30 min ago), Alpha
(300 runs, 80%, 5 min ago), Bravo (100 runs, 99%, 120 min ago).

| Test | Asserts |
| --------------------------------------- | ------------------------------------------------ |
| sorts by runs, descending | Alpha(300) → Bravo(100) → Charlie(50) |
| sorts by success rate, descending | Bravo(99%) → Charlie(90%) → Alpha(80%) |
| sorts by name, ascending | Alpha → Bravo → Charlie |
| sorts by most recent run first | Alpha(5m) → Charlie(30m) → Bravo(120m) |
| does not mutate the input array | Input array order unchanged after the call |

### `agents.test.ts`

Invariant checks against the live `AGENTS` export.

| Test | Asserts |
| ---------------------------------------------- | ------------------------------------------- |
| has at least one agent | `AGENTS.length > 0` |
| gives every agent a unique id | All 12 ids are distinct |
| includes the featured agent | `FEATURED_AGENT_ID` exists in `AGENTS` |
| only uses known categories | Every agent's `category` is in `AGENT_CATEGORIES` |
| keeps success rates between 0 and 100 | `0 ≤ successRate ≤ 100` for every agent |
| gives every agent a non-empty name and description | Both fields are non-empty after `.trim()` |

## Backend

From the `server/` directory:

```bash
cd server
npm test
```

Tests run in a Node environment (`server/vitest.config.ts`). Each test builds
the app with `createApp({ store, cicd })`, injecting
`createMemoryStore(SEED_AGENTS, SEED_KPIS)` and `createMockCicdProvider()`.
**No database and no network access are required** — that is the main reason
data access and the CI/CD provider are injected rather than imported directly.

### Test files

| File | Tests | Covers |
| ------------------------------- | ----- | ------------------------------------------- |
| `src/__tests__/api.test.ts` | 6 | REST endpoints via supertest |
| `src/__tests__/cicd.test.ts` | 6 | `summarizePipelines`, provider selection, mock |

**Total: 12 tests**

### `api.test.ts`

A `testApp()` helper builds a fresh app instance for each test via
`request(testApp())`.

| Test | Asserts |
| ------------------------------------------------- | ---------------------------------------------------- |
| GET /api/health reports ok | `status 200`, `body.status === 'ok'` |
| GET /api/agents returns the full catalogue | `status 200`, length equals `SEED_AGENTS.length` |
| GET /api/agents/:id returns a single agent | `/pr-reviewer` → 200, `body.name === 'PR Reviewer'` |
| GET /api/agents/:id returns 404 for an unknown id | `/does-not-exist` → 404, `body.error` is defined |
| GET /api/kpis returns the KPI list | `status 200`, length equals `SEED_KPIS.length` |
| GET /api/pipelines returns pipelines + summary | 200, `provider === 'mock'`, `summary.total === pipelines.length` |

### `cicd.test.ts`

**`summarizePipelines`**

| Test | Asserts |
| ------------------------------------------------- | -------------------------------------------- |
| counts each status | 2 passing + 1 failing + 1 running → `total=4, passing=2, failing=1, running=1` |
| computes pass rate over finished pipelines only | 2 passing + 1 failing + 1 running → `passRate === 67` (2 of 3 finished, not 2 of 4 total) |
| handles an empty list | All counts and `passRate` are `0` |

**`getCicdProvider`**

| Test | Asserts |
| ----------------------------------------------------- | ------------------------------------------- |
| falls back to the mock provider without credentials | Empty `githubToken` → `name === 'mock'` |
| selects the GitHub provider when token and repo are present | `githubToken='tok'`, `githubRepo='snabbit/app'` → `name === 'github-actions'` |

**Mock CI/CD provider**

| Test | Asserts |
| ------------------------------------------ | -------------------------------------------- |
| returns a non-empty, well-formed pipeline list | `length > 0`; every pipeline has a truthy `id` and a valid status value |
