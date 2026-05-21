import type { Agent, Kpi } from './domain'

/** Read access to the agent catalogue. */
export interface AgentStore {
  listAgents(): Promise<Agent[]>
  getAgent(id: string): Promise<Agent | null>
}

/** Read access to the KPI list. */
export interface KpiStore {
  listKpis(): Promise<Kpi[]>
}

export type Store = AgentStore & KpiStore

/**
 * In-memory store. Used by the test suite (so `npm test` needs no database)
 * and as a fallback for quick local runs.
 */
export function createMemoryStore(agents: Agent[], kpis: Kpi[]): Store {
  return {
    async listAgents() {
      return [...agents]
    },
    async getAgent(id: string) {
      return agents.find((a) => a.id === id) ?? null
    },
    async listKpis() {
      return [...kpis]
    },
  }
}
