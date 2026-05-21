import type { Agent } from '../data/agents'

export type SortKey = 'runs' | 'success' | 'name' | 'recent'

/** Display labels for each sort key, in menu order. */
export const SORT_LABELS: Record<SortKey, string> = {
  runs: 'Most runs',
  success: 'Success rate',
  name: 'Name (A–Z)',
  recent: 'Recently run',
}

/**
 * Return a new array of agents sorted by the given key.
 * Pure — does not mutate the input array.
 */
export function sortAgents(agents: Agent[], key: SortKey): Agent[] {
  const copy = [...agents]
  switch (key) {
    case 'runs':
      return copy.sort((a, b) => b.runsPerWeek - a.runsPerWeek)
    case 'success':
      return copy.sort((a, b) => b.successRate - a.successRate)
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'recent':
      return copy.sort((a, b) => a.lastRunMinutes - b.lastRunMinutes)
  }
}
