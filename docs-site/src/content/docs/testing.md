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

Tests run in a `jsdom` environment with globals enabled, configured in
`vite.config.ts`. The setup file `src/test/setup.ts` is loaded before each run.

Test files live alongside the code they cover:

| File                                     | Covers                              |
| ---------------------------------------- | ----------------------------------- |
| `src/App.test.tsx`                       | Top-level app rendering             |
| `src/components/AgentGrid.test.tsx`      | Filtering, sorting, selection       |
| `src/components/PipelinesPanel.test.tsx` | Loading / error / data states       |
| `src/components/Sparkline.test.tsx`      | Sparkline rendering                 |
| `src/lib/sortAgents.test.ts`             | `sortAgents`                        |
| `src/lib/filterAgents.test.ts`           | `filterAgents`                      |
| `src/data/agents.test.ts`                | Seed-data invariants                |

## Backend

From the `server/` directory:

```bash
cd server
npm test
```

| File                            | Covers                                            |
| ------------------------------- | ------------------------------------------------- |
| `src/__tests__/api.test.ts`     | REST endpoints via supertest                      |
| `src/__tests__/cicd.test.ts`    | `summarizePipelines`, provider selection, the mock |

The API tests build the app with `createApp({ store, cicd })`, injecting an
in-memory store (`createMemoryStore(SEED_AGENTS, SEED_KPIS)`) and the mock CI/CD
provider.

:::note
Backend tests use the in-memory store and the mock CI/CD provider, so **no
database and no network access are required**. This is the main reason data
access is injected into `createApp` rather than imported directly.
:::

## What the suites assert

- **API** — health returns `ok`; `/api/agents` returns the full catalogue;
  `/api/agents/:id` returns a single agent and `404` for unknown ids;
  `/api/kpis` returns the KPI list; `/api/pipelines` returns pipelines whose
  `summary.total` matches the pipeline count and reports `provider: "mock"`.
- **CI/CD** — `summarizePipelines` counts each status, computes pass rate over
  finished pipelines only, and handles an empty list; `getCicdProvider` falls
  back to the mock without credentials and selects GitHub when both are present;
  the mock returns a non-empty, well-formed list.
