---
title: Snabbit Agent Console
description: Documentation for the Snabbit Agent Console.
---

The Snabbit Agent Console is an internal AI workflow console for Snabbit's ops
team — a dense, dark, "Linear-grade" dashboard for running SDLC agents (PR
review, deploys, RCAs, alert triage), backed by a REST API and a live CI/CD
integration.

:::note
This documentation is maintained automatically. On a schedule, a documentation
agent reviews the codebase and updates these pages.
:::

## What's in the box

The project is a single repository with two packages:

- **Frontend** (repository root) — a Vite + React 19 + TypeScript + Tailwind
  CSS v4 single-page dashboard.
- **Backend** (`server/`) — an Express 5 + TypeScript REST API backed by
  PostgreSQL, with a pluggable CI/CD integration (GitHub Actions / Jenkins,
  mock by default).

The dashboard's **CI/CD pipelines panel reads live from the backend**. The
agent grid and KPI strip still render from local seed data bundled into the
frontend; completing that migration to the API is the top backlog item.

## The dashboard at a glance

The console (`src/App.tsx`) is a fixed-width sidebar next to a flex column
containing a top bar, a scrollable main region, and a pinned prompt bar. The
main region stacks four panels:

| Panel             | Source           | Wired to backend?            |
| ----------------- | ---------------- | ---------------------------- |
| KPI strip         | Local seed data  | No                           |
| Featured agent    | Local seed data  | No                           |
| CI/CD pipelines   | `GET /api/pipelines` | **Yes**                  |
| Agent grid        | Local seed data  | No                           |

## Where to start

- [Getting started](/sdlc-sample-worflow/getting-started/) — run the frontend
  and backend locally.
- [Architecture](/sdlc-sample-worflow/architecture/) — how the pieces fit
  together.
- **Frontend** — [overview](/sdlc-sample-worflow/frontend/overview/),
  [components](/sdlc-sample-worflow/frontend/components/),
  [library](/sdlc-sample-worflow/frontend/lib/),
  [data & types](/sdlc-sample-worflow/frontend/data/),
  [styling](/sdlc-sample-worflow/frontend/styling/).
- **Backend** — [overview](/sdlc-sample-worflow/backend/overview/),
  [REST API](/sdlc-sample-worflow/backend/api/),
  [data model](/sdlc-sample-worflow/backend/data-model/),
  [stores & database](/sdlc-sample-worflow/backend/stores/),
  [CI/CD integration](/sdlc-sample-worflow/backend/cicd-integration/).
- [Testing](/sdlc-sample-worflow/testing/) — the Vitest suites on both
  packages.
