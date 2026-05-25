---
title: data
description: Files under src/data/
---

**Folder:** `src/data/`

<!-- fill:folder:summary -->
`src/data/` holds the static seed datasets that populate the Agent Console dashboard. Today that is `agents.ts` (the catalogue of SDLC agents plus its `AgentStatus`/`AgentCategory` types) and `kpis.ts` (the headline metrics for the KPI strip). Modules here are plain TypeScript data and type definitions with no React, no side effects, and no network access — they stand in for what a real deployment would fetch from the backend. Components, hooks, and pure-logic helpers do not belong here; they live in `components/` and `lib/`.
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
- `App.tsx` imports `AGENTS` and `FEATURED_AGENT_ID` from [`agents.ts`](../data/agents), splits the featured agent from the rest, and hands the catalogue down to `FeaturedAgent` and `AgentGrid`.
- `KpiStrip.tsx` imports `KPIS` from [`kpis.ts`](../data/kpis) and renders one card per metric, drawing each card's sparkline from its `trend` series.

These modules have no internal dependencies on each other — they are independent data sources consumed by separate parts of the UI.
<!-- /fill:folder:flows -->
