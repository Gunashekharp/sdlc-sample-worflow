/*
 * Headline metrics shown in the KPI strip.
 * `positive` indicates whether the delta is a good outcome, independent of
 * its sign — e.g. a falling time-to-merge is positive.
 * `trend` is a 7-point series (oldest first) rendered as a sparkline.
 */

export interface Kpi {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean
  hint: string
  trend: number[]
}

export const KPIS: Kpi[] = [
  {
    id: 'agent-runs',
    label: 'Agent runs · 7d',
    value: '1,284',
    delta: '+18%',
    positive: true,
    hint: 'Total agent executions in the last 7 days.',
    trend: [980, 1010, 1060, 1040, 1120, 1180, 1284],
  },
  {
    id: 'prs-reviewed',
    label: 'PRs reviewed',
    value: '342',
    delta: '+9%',
    positive: true,
    hint: 'Pull requests reviewed by agents this week.',
    trend: [290, 300, 285, 310, 320, 330, 342],
  },
  {
    id: 'time-to-merge',
    label: 'Mean time to merge',
    value: '4h 12m',
    delta: '-22%',
    positive: true,
    hint: 'Average time from PR open to merge.',
    trend: [340, 330, 318, 300, 285, 270, 252],
  },
  {
    id: 'suite-pass-rate',
    label: 'Suite pass rate',
    value: '97.4%',
    delta: '+0.6%',
    positive: true,
    hint: 'Share of CI runs passing on the first attempt.',
    trend: [96.2, 96.5, 96.8, 96.6, 97.0, 97.1, 97.4],
  },
]
