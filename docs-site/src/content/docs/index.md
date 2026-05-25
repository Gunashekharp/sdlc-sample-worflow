---
title: Snabbit Agent Console
description: Documentation for the Snabbit Agent Console — an internal AI workflow console for SDLC agents.
---

The **Snabbit Agent Console** is an internal AI workflow console for Snabbit's ops team. It is a dense, dark, "Linear-grade" dashboard for running SDLC agents — PR review, deploys, RCAs, alert triage — backed by a REST API and a live CI/CD integration. The UI is purpose-built for power users who need high information density, keyboard-first navigation, and instant feedback.

:::note
This documentation is maintained automatically. On a schedule, a documentation agent reviews the codebase and updates these pages.
:::

## System overview

The console is a single-page React application that communicates with a small Express REST API, which in turn reads from PostgreSQL and (optionally) queries GitHub Actions. A separate Cloudflare Worker, embedded on this documentation site, provides an AI-powered "Ask the docs" chatbot powered by **Anthropic Claude Haiku 4.5** — not Cloudflare Workers AI.

```mermaid
flowchart TD
  subgraph Browser["Browser"]
    SPA["React SPA\nVite :5173"]
    ChatWidget["ChatWidget\ndocs site"]
  end

  subgraph API["Express API :3001"]
    Routes["routes.ts"]
    Store["Store interface"]
    CicdProvider["CicdProvider"]
  end

  subgraph DB["PostgreSQL\nsnabbit_dash"]
    agents["agents table"]
    kpis["kpis table"]
  end

  subgraph CicdBackend["CI/CD backends"]
    Mock["MockCicdProvider\n(default)"]
    GH["GitHub Actions API\n(GITHUB_TOKEN set)"]
  end

  subgraph Cloudflare["Cloudflare Edge"]
    Worker["chat-worker\nCloudflare Worker"]
    Anthropic["Anthropic API\nClaude Haiku 4.5"]
  end

  SPA -->|"GET /api/pipelines\nGET /api/agents\nGET /api/kpis"| Routes
  Routes --> Store
  Routes --> CicdProvider
  Store --> agents
  Store --> kpis
  CicdProvider -->|"no credentials"| Mock
  CicdProvider -.->|"GITHUB_TOKEN + GITHUB_REPO"| GH

  ChatWidget -->|"POST { question, history }"| Worker
  Worker -->|"POST /v1/messages"| Anthropic
  Anthropic -->>Worker: answer text
  Worker -->>ChatWidget: "{ answer, sources }"
```

## What's in the box

The project is a single repository containing three packages that build, test, and run independently:

| Package | Location | Stack |
|---------|----------|-------|
| **Frontend** | repo root | Vite 8 + React 19 + TypeScript 6 + Tailwind CSS v4 |
| **Backend** | `server/` | Express 5 + TypeScript, backed by PostgreSQL |
| **Chat worker** | `chat-worker/` | Cloudflare Worker calling Anthropic Claude Haiku 4.5 |

- **Frontend** — a Vite 8 + React 19 + TypeScript 6 + Tailwind CSS v4 single-page dashboard. Most panels render from static seed data bundled at build time; only the CI/CD pipelines panel makes a live network call.
- **Backend** — an Express 5 + TypeScript REST API backed by PostgreSQL, with a pluggable CI/CD provider (mock by default, GitHub Actions when credentials are set). Accepts dependencies by injection, so the test suite needs no database and no network.
- **Chat worker** — a stateless Cloudflare Worker (`chat-worker/src/index.js`) that keyword-searches a bundled `docs-index.json`, then calls the **Anthropic API** (`claude-haiku-4-5-20251001` via `https://api.anthropic.com/v1/messages`) to answer questions using retrieved documentation chunks. The `ANTHROPIC_API_KEY` is stored as a Wrangler secret and never exposed to the browser. Conversation history is kept in the browser (session memory) and sent with each request.

## Dashboard at a glance

The console (`src/App.tsx`) lays out a fixed-width sidebar beside a flex column containing a top bar, a scrollable main region, and a pinned prompt bar. The main region stacks four panels:

| Panel | Data source | Live network call? |
|-------|-------------|-------------------|
| KPI strip | `src/data/kpis.ts` (seed data) | No |
| Featured agent | `src/data/agents.ts` (seed data) | No |
| CI/CD pipelines | `GET /api/pipelines` (Express) | **Yes** |
| Agent grid | `src/data/agents.ts` (seed data) | No |

The KPI strip, featured-agent hero card, and agent grid all render without the backend being present. Only the CI/CD pipelines panel shows an error state when the backend is unreachable; the rest of the dashboard is unaffected.

## Where to start

- [Getting started](/sdlc-sample-worflow/getting-started/) — run the frontend, backend, and chat worker locally.
- [Architecture](/sdlc-sample-worflow/architecture/) — how all the pieces fit together, with detailed diagrams.
- [Testing](/sdlc-sample-worflow/testing/) — 49 tests across both packages, with full per-suite breakdowns.

### Frontend

- [Overview](/sdlc-sample-worflow/frontend/overview/) — layout, entry points, build tooling
- [App.tsx](/sdlc-sample-worflow/frontend/app/) — root component and dashboard assembly
- [Components](/sdlc-sample-worflow/frontend/components/overview/) — all UI components
- [Library](/sdlc-sample-worflow/frontend/lib/overview/) — hooks and pure functions
- [Data & types](/sdlc-sample-worflow/frontend/data/overview/) — agent and KPI seed data

### Backend

- [Overview](/sdlc-sample-worflow/backend/overview/) — architecture, dependency-injection pattern
- [Routes](/sdlc-sample-worflow/backend/routes/) — every REST endpoint registered on the Express app
- [Domain model](/sdlc-sample-worflow/backend/domain/) — the `Agent`, `Kpi`, and `Pipeline` types
- [Stores](/sdlc-sample-worflow/backend/store/) — in-memory and [PostgreSQL](/sdlc-sample-worflow/backend/postgresstore/) implementations
- [CI/CD integration](/sdlc-sample-worflow/backend/integrations/cicd/) — mock and GitHub Actions providers
- [Database](/sdlc-sample-worflow/backend/db/overview/) — [schema](/sdlc-sample-worflow/backend/db/schema/) and [setup](/sdlc-sample-worflow/backend/db/setup/)

### Chat worker

- [Overview](/sdlc-sample-worflow/chat-worker/overview/) — "Ask the docs" chatbot architecture
- [Worker (src/index.js)](/sdlc-sample-worflow/chat-worker/index/) — request handler, keyword search, Anthropic API call
