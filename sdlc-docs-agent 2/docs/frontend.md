# Frontend

The frontend is the Snabbit Agent Console dashboard. It lives at the repository
root.

## Stack

- Vite
- React 19
- TypeScript
- Tailwind CSS v4

## Layout

| Folder            | Contents                          |
| ----------------- | --------------------------------- |
| `src/components/` | UI components and their tests     |
| `src/lib/`        | Pure logic, the API client, hooks |
| `src/data/`       | Local seed data and types         |

## Data sources

The CI/CD pipelines panel reads live data from the backend. The agent grid and
the KPIs currently use local seed data from `src/data/`.

## Tests

The frontend has 49 tests using Vitest and React Testing Library. Run them with
`npm test`.
