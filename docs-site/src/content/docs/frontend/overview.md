---
title: frontend
description: React + Vite single-page application. Renders the Agent Console dashboard.
---

**Section root:** `src`

> React + Vite single-page application. Renders the Agent Console dashboard.

<!-- fill:overview:summary -->
The `src` subsystem is the React + Vite single-page application that renders the Agent Console dashboard. Its entrypoint `main.tsx` mounts the root `App.tsx`, which composes the page from presentational components under `components/` (Sidebar, TopBar, KpiStrip, FeaturedAgent, PipelinesPanel, AgentGrid, PromptBar) and feeds them data from `data/` (the `AGENTS` catalogue and `KPIS` metrics). Pure logic and hooks live in `lib/` — agent filtering and sorting, a `useFetch` hook, persistent state, and the `api` client that `PipelinesPanel` uses to load live data. The Module dependency graph below shows how these files import one another, and the React component tree shows the parent-renders-child hierarchy starting at `App`. The app consumes mostly static seed data, with `PipelinesPanel` being the one component that fetches live data through `lib/api.ts`.
<!-- /fill:overview:summary -->

## Top-level structure

| Folder | Purpose |
| --- | --- |
| [`components/`](./frontend/components/overview/) | Presentational React components and icons; add a file here when introducing a new piece of dashboard UI. |
| [`data/`](./frontend/data/overview/) | Static seed datasets and their types (agents, KPIs); add a file here for hard-coded data that stands in for a backend fetch. |
| [`lib/`](./frontend/lib/overview/) | Framework-agnostic logic, hooks, and the API client; add a file here for reusable pure functions or React hooks. |
| [`test/`](./frontend/test/overview/) | Vitest global test setup; add a file here for shared test configuration, not for individual test suites. |

### Files at the root of this section

| File | Hint |
| --- | --- |
| [`App.tsx`](./app) | Root component that lays out the console shell and wires every dashboard component to its data. |
| [`main.tsx`](./main) | React entrypoint that mounts `App` into `#root` inside `StrictMode`. |

## Architecture

### Module dependency graph

```mermaid
%% Module dependency graph for frontend
%% Auto-generated from source by scripts/docs/extract-diagrams.ts. Do not edit by hand — changes will be overwritten on the next docs-agent run.
flowchart LR
  App_tsx["App.tsx"]
  components_AgentCard_tsx["components/AgentCard.tsx"]
  components_AgentGrid_tsx["components/AgentGrid.tsx"]
  components_FeaturedAgent_tsx["components/FeaturedAgent.tsx"]
  components_KpiStrip_tsx["components/KpiStrip.tsx"]
  components_PipelinesPanel_tsx["components/PipelinesPanel.tsx"]
  components_PromptBar_tsx["components/PromptBar.tsx"]
  components_Sidebar_tsx["components/Sidebar.tsx"]
  components_Sparkline_tsx["components/Sparkline.tsx"]
  components_StatusDot_tsx["components/StatusDot.tsx"]
  components_TopBar_tsx["components/TopBar.tsx"]
  components_icons_tsx["components/icons.tsx"]
  data_agents_ts["data/agents.ts"]
  data_kpis_ts["data/kpis.ts"]
  lib_api_ts["lib/api.ts"]
  lib_filterAgents_ts["lib/filterAgents.ts"]
  lib_sortAgents_ts["lib/sortAgents.ts"]
  lib_useFetch_ts["lib/useFetch.ts"]
  lib_usePersistentState_ts["lib/usePersistentState.ts"]
  main_tsx["main.tsx"]
  App_tsx --> data_agents_ts
  App_tsx --> components_Sidebar_tsx
  App_tsx --> components_TopBar_tsx
  App_tsx --> components_KpiStrip_tsx
  App_tsx --> components_FeaturedAgent_tsx
  App_tsx --> components_PipelinesPanel_tsx
  App_tsx --> components_AgentGrid_tsx
  App_tsx --> components_PromptBar_tsx
  main_tsx --> App_tsx
  components_AgentCard_tsx --> data_agents_ts
  components_AgentCard_tsx --> components_StatusDot_tsx
  components_AgentGrid_tsx --> data_agents_ts
  components_AgentGrid_tsx --> data_agents_ts
  components_AgentGrid_tsx --> lib_filterAgents_ts
  components_AgentGrid_tsx --> lib_sortAgents_ts
  components_AgentGrid_tsx --> lib_sortAgents_ts
  components_AgentGrid_tsx --> lib_usePersistentState_ts
  components_AgentGrid_tsx --> components_AgentCard_tsx
  components_AgentGrid_tsx --> components_icons_tsx
  components_FeaturedAgent_tsx --> data_agents_ts
  components_FeaturedAgent_tsx --> components_icons_tsx
  components_FeaturedAgent_tsx --> components_StatusDot_tsx
  components_KpiStrip_tsx --> data_kpis_ts
  components_KpiStrip_tsx --> data_kpis_ts
  components_KpiStrip_tsx --> components_icons_tsx
  components_KpiStrip_tsx --> components_Sparkline_tsx
  components_PipelinesPanel_tsx --> lib_api_ts
  components_PipelinesPanel_tsx --> lib_api_ts
  components_PipelinesPanel_tsx --> lib_useFetch_ts
  components_PromptBar_tsx --> components_icons_tsx
  components_Sidebar_tsx --> components_icons_tsx
  components_StatusDot_tsx --> data_agents_ts
  components_TopBar_tsx --> components_icons_tsx
  lib_filterAgents_ts --> data_agents_ts
  lib_sortAgents_ts --> data_agents_ts
```

