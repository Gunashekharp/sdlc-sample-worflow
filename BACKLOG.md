# Backlog — Snabbit Agent Console

Prioritized, verifiable improvements. This file is the fuel for the
continuous-improvement loop.

**Loop procedure (one item at a time):**
1. Pick the top unchecked item.
2. Read its **Verify** line — that is the success criterion.
3. Make the *minimum* change that satisfies it (surgical edits only).
4. Run `npm test` and `npm run typecheck` — both must pass.
5. Check the item off here and add a dated entry to `PROGRESS.md`.

---

## P0 — Full-stack follow-ups

The backend (`server/`) now exists. These finish connecting it.

- [ ] **Migrate agents & KPIs to the API.** Replace the frontend's static
  `data/agents.ts` / `data/kpis.ts` with calls to `GET /api/agents` and
  `GET /api/kpis`, with loading and error states.
  Verify: App fetches both; tests mock fetch and assert rendered data.
- [ ] **Agent runs feed.** Add an `agent_runs` table + `GET /api/runs`, and a
  frontend panel that lists recent runs.
  Verify: supertest covers the route; component test renders the rows.
- [ ] **Wire "Run agent" to a real endpoint.** `POST /api/agents/:id/runs`
  records a run; the button calls it and shows feedback.
  Verify: supertest asserts the run is created and returned.
- [ ] **PagerDuty + Datadog and Slack adapters.** Same adapter pattern as
  CI/CD — mock by default, live on credentials.
  Verify: summary/transform logic unit tested.
- [ ] **docker-compose.** One command brings up Postgres + backend + frontend.
  Verify: `docker compose up` serves the dashboard with live data.
- [ ] **Backend request validation + structured errors.** Validate params and
  return consistent error bodies.
  Verify: supertest covers a malformed request.

## P1 — High value

- [ ] **Run history feed.** Add a `RunFeed` panel listing recent agent runs (agent, status, duration, timestamp).
  Verify: new `src/data/runs.ts` + `RunFeed` component; test asserts rows render and a failed run gets error styling.
- [ ] **Agent detail drawer.** Clicking an agent card opens a side drawer with full description, stats, and recent runs.
  Verify: test clicks a card, asserts the drawer shows the agent name; pressing Escape closes it.
- [ ] **Command palette (⌘K).** Make the TopBar search open a working palette that filters agents by name.
  Verify: test fires the ⌘K shortcut, types a query, asserts only matching agents are listed.
- [x] **Sort agents.** Add a sort control to the grid (by runs, success rate, name, last run).
  Verify: pure `sortAgents` function with unit tests for each sort key. — done 2026-05-21
- [x] **KPI sparklines.** Render a tiny 7-point trend line inside each KPI card.
  Verify: `Sparkline` component with unit tests for point count and color. — done 2026-05-21
- [x] **Persist UI state.** Save selected category and sort to `localStorage` and restore on load.
  Verify: test sets a category, re-renders, asserts it is restored. (Theme persistence lands with the light-theme item.) — done 2026-05-21
- [ ] **Loading & error states.** Add explicit skeleton and error states to the agent grid.
  Verify: test renders the grid in `loading` and `error` states and asserts the right UI.

## P2 — Depth & polish

- [ ] **Light theme + toggle.** Add a light token set and a header toggle; respect the design system.
  Verify: toggling sets `data-theme`; test asserts the attribute flips.
- [ ] **Status filter.** Filter agents by run status (running / idle / attention).
  Verify: extend `filterAgents` with a `status` option; add unit tests.
- [ ] **Search-match highlight.** Highlight the matched query substring inside agent cards.
  Verify: test types a query and asserts a `<mark>` wraps the match.
- [ ] **Run simulation.** Clicking "Run agent" sets status to running, then resolves after a delay.
  Verify: test clicks Run, asserts a running indicator appears.
- [ ] **Toast notifications.** Show a transient toast on agent run / prompt submit.
  Verify: test triggers an action and asserts the toast text appears, then auto-dismisses.
- [ ] **Runs-over-time chart.** Add an area chart of agent runs across the last 14 days.
  Verify: chart renders with the expected number of data points (test on the data, not pixels).
- [ ] **Success-rate-by-category chart.** Bar chart aggregating success rate per category.
  Verify: pure aggregation function with unit tests.
- [ ] **Favorites.** Star agents; add a "Favorites" filter tab.
  Verify: test stars an agent, switches to Favorites, asserts it is the only card.
- [ ] **Collapsible sidebar.** Sidebar collapses to icons on narrow widths / via a toggle.
  Verify: test toggles collapse and asserts the labels are hidden.
- [ ] **Density toggle.** Comfortable / compact spacing toggle for the grid.
  Verify: test toggles density and asserts a class change.
- [ ] **Category section view.** Alternate grid view grouped by category with section headers.
  Verify: test switches to grouped view and asserts one header per used category.

## P3 — Infrastructure & quality

- [ ] **Shared UI primitives.** Extract `Button`, `Card`, `Tag` to remove class duplication.
  Verify: components reused in ≥3 places; full suite still green.
- [ ] **Lint clean.** Run `npm run lint`, fix every warning, keep it at zero.
  Verify: `npm run lint` exits 0 with no warnings.
- [ ] **Test coverage gate.** Add `@vitest/coverage-v8` and enforce a sensible threshold.
  Verify: `npm run test -- --coverage` passes the configured threshold.
- [ ] **Component test backfill.** Add tests for Sidebar, TopBar, KpiStrip, PromptBar, FeaturedAgent, StatusDot.
  Verify: each component has at least one rendering/behaviour test.
- [ ] **Accessibility pass.** Audit contrast, focus-visible rings, keyboard traps, and labels.
  Verify: every interactive element is keyboard-reachable with a visible focus ring.
- [ ] **Error boundary.** Add a top-level React error boundary with a fallback UI.
  Verify: test renders a throwing child and asserts the fallback shows.
- [ ] **Routing.** Introduce light routing so Sidebar items lead to real (stub) views.
  Verify: test navigates to a route and asserts the view changes.
