---
title: REST API reference
---

Full reference for all REST endpoints exposed by the Snabbit API server. All routes are registered in `server/src/routes.ts`. All request bodies and responses use JSON.

**Base URL (local development):** `http://localhost:3001`

## Common conventions

- All endpoints return `Content-Type: application/json`.
- On success, status codes are `200`.
- On client error (unknown resource), status code is `404`.
- On server error (unhandled exception), status code is `500`.
- Error responses always use the shape `{ "error": "<message>" }`.
- No authentication is required.
- No request bodies are used (all endpoints are `GET`).

## Endpoint overview

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Liveness probe |
| `GET` | `/api/agents` | Full agent catalogue |
| `GET` | `/api/agents/:id` | Single agent by ID |
| `GET` | `/api/kpis` | KPI list |
| `GET` | `/api/pipelines` | CI/CD pipelines and summary |

## `GET /api/health`

Returns a liveness confirmation with the current server time. No database or CI/CD calls are made.

**Request:**
```
GET /api/health HTTP/1.1
Host: localhost:3001
```

**Response — 200 OK:**
```json
{
  "status": "ok",
  "time": "2026-05-24T10:00:00.000Z"
}
```

| Field | Type | Description |
|---|---|---|
| `status` | `string` | Always `"ok"` |
| `time` | `string` | ISO 8601 UTC timestamp generated at request time |

## `GET /api/agents`

Returns the complete agent catalogue as an array. When using the Postgres store, results are ordered by `runs_per_week DESC`.

**Request:**
```
GET /api/agents HTTP/1.1
Host: localhost:3001
```

**Response — 200 OK:**
```json
[
  {
    "id": "alert-triage",
    "name": "Alert Triage",
    "category": "Reliability",
    "description": "Triages incoming alerts and routes them to the right responder.",
    "status": "running",
    "runsPerWeek": 410,
    "successRate": 94,
    "avgDuration": "1m 12s",
    "lastRun": "2m ago",
    "lastRunMinutes": 2,
    "popular": true
  }
]
```

**`Agent` shape:**

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Stable kebab-case slug |
| `name` | `string` | Display name |
| `category` | `string` | One of: `"Review"`, `"Deploy"`, `"Reliability"`, `"Quality"`, `"Docs"` |
| `description` | `string` | One-sentence summary |
| `status` | `string` | One of: `"running"`, `"idle"`, `"attention"` |
| `runsPerWeek` | `number` | Weekly execution count |
| `successRate` | `number` | Success percentage (0–100) |
| `avgDuration` | `string` | Human-readable average duration |
| `lastRun` | `string` | Human-readable recency label |
| `lastRunMinutes` | `number` | Numeric minutes since last run |
| `popular` | `boolean` | Whether the agent appears in the popular tab |

**Status codes:**

| Code | Condition |
|---|---|
| `200` | Always — even for an empty catalogue |
| `500` | Database query failed |

## `GET /api/agents/:id`

Returns a single agent by its `id` path segment.

**Request:**
```
GET /api/agents/pr-reviewer HTTP/1.1
Host: localhost:3001
```

**Response — 200 OK:**
```json
{
  "id": "pr-reviewer",
  "name": "PR Reviewer",
  "category": "Review",
  "description": "Reviews pull requests for correctness, style, and security.",
  "status": "running",
  "runsPerWeek": 342,
  "successRate": 96,
  "avgDuration": "2m 40s",
  "lastRun": "3m ago",
  "lastRunMinutes": 3,
  "popular": true
}
```

**Response — 404 Not Found:**
```json
{ "error": "Agent not found" }
```

**Status codes:**

| Code | Condition |
|---|---|
| `200` | Agent with the given ID exists |
| `404` | No agent matches the given ID |
| `500` | Database query failed |

## `GET /api/kpis`

Returns the KPI list as an array. When using the Postgres store, results are ordered by `sort_order ASC` (the display order defined at seeding time).

**Request:**
```
GET /api/kpis HTTP/1.1
Host: localhost:3001
```

