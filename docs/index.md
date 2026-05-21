# Snabbit Agent Console

The **Snabbit Agent Console** is an internal AI workflow console for Snabbit's
ops team — a dense, dark, Linear-grade dashboard for running SDLC agents such as
PR review, deploys, root-cause analysis, and alert triage. It is backed by a
REST API and a live CI/CD integration.

!!! note "These docs maintain themselves"
    On a schedule (every 10 hours) and on manual dispatch, a documentation
    agent reviews the code and updates the affected pages here. Every statement
    below is derived directly from the source.

## What the console is

The product is a single-page dashboard composed of:

- A **featured agent** banner (the PR Reviewer) with a call-to-action.
- A **KPI strip** of four headline metrics, each with a sparkline trend.
- A **live CI/CD pipelines panel** that fetches from the backend.
- A searchable, sortable, filterable **agent grid** of the full catalogue.
- A persistent **prompt bar** at the bottom of the viewport.

The dashboard is wrapped in a fixed shell: a left [Sidebar](frontend/components.md#sidebar)
for navigation and recent sessions, and a [TopBar](frontend/components.md#topbar)
breadcrumb with search and environment selector.

## How it is built

| Tier         | Location    | Stack                                                    |
| ------------ | ----------- | -------------------------------------------------------- |
| **Frontend** | repo root   | Vite, React 19, TypeScript, Tailwind CSS v4              |
| **Backend**  | `server/`   | Express 5, TypeScript, PostgreSQL, a CI/CD adapter       |

!!! info "Data sources differ by section"
    The **CI/CD pipelines panel reads live from the backend** (`GET /api/pipelines`).
    The **agent grid and KPI strip currently use local seed data** bundled into
    the frontend at `src/data/`. The backend already serves the same data at
    `GET /api/agents` and `GET /api/kpis`; wiring the frontend to consume it is
    the top item in `BACKLOG.md`.

## Sections

- [Getting started](getting-started.md) — run the frontend and backend locally.
- [Architecture](architecture.md) — how the pieces fit together.
- **Frontend**
    - [Overview](frontend/index.md) — stack, layout, composition.
    - [Components](frontend/components.md) — every UI component.
    - [Library & hooks](frontend/lib.md) — pure logic, API client, hooks.
    - [Data & types](frontend/data.md) — local seed data and type definitions.
    - [Styling & design tokens](frontend/styling.md) — Tailwind theme and tokens.
    - [Testing](frontend/testing.md) — the Vitest + Testing Library suite.
- **Backend**
    - [Overview](backend/index.md) — stack, layout, request flow.
    - [Configuration](backend/configuration.md) — environment variables.
    - [App & routes](backend/app-and-routes.md) — the Express app and REST routes.
    - [Data stores](backend/stores.md) — the store interfaces and domain types.
    - [Database](backend/database.md) — schema and the seed/setup script.
    - [CI/CD integration](backend/cicd-integration.md) — the pipelines adapter.
    - [Testing](backend/testing.md) — the supertest + Vitest suite.
- [API reference](api-reference.md) — the REST endpoints with payload shapes.
