# Progress Log — Snabbit Agent Console

Append-only log so the continuous-improvement loop can resume across sessions.
Newest entries at the top. Each entry records what changed and how it was verified.

---

## 2026-05-21 — Backend + full-stack vertical slice

- Added a backend in `server/`: Express + TypeScript, PostgreSQL, run via tsx.
- Store layer: `AgentStore`/`KpiStore` interfaces with a Postgres
  implementation and an in-memory implementation (so `npm test` needs no DB).
- CI/CD integration adapter: deterministic mock provider plus a GitHub Actions
  live provider, auto-selected when `GITHUB_TOKEN` + `GITHUB_REPO` are set.
- REST API: `/api/health`, `/api/agents`, `/api/agents/:id`, `/api/kpis`,
  `/api/pipelines`. App is built via `createApp(deps)` for dependency injection.
- Frontend wired to the backend: `api.ts` client, `useFetch` hook, and a live
  `PipelinesPanel` (loading / error / empty states) added to the dashboard.
- Tests added: backend 12 (supertest + adapter logic); frontend `PipelinesPanel`
  (2). Backend tests run against the in-memory store — no database required.
- **Verified:** backend `npm test` ✓ (12) + `typecheck` ✓; frontend `npm test`
  ✓ (49) + `typecheck` ✓ + `build` ✓.
- **Not verified in-sandbox:** the Postgres code path — no Postgres available
  in the build sandbox. It is typechecked; run `npm run db:setup` against a
  real database. Tracked so the next session can confirm it.

## 2026-05-21 — Iteration 3: KPI sparklines

- Added a `trend` 7-point series to each KPI and a `Sparkline` component
  (axis-free SVG, non-scaling stroke).
- KPI cards now show a trend line colored by `positive`.
- Test added: `Sparkline.test.tsx` (3) — point count, empty guard, error color.
- **Verified:** `npm test` ✓ (35) · `npm run typecheck` ✓ · `npm run build` ✓.

## 2026-05-21 — Iteration 2: Persistent UI state

- Added `usePersistentState` — a localStorage-backed, failure-safe useState.
- The agent grid now remembers the selected category and sort across reloads.
- Test setup clears `localStorage` after each case to keep tests isolated.
- Test added: the grid restores its category across a remount.
- **Verified:** `npm test` ✓ · `npm run typecheck` ✓.

## 2026-05-21 — Iteration 1: Agent sorting

- Added `lastRunMinutes` to the agent model and a pure `sortAgents` function
  (by runs, success rate, name, recency).
- The agent grid gained a sort dropdown.
- Tests added: `sortAgents.test.ts` (5) + a grid wiring test.
- **Verified:** `npm test` ✓ · `npm run typecheck` ✓.

## 2026-05-21 — Project bootstrapped (MVP)

- Scaffolded Vite + React 19 + TypeScript + Tailwind CSS v4 + Vitest.
- Built the dark, Linear-grade design system — tokens live in `src/index.css`
  (`@theme`). Snabbit pink `#f70f79` is the single brand accent.
- Built the dashboard layout: `Sidebar` (workspace switcher, nav, recent
  sessions, user) and `TopBar` (breadcrumb, search, environment switcher).
- Built the dashboard content: `KpiStrip` (4 KPIs), `FeaturedAgent`,
  `AgentGrid` (search + category tabs + card selection), `PromptBar`.
- Seeded 12 SDLC agents (`src/data/agents.ts`) and 4 KPIs (`src/data/kpis.ts`).
- Extracted pure filter logic to `src/lib/filterAgents.ts`.
- Test suite: 25 tests across 4 files.
- **Verified:** `npm test` ✓ (25 passing) · `npm run typecheck` ✓ · `npm run build` ✓.
- **Status:** MVP complete. Next up: P1 backlog, starting with the run history feed.
