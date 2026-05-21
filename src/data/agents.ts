/*
 * SDLC agent catalogue for the Snabbit Agent Console.
 * Static seed data — a real deployment would load this from the backend.
 */

export type AgentStatus = 'running' | 'idle' | 'attention'

export type AgentCategory = 'Review' | 'Deploy' | 'Reliability' | 'Quality' | 'Docs'

export interface Agent {
  id: string
  name: string
  category: AgentCategory
  description: string
  status: AgentStatus
  /** Approximate runs over the last 7 days. */
  runsPerWeek: number
  /** Successful-run percentage, 0–100. */
  successRate: number
  /** Human-readable average run duration. */
  avgDuration: string
  /** Human-readable time since the last run. */
  lastRun: string
  /** Minutes since the last run — orderable companion to `lastRun`. */
  lastRunMinutes: number
  /** Whether the agent appears under the "Popular" filter. */
  popular: boolean
}

export const AGENTS: Agent[] = [
  {
    id: 'pr-reviewer',
    name: 'PR Reviewer',
    category: 'Review',
    description:
      'Reviews open pull requests for correctness, security, and style, and leaves inline comments before merge.',
    status: 'running',
    runsPerWeek: 342,
    successRate: 96,
    avgDuration: '2m 40s',
    lastRun: '3m ago',
    lastRunMinutes: 3,
    popular: true,
  },
  {
    id: 'deploy-bot',
    name: 'Deploy Bot',
    category: 'Deploy',
    description:
      'Ships approved changes to staging and production with health checks and automated rollback on failure.',
    status: 'idle',
    runsPerWeek: 57,
    successRate: 99,
    avgDuration: '6m 10s',
    lastRun: '1h ago',
    lastRunMinutes: 60,
    popular: true,
  },
  {
    id: 'rca-analyst',
    name: 'RCA Analyst',
    category: 'Reliability',
    description:
      'Investigates incidents and drafts a root-cause analysis from logs, traces, and recent deploys.',
    status: 'attention',
    runsPerWeek: 14,
    successRate: 88,
    avgDuration: '8m 30s',
    lastRun: '22m ago',
    lastRunMinutes: 22,
    popular: false,
  },
  {
    id: 'alert-triage',
    name: 'Alert Triage',
    category: 'Reliability',
    description:
      'Triages PagerDuty and Datadog alerts, dedupes noise, and routes each to the right owner.',
    status: 'running',
    runsPerWeek: 410,
    successRate: 94,
    avgDuration: '0m 45s',
    lastRun: 'just now',
    lastRunMinutes: 0,
    popular: true,
  },
  {
    id: 'changelog-author',
    name: 'Changelog Author',
    category: 'Docs',
    description:
      'Generates release notes and changelog entries from merged pull requests and linked issues.',
    status: 'idle',
    runsPerWeek: 38,
    successRate: 99,
    avgDuration: '1m 20s',
    lastRun: '5h ago',
    lastRunMinutes: 300,
    popular: false,
  },
  {
    id: 'e2e-verifier',
    name: 'E2E Verifier',
    category: 'Quality',
    description:
      'Runs Playwright end-to-end suites against preview deploys and reports failures and flakes.',
    status: 'running',
    runsPerWeek: 122,
    successRate: 91,
    avgDuration: '11m 05s',
    lastRun: '8m ago',
    lastRunMinutes: 8,
    popular: true,
  },
  {
    id: 'flaky-test-hunter',
    name: 'Flaky Test Hunter',
    category: 'Quality',
    description:
      'Detects flaky tests across CI history, quarantines them, and opens a tracking issue.',
    status: 'idle',
    runsPerWeek: 26,
    successRate: 93,
    avgDuration: '4m 15s',
    lastRun: '1d ago',
    lastRunMinutes: 1440,
    popular: false,
  },
  {
    id: 'migration-reviewer',
    name: 'Migration Reviewer',
    category: 'Review',
    description:
      'Checks database migrations for lock risk, missing backfills, and reversibility before merge.',
    status: 'idle',
    runsPerWeek: 19,
    successRate: 97,
    avgDuration: '3m 50s',
    lastRun: '6h ago',
    lastRunMinutes: 360,
    popular: false,
  },
  {
    id: 'dependency-bot',
    name: 'Dependency Bot',
    category: 'Quality',
    description:
      'Opens dependency-upgrade pull requests, runs the full suite, and validates the diff.',
    status: 'idle',
    runsPerWeek: 64,
    successRate: 95,
    avgDuration: '5m 30s',
    lastRun: '3h ago',
    lastRunMinutes: 180,
    popular: true,
  },
  {
    id: 'oncall-digest',
    name: 'On-call Digest',
    category: 'Reliability',
    description:
      'Summarizes the overnight on-call shift: alerts fired, deploys shipped, and incidents opened.',
    status: 'idle',
    runsPerWeek: 7,
    successRate: 100,
    avgDuration: '2m 00s',
    lastRun: '9h ago',
    lastRunMinutes: 540,
    popular: false,
  },
  {
    id: 'spec-author',
    name: 'Spec Author',
    category: 'Docs',
    description:
      'Drafts technical specs and architecture decision records from a short natural-language prompt.',
    status: 'idle',
    runsPerWeek: 31,
    successRate: 98,
    avgDuration: '1m 45s',
    lastRun: '2h ago',
    lastRunMinutes: 120,
    popular: false,
  },
  {
    id: 'coverage-guard',
    name: 'Coverage Guard',
    category: 'Quality',
    description:
      'Blocks pull requests that drop test coverage below the configured threshold.',
    status: 'running',
    runsPerWeek: 88,
    successRate: 92,
    avgDuration: '0m 55s',
    lastRun: '12m ago',
    lastRunMinutes: 12,
    popular: false,
  },
]

/** The agent surfaced in the featured slot at the top of the console. */
export const FEATURED_AGENT_ID = 'pr-reviewer'

export const AGENT_CATEGORIES: AgentCategory[] = [
  'Review',
  'Deploy',
  'Reliability',
  'Quality',
  'Docs',
]
