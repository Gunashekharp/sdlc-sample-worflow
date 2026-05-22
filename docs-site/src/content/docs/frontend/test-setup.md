---
title: test/setup.ts
description: Vitest global setup — jest-dom matchers and localStorage isolation.
---

**File:** `src/test/setup.ts`

The Vitest setup module, run once before each test file. Provides two essential
pieces of infrastructure: the `@testing-library/jest-dom` custom matchers and
per-test `localStorage` cleanup.

## Full source

```ts
import '@testing-library/jest-dom'
import { afterEach } from 'vitest'

afterEach(() => {
  localStorage.clear()
})
```

## `@testing-library/jest-dom` import

```ts
import '@testing-library/jest-dom'
```

A side-effect import that extends Vitest's `expect` with DOM-aware matchers:

| Matcher | Example assertion |
|---------|------------------|
| `toBeInTheDocument()` | `expect(el).toBeInTheDocument()` |
| `toHaveAttribute(attr, val)` | `expect(btn).toHaveAttribute('aria-pressed', 'true')` |
| `toHaveTextContent(text)` | `expect(el).toHaveTextContent('PR Reviewer')` |
| `toBeDisabled()` | `expect(btn).toBeDisabled()` |
| `toHaveFocus()` | `expect(input).toHaveFocus()` |

These matchers are used throughout the test suite:

- `AgentCard.test.tsx` — `toHaveAttribute('aria-pressed', ...)`
- `App.test.tsx` / all component tests — `toBeInTheDocument()`
- `AgentGrid.test.tsx` — `toHaveAttribute('aria-pressed', 'true')` (selection state)

Without this import, `expect(el).toBeInTheDocument()` would throw
`TypeError: toBeInTheDocument is not a function`.

## `afterEach` localStorage cleanup

```ts
afterEach(() => {
  localStorage.clear()
})
```

Clears `localStorage` after every test case. This is necessary because
`usePersistentState` writes to `localStorage` when state changes. Without
cleanup, one test's persisted `category` or `sort` value would leak into the
next test's initial render, causing flaky, order-dependent failures.

The `AgentGrid.test.tsx` test suite demonstrates the dependency:

```ts
it('remembers the selected category across remounts', async () => {
  // Writes 'Deploy' to localStorage under 'snabbit.agentGrid.category'
  await user.click(screen.getByRole('button', { name: 'Deploy' }))
  first.unmount()

  render(<AgentGrid agents={AGENTS} />)
  // Reads from localStorage — must be 'Deploy', not whatever a previous test wrote
  expect(screen.getByRole('button', { name: 'Deploy' })).toHaveAttribute(
    'aria-pressed', 'true',
  )
})
```

If `localStorage.clear()` were not called between tests, this assertion might
read a value written by a different test and pass for the wrong reason — or
another test might see a stale value and fail unexpectedly.

## Why a setup file, not `beforeEach` in each test?

Centralising the cleanup in a setup file means every test file in the suite
automatically gets isolation without opt-in. Adding `beforeEach(localStorage.clear)`
to individual test files would be easy to forget and create inconsistency.

## Configured in

`vite.config.ts`:

```ts
test: {
  setupFiles: './src/test/setup.ts',
}
```

Vitest runs this file once before each test module (not once per `it` block —
the `afterEach` registered here is scoped to each test block within the module).
