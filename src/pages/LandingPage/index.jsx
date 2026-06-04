import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { incidentsApi } from '@/services/api/incidentsApi'
import { fmt } from '@/utils/formatters'
import { INCIDENT_STATES } from '@/config/incidentStates'

export default function LandingPage() {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [creating,  setCreating]  = useState(false)

  useEffect(() => {
    incidentsApi.list({ active: true })
      .then(data => setIncidents(data.incidents ?? []))
      .finally(() => setLoading(false))
  }, [])

  async function handleNew() {
    setCreating(true)
    try {
      const incident = await incidentsApi.create({ title: 'New Incident', severity: 'P1' })
      navigate(`/incident/${incident.id}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="h-14 flex items-center px-8 border-b border-surface-border">
        <span className="text-base font-bold tracking-tight text-slate-100">ClauseTrace</span>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-100">Active Incidents</h1>
          <button
            onClick={handleNew}
            disabled={creating}
            className="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50"
          >
            {creating ? 'Creating…' : '+ New Incident'}
          </button>
        </div>

        {loading && (
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-14 rounded bg-surface-raised animate-pulse" />)}
          </div>
        )}

        {!loading && incidents.length === 0 && (
          <p className="text-slate-500 text-sm">No active incidents.</p>
        )}

        <ul className="space-y-2">
          {incidents.map(inc => (
            <li key={inc.id}>
              <button
                onClick={() => navigate(`/incident/${inc.id}`)}
                className="w-full text-left p-4 rounded-xl border border-surface-border bg-surface-raised hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-200">{inc.title}</span>
                  <span className={`text-xs font-medium ${INCIDENT_STATES[inc.state]?.colorClass}`}>
                    {INCIDENT_STATES[inc.state]?.label}
                  </span>
                </div>
                <div className="flex gap-3 mt-1 text-xs text-slate-500">
                  <span className="font-mono">{inc.id}</span>
                  <span>·</span>
                  <span>{fmt.relative(inc.since)}</span>
                  <span>·</span>
                  <span className="text-red-400">{inc.severity}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className="pt-4 border-t border-surface-border">
          <a href="/history" className="text-sm text-blue-400 hover:text-blue-300">
            View incident history →
          </a>
        </div>
      </main>
    </div>
  )
}
