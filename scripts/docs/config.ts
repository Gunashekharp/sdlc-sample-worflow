import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

export const repoRoot = path.resolve(here, '..', '..')

export interface SourceRoot {
  /** Display name used in the docs section / sidebar group. */
  name: string
  /** Path relative to repoRoot to walk for source files. */
  sourceDir: string
  /** Path relative to repoRoot for the tsconfig used to parse this tree. */
  tsConfig?: string
  /** Output subdirectory under outputRoot. */
  outDir: string
}

export const sourceRoots: SourceRoot[] = [
  {
    name: 'frontend',
    sourceDir: 'src',
    tsConfig: 'tsconfig.app.json',
    outDir: 'frontend',
  },
  {
    name: 'backend',
    sourceDir: 'server/src',
    tsConfig: 'server/tsconfig.json',
    outDir: 'backend',
  },
  {
    name: 'chat-worker',
    sourceDir: 'chat-worker/src',
    outDir: 'chat-worker',
  },
]

export const outputRoot = path.resolve(repoRoot, '_docs-out')

export const sourceFileGlobs = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.mjs']

export const ignorePatterns = [
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.ts',
  '**/*.spec.tsx',
  '**/*.d.ts',
  '**/__tests__/**',
  '**/test/setup.ts',
  '**/node_modules/**',
]

/** Files whose only job is to be a build/runtime config — skip from per-file docs. */
export const configFilePatterns = [
  'vite.config.ts',
  'vite-env.d.ts',
  'vitest.config.ts',
]
