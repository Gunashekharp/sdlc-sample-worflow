# Frontend testing

The frontend suite uses **Vitest** with **React Testing Library** in a **jsdom**
environment. Run it with `npm test` (single run) or `npm run test:watch`.

## Configuration

From `vite.config.ts`:

```ts
test: {
  environment: 'jsdom',
  globals: true,                 // describe/it/expect available without import
  setupFiles: './src/test/setup.ts',
  css: true,                     // process CSS in tests
}
```

`src/test/setup.ts` imports `@testing-library/jest-dom` for the extended matchers
and clears `localStorage` in an `afterEach` so persisted UI state cannot leak
between cases:

```ts
import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
afterEach(() => { localStorage.clear() })
```

## Suite at a glance

37 tests across 7 files:

| File                                  | Tests | Focus                                                |
| ------------------------------------- | ----: | ---------------------------------------------------- |
| `src/App.test.tsx`                    | 4     | Top-level composition renders the key sections       |
| `src/components/AgentGrid.test.tsx`   | 7     | Filtering, category tabs, sorting, selection, persistence |
| `src/components/PipelinesPanel.test.tsx` | 2  | Live data render and the API-unreachable error state |
| `src/components/Sparkline.test.tsx`   | 3     | Coordinate count, sub-two-point guard, error color   |
| `src/data/agents.test.ts`             | 6     | Catalogue invariants                                 |
| `src/lib/filterAgents.test.ts`        | 10    | Every branch of the filter                           |
| `src/lib/sortAgents.test.ts`          | 5     | Every sort key + non-mutation                        |

## Notable patterns

### Stubbing `fetch`

Both `App.test.tsx` and `PipelinesPanel.test.tsx` stub the global `fetch`
because `PipelinesPanel` fetches on mount. `App.test.tsx` returns an empty
pipelines payload to keep the render hermetic; `PipelinesPanel.test.tsx` returns
a two-pipeline sample for the happy path and a rejected promise to assert the
"Could not reach the API" error state. Each restores globals in an `afterEach`
via `vi.unstubAllGlobals()`.

### Persistence across remounts

`AgentGrid.test.tsx` verifies that selecting the "Deploy" category, unmounting,
and re-rendering restores the selection — exercising
[`usePersistentState`](lib.md#usepersistentstate) end to end against the jsdom
`localStorage`.

### Pure-logic tests

`filterAgents` and `sortAgents` are tested directly with hand-built `Agent`
fixtures (via a local `make()` partial-override helper) — no rendering required.
The agent-catalogue tests assert structural invariants: non-empty, unique ids,
the featured agent is present, only known categories, success rates within
0–100, and non-empty names/descriptions.
