---
title: frontend
description: React + Vite single-page application. Renders the Agent Console dashboard.
---

**Section root:** `src`

> React + Vite single-page application. Renders the Agent Console dashboard.

<!-- fill:overview:summary -->
<FILL: 3-5 sentences on what this subsystem owns, the runtime boundaries, and the data it produces or consumes. Reference the diagrams below by name.>
<!-- /fill:overview:summary -->

## Top-level structure

| Folder | Purpose |
| --- | --- |
| [`components/`](./frontend/components/overview/) | <FILL: one line on what lives in components/ and when to add a file here.> |
| [`data/`](./frontend/data/overview/) | <FILL: one line on what lives in data/ and when to add a file here.> |
| [`lib/`](./frontend/lib/overview/) | <FILL: one line on what lives in lib/ and when to add a file here.> |
| [`test/`](./frontend/test/overview/) | <FILL: one line on what lives in test/ and when to add a file here.> |

### Files at the root of this section

| File | Hint |
| --- | --- |
| [`App.tsx`](./app) | <FILL: one-line purpose for App.tsx> |
| [`main.tsx`](./main) | <FILL: one-line purpose for main.tsx> |

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
<FILL: 2-3 short flow descriptions — the most important runtime sequences in this subsystem. Reference symbols by their documented file (use relative links).>
<!-- /fill:overview:flows -->

## When to add code here

<!-- fill:overview:when-to-add -->
<FILL: practical guidance for someone deciding whether a new module belongs in this subsystem or somewhere else.>
<!-- /fill:overview:when-to-add -->
