---
title: Testing
description: Vitest suites for the frontend (37 tests) and backend (12 tests).
---

Both packages use **Vitest**. The frontend adds **React Testing Library** and
`@testing-library/user-event`; the backend adds **supertest** for HTTP-level
assertions.

## Frontend

```bash
npm test            # run once (from repo root)
npm run test:watch  # watch mode
```

Tests run in a `jsdom` environment with globals enabled (`vite.config.ts`).
The setup file [`src/test/setup.ts`](/sdlc-sample-worflow/frontend/test-setup/)
imports `@testing-library/jest-dom` and calls `localStorage.clear()` after
every test so `usePersistentState` data cannot leak between cases.

See [`vite.config.ts`](/sdlc-sample-worflow/frontend/vite-config/) for the full
test configuration reference.

### Test files — 37 tests total

| File | Tests | Covers |
|------|-------|--------|
| `src/App.test.tsx` | 4 | Top-level app rendering |
| `src/components/AgentGrid.test.tsx` | 7 | Filtering, sorting, selection, persistence |
| `src/components/PipelinesPanel.test.tsx` | 2 | Loading / error / data states |
| `src/components/Sparkline.test.tsx` | 3 | SVG rendering |
| `src/lib/filterAgents.test.ts` | 10 | `filterAgents` logic |
| `src/lib/sortAgents.test.ts` | 5 | `sortAgents` logic |
| `src/data/agents.test.ts` | 6 | Seed-data invariants |

### `App.test.tsx`

`<App />` is rendered with `global.fetch` stubbed (via `vi.stubGlobal`) to
return an empty pipelines response so `PipelinesPanel` does not make a real
network call.

| Test | Asserts |
|------|---------|
| renders the featured agent | "Featured agent" eyebrow + "PR Reviewer" name |
| renders the KPI strip | Region with accessible name matching `/key metrics/i` |
| renders agents in the grid | "Deploy Bot" and "Alert Triage" in the document |
| renders the prompt input | Element with `aria-label="Prompt input"` |

### `AgentGrid.test.tsx`

All 7 tests render the full 12-agent `AGENTS` array. `userEvent.setup()` is
used for user interactions.

| Test | Asserts |
|------|---------|
| renders a card for every agent | All 12 names present |
| filters by search query | "deploy" → Deploy Bot visible, PR Reviewer hidden |
| shows empty state | "zzznotanagent" → "no agents match" message |
| filters by category tab | "Deploy" → Deploy Bot visible, RCA Analyst hidden |
| marks card as selected | `aria-pressed` flips `false` → `true` on click |
| keeps agents after sort change | All 12 agents remain visible |
| remembers category across remounts | "Deploy" tab survives unmount/remount |

### `PipelinesPanel.test.tsx`

`global.fetch` is stubbed per test with `vi.stubGlobal` and cleaned up in
`afterEach`.

| Test | Asserts |
|------|---------|
| renders pipelines from API | "CI · build & test" and "E2E suite" visible |
| shows error on network failure | Rejected fetch → `/could not reach the api/i` |

### `Sparkline.test.tsx`

| Test | Asserts |
|------|---------|
| one coordinate per value | 4-point series → `<polyline>` with 4 coordinates |
| returns null for < 2 points | Single point → no `<polyline>` |
| error color when not positive | `stroke` attribute contains `color-err` |

### `filterAgents.test.ts`

Three-agent fixture: PR Reviewer (Review, popular), Deploy Bot (Deploy, popular),
RCA Analyst (Reliability, not popular).

| Test | Asserts |
|------|---------|
| All + empty query | All 3 agents |
| Exact category | `'Review'` → PR Reviewer only |
| Popular | 2 popular agents |
| Name match | "deploy" → Deploy Bot only |
| Description match | "root cause" → RCA Analyst only |
| Case-insensitive | "REVIEWER" → PR Reviewer |
| Whitespace trimming | "  bot  " → Deploy Bot |
| Category + query combined | Popular + "reviewer" → PR Reviewer only |
| No match | "nonexistent" → `[]` |
| Input not mutated | Source array unchanged |

### `sortAgents.test.ts`

Three-agent fixture: Charlie (50 runs, 90% success, 30 min), Alpha (300 runs,
80%, 5 min), Bravo (100 runs, 99%, 120 min).

| Test | Expected order | By |
|------|----------------|---|
| `'runs'` | Alpha → Bravo → Charlie | `runsPerWeek` desc |
| `'success'` | Bravo → Charlie → Alpha | `successRate` desc |
| `'name'` | Alpha → Bravo → Charlie | locale A–Z |
| `'recent'` | Alpha → Charlie → Bravo | `lastRunMinutes` asc |
| no mutation | Source unchanged | `[...copy]` in impl |

### `agents.test.ts`

Invariant checks against the live `AGENTS` export:

| Test | Asserts |
|------|---------|
| at least one agent | `AGENTS.length > 0` |
| unique IDs | No duplicate `id` values |
| featured agent exists | `FEATURED_AGENT_ID` ∈ `AGENTS` |
| known categories | Every `category` ∈ `AGENT_CATEGORIES` |
| success rates in range | `0 ≤ successRate ≤ 100` |
| non-empty name and description | Both non-empty after `.trim()` |

## Backend

```bash
cd server
npm test
```

Tests run in a Node environment (`environment: 'node'` in
[`server/vitest.config.ts`](/sdlc-sample-worflow/backend/vitest-config/)). Each
test builds the app fresh using
`createApp({ store: createMemoryStore(SEED_AGENTS, SEED_KPIS), cicd: createMockCicdProvider() })`.
**No database and no network access are required.**

### Test files — 12 tests total

| File | Tests | Covers |
|------|-------|--------|
| `src/__tests__/api.test.ts` | 6 | REST endpoints via supertest |
| `src/__tests__/cicd.test.ts` | 6 | `summarizePipelines`, provider selection, mock |

### `api.test.ts`

A `testApp()` helper builds a fresh app for each test.

| Test | Asserts |
|------|---------|
| `GET /api/health` | 200, `body.status === 'ok'` |
| `GET /api/agents` | 200, length = `SEED_AGENTS.length` |
| `GET /api/agents/pr-reviewer` | 200, `body.name === 'PR Reviewer'` |
| `GET /api/agents/does-not-exist` | 404, `body.error` defined |
| `GET /api/kpis` | 200, length = `SEED_KPIS.length` |
| `GET /api/pipelines` | 200, `provider === 'mock'`, summary totals match |

### `cicd.test.ts`

**`summarizePipelines`:**

| Test | Asserts |
|------|---------|
| counts each status | 2+1+1 → `{ total:4, passing:2, failing:1, running:1 }` |
| pass rate over finished only | 2/3 finished → `passRate: 67` |
| empty list | All zeros |

**`getCicdProvider`:**

| Test | Asserts |
|------|---------|
| no credentials | `name === 'mock'` |
| with token + repo | `name === 'github-actions'` |

**Mock CI/CD provider:**

| Test | Asserts |
|------|---------|
| well-formed list | Non-empty, valid statuses, truthy IDs |
