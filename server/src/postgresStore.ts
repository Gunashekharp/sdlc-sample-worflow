import type { Pool } from 'pg'
import type { Agent, AgentCategory, AgentStatus, Kpi } from './domain'
import type { Store } from './store'

interface AgentRow {
  id: string
  name: string
  category: string
  description: string
  status: string
  runs_per_week: number
  success_rate: number
  avg_duration: string
  last_run: string
  last_run_minutes: number
  popular: boolean
}

interface KpiRow {
  id: string
  label: string
  value: string
  delta: string
  positive: boolean
  hint: string
  trend: number[]
}

function rowToAgent(row: AgentRow): Agent {
  return {
    id: row.id,
    name: row.name,
    category: row.category as AgentCategory,
    description: row.description,
    status: row.status as AgentStatus,
    runsPerWeek: row.runs_per_week,
    successRate: row.success_rate,
    avgDuration: row.avg_duration,
    lastRun: row.last_run,
    lastRunMinutes: row.last_run_minutes,
    popular: row.popular,
  }
}

function rowToKpi(row: KpiRow): Kpi {
  return {
    id: row.id,
    label: row.label,
    value: row.value,
    delta: row.delta,
    positive: row.positive,
    hint: row.hint,
    trend: row.trend,
  }
}

/** Postgres-backed store. Used by the running server. */
export function createPostgresStore(pool: Pool): Store {
  return {
    async listAgents() {
      const { rows } = await pool.query(
        'SELECT * FROM agents ORDER BY runs_per_week DESC',
      )
      return (rows as AgentRow[]).map(rowToAgent)
    },
    async getAgent(id: string) {
      const { rows } = await pool.query('SELECT * FROM agents WHERE id = $1', [
        id,
      ])
      const row = rows[0] as AgentRow | undefined
      return row ? rowToAgent(row) : null
    },
    async listKpis() {
      const { rows } = await pool.query(
        'SELECT * FROM kpis ORDER BY sort_order ASC',
      )
      return (rows as KpiRow[]).map(rowToKpi)
    },
  }
}
