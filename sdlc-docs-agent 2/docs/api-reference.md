# API reference

The backend exposes a small REST API.

| Endpoint              | Description                                  |
| --------------------- | -------------------------------------------- |
| `GET /api/health`     | Liveness check                               |
| `GET /api/agents`     | Full agent catalogue                         |
| `GET /api/agents/:id` | A single agent (404 if unknown)              |
| `GET /api/kpis`       | KPI list                                     |
| `GET /api/pipelines`  | CI/CD pipelines and summary, via the adapter |

!!! note
    The API runs on `http://localhost:3001` in local development.
