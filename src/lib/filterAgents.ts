import type { Agent } from '../data/agents'

export interface AgentFilter {
  /** Free-text query matched against agent name and description. */
  query: string
  /** 'All', 'Popular', or one of the AgentCategory values. */
  category: string
}

/**
 * Filter the agent list by category and free-text query.
 * Pure and side-effect free so it can be unit tested directly.
 */
export function filterAgents(agents: Agent[], filter: AgentFilter): Agent[] {
  const query = filter.query.trim().toLowerCase()

  return agents.filter((agent) => {
    const matchesCategory =
      filter.category === 'All' ||
      (filter.category === 'Popular'
        ? agent.popular
        : agent.category === filter.category)

    if (!matchesCategory) return false
    if (!query) return true

    return (
      agent.name.toLowerCase().includes(query) ||
      agent.description.toLowerCase().includes(query)
    )
  })
}
