# API reference

The backend exposes a small, read-only REST API. All routes are registered in
`server/src/routes.ts`. Responses are JSON.

!!! note "Base URL"
    The API runs on `http://localhost:3001` in local development (`PORT`
    overrides it). CORS is enabled, so the Vite dev server on port 5173 can call
    it cross-origin.

## Endpoints

| Method & path         | Description                                  |
| --------------------- | -------------------------------------------- |
| `GET /api/health`     | Liveness check.                              |
| `GET /api/agents`     | Full agent catalogue.                        |
| `GET /api/agents/:id` | A single agent (404 if unknown).             |
| `GET /api/kpis`       | KPI list.                                    |
| `GET /api/pipelines`  | CI/CD pipelines and summary, via the adapter.|

---

## `GET /api/health`

Liveness probe. Always `200`.

```json
{ "status": "ok", "time": "2026-05-21T12:00:00.000Z" }
```

`time` is the server's current time as an ISO 8601 string.

---

## `GET /api/agents`

Returns the full agent catalogue. From the Postgres store the list is ordered by
`runs_per_week DESC`. Each element is an `Agent`:

```json
[
  {
    "id": "alert-triage",
    "name": "Alert Triage",
    "category": "Reliability",
    "description": "Triages PagerDuty and Datadog alerts, dedupes noise, and routes each to the right owner.",
    "status": "running",
    "runsPerWeek": 410,
    "successRate": 94,
    "avgDuration": "0m 45s",
    "lastRun": "just now",
    "lastRunMinutes": 0,
    "popular": true
  }
]
```

| Field            | Type                                                      |
| ---------------- | -------------------------------------------------------- |
| `id`             | `string`                                                 |
| `name`           | `string`                                                 |
| `category`       | `'Review' \| 'Deploy' \| 'Reliability' \| 'Quality' \| 'Docs'` |
| `description`    | `string`                                                 |
| `status`         | `'running' \| 'idle' \| 'attention'`                     |
| `runsPerWeek`    | `number`                                                 |
| `successRate`    | `number` (0–100)                                         |
| `avgDuration`    | `string` (human-readable)                                |
| `lastRun`        | `string` (human-readable)                                |
| `lastRunMinutes` | `number`                                                 |
| `popular`        | `boolean`                                                |

---

## `GET /api/agents/:id`

Returns one `Agent` by `id`, or `404` if no agent matches.

=== "200 OK"

    ```json
    {
      "id": "pr-reviewer",
      "name": "PR Reviewer",
      "category": "Review",
      "status": "running",
      "runsPerWeek": 342,
      "successRate": 96,
      "...": "…"
    }
    ```

=== "404 Not Found"

    ```json
    { "error": "Agent not found" }
    ```

---

## `GET /api/kpis`

Returns the KPI list (Postgres store orders by `sort_order ASC`). Each element is
a `Kpi`:

```json
[
  {
    "id": "agent-runs",
    "label": "Agent runs · 7d",
    "value": "1,284",
    "delta": "+18%",
    "positive": true,
    "hint": "Total agent executions in the last 7 days.",
    "trend": [980, 1010, 1060, 1040, 1120, 1180, 1284]
  }
]
```

| Field      | Type       | Notes                                              |
| ---------- | ---------- | -------------------------------------------------- |
| `id`       | `string`   |                                                    |
| `label`    | `string`   |                                                    |
| `value`    | `string`   | Pre-formatted display value.                       |
| `delta`    | `string`   | e.g. `"+18%"`, `"-22%"`.                            |
| `positive` | `boolean`  | Whether the delta is a good outcome, ignoring sign.|
| `hint`     | `string`   |                                                    |
| `trend`    | `number[]` | 7-point series, oldest first.                      |

---

## `GET /api/pipelines`

Returns CI/CD pipelines plus an aggregate summary, sourced from the active
[CI/CD provider](backend/cicd-integration.md). `provider` is `"mock"` by default
or `"github-actions"` when credentials are configured.

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
      "updatedAt": "2026-05-21T11:54:00.000Z"
    }
  ]
}
```

**`summary`** (`PipelineSummary`):

| Field      | Type     | Notes                                              |
| ---------- | -------- | -------------------------------------------------- |
| `total`    | `number` | Pipeline count.                                    |
| `passing`  | `number` |                                                    |
| `failing`  | `number` |                                                    |
| `running`  | `number` |                                                    |
| `passRate` | `number` | 0–100, over **finished** (passing+failing) only.   |

**`pipelines[]`** (`Pipeline`):

| Field             | Type                                  |
| ----------------- | ------------------------------------- |
| `id`              | `string`                              |
| `name`            | `string`                              |
| `provider`        | `'github-actions' \| 'jenkins'`       |
| `branch`          | `string`                              |
| `status`          | `'passing' \| 'failing' \| 'running'` |
| `durationSeconds` | `number`                              |
| `triggeredBy`     | `string`                              |
| `updatedAt`       | `string` (ISO 8601)                   |

!!! note "Example values are illustrative"
    The mock provider's timestamps are generated relative to "now" at request
    time, and `summary` counts reflect whatever the active provider returns.

---

## Errors

Any unhandled error in a route is caught by the app's error handler
([`app.ts`](backend/app-and-routes.md)) and returned as:

```json
{ "error": "Internal server error" }
```

with HTTP `500`. The only route-level error today is the `404` from
`GET /api/agents/:id` for an unknown id.
