import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

export const repoRoot = path.resolve(here, '..', '..')

export interface SourceRoot {
  /** Display name used as the section title. */
  name: string
  /** Path relative to repoRoot to walk for source files. */
  sourceDir: string
  /** Path relative to repoRoot for the tsconfig used to parse this tree. */
  tsConfig?: string
  /** Output subdirectory under docsContentRoot. */
  outDir: string
  /** Short blurb used at the top of `<outDir>/overview.md`. */
  blurb: string
}

export const sourceRoots: SourceRoot[] = [
  {
    name: 'frontend',
    sourceDir: 'src',
    tsConfig: 'tsconfig.app.json',
    outDir: 'frontend',
    blurb: 'React + Vite single-page application. Renders the Agent Console dashboard.',
  },
  {
    name: 'backend',
    sourceDir: 'server/src',
    tsConfig: 'server/tsconfig.json',
    outDir: 'backend',
    blurb: 'Express + TypeScript API server. Serves agent, KPI, and pipeline data.',
  },
  {
    name: 'chat-worker',
    sourceDir: 'chat-worker/src',
    outDir: 'chat-worker',
    blurb: 'Cloudflare Worker that answers questions about the docs via an indexed corpus.',
  },
]

/** Output target. Phase-2 writes directly into the live docs site. */
export const docsContentRoot = path.resolve(repoRoot, 'docs-site', 'src', 'content', 'docs')

/**
 * Hand-curated pages that must NEVER be touched by the docs agent.
 * Paths are relative to docsContentRoot.
 */
export const preserveFiles = [
  'index.md',
  'getting-started.md',
  'testing.md',
  'architecture.md',
]

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

/**
 * Maximum number of statements walked per function body in the
 * line-by-line section. Functions longer than this collapse to a single
 * "see source appendix" pointer to keep pages readable.
 */
export const maxStatementsPerFunction = 40
