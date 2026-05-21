import '@testing-library/jest-dom'
import { afterEach } from 'vitest'

// Keep tests isolated — persisted UI state must not leak between cases.
afterEach(() => {
  localStorage.clear()
})
