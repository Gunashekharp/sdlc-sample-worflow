---
title: Snabbit Agent Console
---

The **Snabbit Agent Console** is an internal AI workflow console for Snabbit's
ops team — a dense, dark, Linear-grade dashboard for running SDLC agents such
as PR review, deploys, root-cause analysis and alert triage, backed by a REST
API and a live CI/CD integration.

:::note
This documentation is maintained automatically. On a schedule, a documentation
agent reviews the codebase and updates these pages.
:::

## What it does

The console presents a single-screen dashboard:

- A **KPI strip** of headline metrics (agent runs, PRs reviewed, mean time to
  merge, suite pass rate), each with a sparkline trend.
- A **featured agent** card highlighting one agent (PR Reviewer by default).
- A **CI/CD pipelines panel** that reads live from the backend API.
- An **agent grid** with category tabs, free-text filtering and sorting.
- A **prompt bar** for issuing natural-language tasks.

## Architecture at a glance

| Layer       | Stack                                                        | Location      |
| ----------- | ------------------------------------------------------------ | ------------- |
| Frontend    | Vite + React 19 + TypeScript + Tailwind CSS v4               | repo root     |
| Backend     | Express 5 + TypeScript + PostgreSQL                          | `server/`     |
| Integration | CI/CD adapter (GitHub Actions / Jenkins, mock by default)    | `server/src/integrations/` |

The CI/CD pipelines panel reads live from the backend. The agent grid and KPI
strip currently render from local seed data bundled into the frontend;
finishing that migration to the API is the top backlog item.

:::caution
The frontend agent grid and KPI strip use a **local copy** of the seed data
(`src/data/`), not the backend API. The backend exposes `GET /api/agents` and
`GET /api/kpis`, but the frontend does not yet call them. Only the pipelines
panel is wired to the API.
:::

## Where to start

- **[Getting started](/sdlc-sample-worflow/getting-started/)** — run the
  frontend and backend locally.
- **[Architecture](/sdlc-sample-worflow/architecture/)** — how the pieces fit
  together.
- **Frontend** and **Backend** sections in the sidebar — module-by-module
  reference.
