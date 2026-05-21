import { defineConfig } from 'vitest/config'

// Own config so the server suite does not inherit the frontend's
// jsdom environment or setup files.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