**Response — 200 OK:**
```json
[
  {
    "id": "agent-runs",
    "label": "Agent runs · 7d",
    "value": "1,284",
    "delta": "+18%",
    "positive": true,
    "hint": "vs prev 7 days",
    "trend": [980, 1020, 1050, 1100, 1180, 1240, 1284]
  },
  {
    "id": "prs-reviewed",
    "label": "PRs reviewed",
    "value": "342",
    "delta": "+9%",
    "positive": true,
    "hint": "vs prev 7 days",
    "trend": [290, 298, 305, 315, 325, 334, 342]
  },
  {
    "id": "time-to-merge",
    "label": "Mean time to merge",
    "value": "4h 12m",
    "delta": "-22%",
    "positive": true,
    "hint": "vs prev 7 days",
    "trend": [340, 325, 310, 295, 275, 260, 252]
  },
  {
    "id": "suite-pass-rate",
    "label": "Suite pass rate",
    "value": "97.4%",
    "delta": "+0.6%",
    "positive": true,
    "hint": "last 7 days",
    "trend": [96.2, 96.4, 96.7, 96.9, 97.1, 97.3, 97.4]
  }
]
```

**`Kpi` shape:**

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Stable identifier |
| `label` | `string` | Metric display name |
| `value` | `string` | Pre-formatted current value |
| `delta` | `string` | Pre-formatted period change (may be positive or negative) |
| `positive` | `boolean` | `true` if the delta is a favorable outcome |
| `hint` | `string` | Sub-label shown beneath the sparkline |
| `trend` | `number[]` | Seven-point numeric series for the sparkline chart |

**Status codes:**

| Code | Condition |
|---|---|
| `200` | Always — even for an empty list |
| `500` | Database query failed |

## `GET /api/pipelines`

Fetches the current pipeline list from the configured CI/CD provider and returns it alongside a precomputed summary. The `passRate` in the summary is calculated over finished (passing + failing) pipelines only — running pipelines are excluded from the denominator.

**Request:**
```
GET /api/pipelines HTTP/1.1
Host: localhost:3001
```

**Response — 200 OK:**
```json
{
  "provider": "mock",
  "summary": {
    "total": 8,
    "passing": 4,
    "failing": 2,
    "running": 2,
    "passRate": 67
  },
  "pipelines": [
    {
      "id": "p-1041",
      "name": "CI · build & test",
      "provider": "github-actions",
      "branch": "main",
      "status": "passing",
      "durationSeconds": 184,
      "triggeredBy": "a.kapoor",
      "updatedAt": "2026-05-24T09:54:00.000Z"
    },
    {
      "id": "p-1040",
      "name": "E2E suite",
      "provider": "github-actions",
      "branch": "main",
      "status": "running",
      "durationSeconds": 312,
      "triggeredBy": "m.osei",
      "updatedAt": "2026-05-24T09:52:00.000Z"
    }
  ]
}
```

**Response shape:**

| Field | Type | Description |
|---|---|---|
| `provider` | `string` | Active provider name: `"mock"` or `"github-actions"` |
| `summary.total` | `number` | Total number of pipelines returned |
| `summary.passing` | `number` | Count of pipelines with `status === "passing"` |
| `summary.failing` | `number` | Count of pipelines with `status === "failing"` |
| `summary.running` | `number` | Count of pipelines with `status === "running"` |
| `summary.passRate` | `number` | `round(passing / (passing + failing) × 100)`; `0` if no finished pipelines |
| `pipelines` | `Pipeline[]` | Full pipeline list |

**`Pipeline` shape:**

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique run identifier |
| `name` | `string` | Workflow or pipeline display name |
| `provider` | `string` | `"github-actions"` or `"jenkins"` |
| `branch` | `string` | Git branch the run was triggered on |
| `status` | `string` | `"passing"`, `"failing"`, or `"running"` |
| `durationSeconds` | `number` | Elapsed or final run time in seconds |
| `triggeredBy` | `string` | Actor login or system name |
| `updatedAt` | `string` | ISO 8601 timestamp of last update |

**Status codes:**

| Code | Condition |
|---|---|
| `200` | CI/CD provider responded successfully |
| `500` | GitHub API returned a non-200 status, or network error |

## Error response shape

All error responses use a consistent envelope:

```json
{ "error": "<human-readable message>" }
```

Known error messages:

| Message | Status | Cause |
|---|---|---|
| `"Agent not found"` | `404` | `GET /api/agents/:id` with an unknown ID |
| `"Internal server error"` | `500` | Unhandled exception in any route handler |