### React component tree

```mermaid
%% React component tree (parent renders child)
%% Auto-generated from source by scripts/docs/extract-diagrams.ts. Do not edit by hand — changes will be overwritten on the next docs-agent run.
flowchart TD
  AgentCard["AgentCard"]
  AgentGrid["AgentGrid"]
  App["App"]
  FeaturedAgent["FeaturedAgent"]
  KpiStrip["KpiStrip"]
  PipelinesPanel["PipelinesPanel"]
  PromptBar["PromptBar"]
  Sidebar["Sidebar"]
  Sparkline["Sparkline"]
  StatusDot["StatusDot"]
  TopBar["TopBar"]
  icons["icons"]
  main["main"]
  App --> Sidebar
  App --> TopBar
  App --> KpiStrip
  App --> FeaturedAgent
  App --> PipelinesPanel
  App --> AgentGrid
  App --> PromptBar
  main --> App
  AgentCard --> StatusDot
  AgentGrid --> icons
  AgentGrid --> AgentCard
  FeaturedAgent --> icons
  FeaturedAgent --> StatusDot
  KpiStrip --> Sparkline
  PromptBar --> icons
  Sidebar --> icons
  TopBar --> icons
```

## Key flows

<!-- fill:overview:flows -->
- **Boot and compose:** [`main.tsx`](./main) creates the React root and renders [`App`](./app), which reads `AGENTS` and `FEATURED_AGENT_ID` from [`data/agents`](./data/agents), splits the featured agent from the rest, and renders the Sidebar/TopBar/KpiStrip/FeaturedAgent/PipelinesPanel/AgentGrid/PromptBar layout.
- **Browse agents:** `AgentGrid` takes the `rest` agents, applies [`filterAgents`](./lib/filteragents) and [`sortAgents`](./lib/sortagents), and persists the user's filter/sort choices via `usePersistentState`, rendering one `AgentCard` per result.
- **Live pipelines:** `PipelinesPanel` calls [`api`](./lib/api) through the [`useFetch`](./lib/usefetch) hook to load pipeline data at runtime — the one place the SPA reaches beyond static seed data.
<!-- /fill:overview:flows -->

## When to add code here

<!-- fill:overview:when-to-add -->
Add code to `src` when it is part of the browser-side dashboard. Put new visual pieces in `components/` (and reusable SVGs in `components/icons.tsx`), pure functions or React hooks in `lib/`, and hard-coded datasets or their types in `data/`. Keep server-side logic, agent execution, and integrations out of this subsystem — those belong in the backend. If a component needs live data, fetch it through `lib/api.ts` and `lib/useFetch.ts` rather than reaching out to the network directly.
<!-- /fill:overview:when-to-add -->
