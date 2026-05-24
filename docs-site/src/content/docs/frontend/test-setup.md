---
title: Test setup — src/test/setup.ts
---

**File:** `src/test/setup.ts`

The Vitest setup module, run once before each test file. Provides two essential pieces of infrastructure: the `@testing-library/jest-dom` custom matchers, and per-test `localStorage` cleanup.

## Full source

```ts
import '@testing-library/jest-dom'
import { afterEach } from 'vitest'

afterEach(() => {
  localStorage.clear()
})
```

This file is registered in `vite.config.ts`:

```ts
test: {
  setupFiles: './src/test/setup.ts',
}
```

Vitest runs this module before each test file (not once globally). The `afterEach` callback registered here applies to every test case in every file that Vitest processes.

## `@testing-library/jest-dom`

```ts
import '@testing-library/jest-dom'
```

A side-effect import. `@testing-library/jest-dom` extends Vitest's `expect` function with custom matchers that are aware of the DOM structure. Without this import, assertions like `expect(el).toBeInTheDocument()` would throw `TypeError: toBeInTheDocument is not a function`.

### Available matchers

| Matcher | Example | What it asserts |
|---|---|---|
| `toBeInTheDocument()` | `expect(el).toBeInTheDocument()` | Element is present in the jsdom document |
| `not.toBeInTheDocument()` | `expect(el).not.toBeInTheDocument()` | Element has been removed from the document |
| `toHaveAttribute(attr, value?)` | `expect(btn).toHaveAttribute('aria-pressed', 'true')` | Element has the given attribute, optionally with a specific value |
| `toHaveTextContent(text)` | `expect(el).toHaveTextContent('PR Reviewer')` | Element's text content matches the string or regex |
| `toBeDisabled()` | `expect(btn).toBeDisabled()` | Form element is disabled |
| `toBeEnabled()` | `expect(btn).toBeEnabled()` | Form element is enabled |
| `toHaveFocus()` | `expect(input).toHaveFocus()` | Element currently has keyboard focus |
| `toBeVisible()` | `expect(el).toBeVisible()` | Element is visible (not hidden via CSS or `hidden` attribute) |
| `toHaveClass(...classes)` | `expect(el).toHaveClass('bg-accent')` | Element has all specified CSS classes |
| `toHaveValue(value)` | `expect(input).toHaveValue('deploy')` | Input, select, or textarea has the specified value |

These matchers are used throughout the test suite:

- `App.test.tsx` — `toBeInTheDocument()` for all four component presence checks
- `AgentCard.test.tsx` — `toHaveAttribute('aria-pressed', 'true')` for selected state
- `AgentGrid.test.tsx` — `toHaveAttribute('aria-pressed', 'true')` for category tab state; `toBeInTheDocument()` for filtered agent visibility

## `afterEach(() => localStorage.clear())`

```ts
afterEach(() => {
  localStorage.clear()
})
```

Clears all `localStorage` entries after every test case.

### Why this is necessary

`usePersistentState` writes to `localStorage` whenever its value changes:

```ts
useEffect(() => {
  localStorage.setItem(key, JSON.stringify(value))
}, [key, value])
```

`AgentGrid` uses `usePersistentState` for two pieces of state:

```ts
const [category, setCategory] = usePersistentState('snabbit.agentGrid.category', 'All')
const [sort, setSort]         = usePersistentState('snabbit.agentGrid.sort', 'runs')
```

Without `localStorage.clear()` between tests, a test that clicks the "Deploy" tab writes `'Deploy'` to `localStorage['snabbit.agentGrid.category']`. When the next test mounts a fresh `AgentGrid`, the lazy initializer in `usePersistentState` reads `'Deploy'` from `localStorage` and the component starts in the "Deploy" category — not the expected `'All'` default. This causes test results to depend on execution order, creating flaky, hard-to-diagnose failures.

### Concrete example

`AgentGrid.test.tsx` has a persistence test:

```ts
it('remembers the selected category across remounts', async () => {
  // Test A: clicks "Deploy" → writes 'Deploy' to localStorage
  await user.click(screen.getByRole('button', { name: 'Deploy' }))
  first.unmount()

  render(<AgentGrid agents={AGENTS} />)
  // Remounted grid reads 'Deploy' from localStorage
  expect(
    screen.getByRole('button', { name: 'Deploy' })
  ).toHaveAttribute('aria-pressed', 'true')
})
```

If `localStorage.clear()` were not called after this test, any subsequent test that renders `AgentGrid` would start with `category = 'Deploy'` instead of `'All'`, causing unexpected filter results.

### Why use a central setup file rather than per-file `beforeEach`

Centralising the cleanup in the setup file means every test file in the project automatically gets isolation — no opt-in is required. If individual files were responsible for clearing `localStorage`, a newly added test file would be easy to get wrong (forgetting to add the `beforeEach`), leading to intermittent failures that only appear when tests run in a certain order.

## Configured in

```ts
// vite.config.ts
test: {
  setupFiles: './src/test/setup.ts',
}
```

Vitest executes the setup file once per test module. The `afterEach` registered inside it is scoped to each individual test case within those modules — it runs after every `it(...)` or `test(...)` block, not once per file.
