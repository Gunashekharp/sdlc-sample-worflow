---
title: data
description: Files under src/data/
---

**Folder:** `src/data/`

<!-- fill:folder:summary -->
`src/data/` holds the static seed data that fills the Snabbit Agent Console UI before any backend is wired up. It currently exports two modules: `agents.ts`, the catalogue of SDLC agents (with the `Agent`, `AgentStatus`, and `AgentCategory` types), and `kpis.ts`, the headline metrics (`KPIS`) for the dashboard. Modules here are plain TypeScript constants and the interfaces that shape them — no React, no fetching, and no business logic. Components, hooks, and the `filterAgents`/`sortAgents` helpers that consume this data live elsewhere, and in a real deployment these constants would be replaced by data loaded from the backend.
<!-- /fill:folder:summary -->

## Files

| File | Hint |
| --- | --- |
| [`agents.ts`](../data/agents) | SDLC agent catalogue for the Snabbit Agent Console. |
| [`kpis.ts`](../data/kpis) | Headline metrics shown in the KPI strip. |

## Dependencies

### Module dependency subgraph

:::note
No internal dependencies detected for this folder.
:::

## Key flows

<!-- fill:folder:flows -->
- `App.tsx` reads `AGENTS` and `FEATURED_AGENT_ID` from `agents.ts` to split the featured agent from the rest, then feeds the remainder through `filterAgents`/`sortAgents` into `AgentGrid` and `AgentCard`.
- `AGENT_CATEGORIES` from `agents.ts` is iterated by `AgentGrid` to build the category filter controls, keeping the catalogue and filter UI in sync.
- `KpiStrip` maps over `KPIS` from `kpis.ts` to render one metric card per entry, including its delta and a sparkline drawn from each metric's `trend` series.
<!-- /fill:folder:flows -->
