---
title: Data — src/data/
---

`src/data/` holds the frontend's static seed data and the core domain types.

:::note
This is static seed data bundled into the frontend at build time. A real deployment would load agents and KPIs from the backend API rather than from these files. The backend keeps a matching copy of both datasets in `server/src/seed.ts` and populates Postgres from it on startup. Migrating the frontend to load agents and KPIs from the API is the top backlog item.
:::

## Files

| File | Purpose |
|---|---|
| [agents.ts](./data/agents) | `Agent` type, `AgentStatus` type, `AgentCategory` type, 12-agent `AGENTS` array, `FEATURED_AGENT_ID` constant, `AGENT_CATEGORIES` list |
| [kpis.ts](./data/kpis) | `Kpi` type, 4-entry `KPIS` array |

## Overview

### `agents.ts`

Defines the domain types for the agent catalogue and exports:

- `AgentStatus` — `'running' | 'idle' | 'attention'`
- `AgentCategory` — `'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'`
- `Agent` — the full agent record interface (12 fields)
- `AGENTS` — array of 12 static agent objects
- `FEATURED_AGENT_ID` — `'pr-reviewer'`
- `AGENT_CATEGORIES` — the canonical ordered category list

### `kpis.ts`

Defines the `Kpi` interface and exports:

- `Kpi` — the KPI record interface (7 fields including a 7-point trend series)
- `KPIS` — array of 4 static KPI objects

## Key exports and consumers

| Export | File | Used by |
|---|---|---|
| `AGENTS` | `agents.ts` | `App.tsx` (featured/rest split), `AgentGrid` tests |
| `FEATURED_AGENT_ID` | `agents.ts` | `App.tsx` (lookup) |
| `AGENT_CATEGORIES` | `agents.ts` | `AgentGrid` (builds tab bar) |
| `KPIS` | `kpis.ts` | `KpiStrip` (renders one `KpiCard` per entry) |

## Agent catalogue summary

12 agents across 5 categories:

| Category | Agents |
|---|---|
| Review | PR Reviewer, Migration Reviewer |
| Deploy | Deploy Bot |
| Reliability | RCA Analyst, Alert Triage, On-call Digest |
| Quality | E2E Verifier, Flaky Test Hunter, Dependency Bot, Coverage Guard |
| Docs | Changelog Author, Spec Author |

Currently active (status `'running'`): PR Reviewer, Alert Triage, E2E Verifier, Coverage Guard.

## Backend mirror

`server/src/seed.ts` exports:

- `SEED_AGENTS` — an array that mirrors `AGENTS` from this file
- `SEED_KPIS` — an array that mirrors `KPIS` from `kpis.ts`

These are used by the backend's database seed script to populate Postgres on a fresh deployment. There is no shared package or code generation between the frontend and backend seed files — they are kept in sync by hand. If you add or modify an agent in `agents.ts`, you must also update `server/src/seed.ts`.
