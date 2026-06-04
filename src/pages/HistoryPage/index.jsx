import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { incidentsApi } from '@/services/api/incidentsApi'
import { INCIDENT_STATES } from '@/config/incidentStates'
import { fmt } from '@/utils/formatters'

const SEVERITY_OPTIONS = ['All', 'P1', 'P2', 'P3']

export default function HistoryPage() {
  const navigate  = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [loading,   setLoading]   = useState(false)
  const [query,     setQuery]     = useState('')
  const [severity,  setSeverity]  = useState('All')
  const [page,      setPage]      = useState(1)
  const [hasMore,   setHasMore]   = useState(false)

  const load = useCallback(async (reset = false) => {
    setLoading(true)
    const p = reset ? 1 : page
    const data = await incidentsApi.list({
      query:    query || undefined,
      severity: severity !== 'All' ? severity : undefined,
      page:     p,
      limit:    20,
    }).catch(() => ({ incidents: [], hasMore: false }))

    setIncidents(prev => reset ? data.incidents : [...prev, ...data.incidents])
    setHasMore(data.hasMore)
    if (!reset) setPage(p + 1)
    setLoading(false)
  }, [query, severity, page])

  useEffect(() => {
    setPage(1)
    load(true)
  }, [query, severity])

  return (
    <div className="min-h-screen bg-surface">
      <header className="h-14 flex items-center justify-between px-8 border-b border-surface-border">
        <Link to="/" className="text-base font-bold tracking-tight text-slate-100">ClauseTrace</Link>
        <span className="text-sm text-slate-500">Incident History</span>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Filters */}
        <div className="flex gap-3">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search incidents…"
            className="flex-1 px-3 py-2 text-sm rounded bg-surface-raised border border-surface-border text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-500"
          />
          <div className="flex gap-1">
            {SEVERITY_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`px-3 py-2 text-xs rounded border transition-colors ${
                  severity === s
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-surface-border text-slate-400 hover:border-slate-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <ul className="space-y-2">
          {incidents.map(inc => (
            <li key={inc.id}>
              <button
                onClick={() => navigate(`/incident/${inc.id}/postmortem`)}
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
                  <span>{fmt.date(inc.since)}</span>
                  <span>·</span>
                  <span className="text-red-400">{inc.severity}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {loading && (
          <p className="text-sm text-slate-600 text-center py-4">Loading…</p>
        )}

        {!loading && hasMore && (
          <div className="text-center">
            <button
              onClick={() => load()}
              className="px-4 py-2 text-sm rounded bg-surface-raised border border-surface-border text-slate-400 hover:border-slate-600"
            >
              Load more
            </button>
          </div>
        )}

        {!loading && incidents.length === 0 && (
          <p className="text-sm text-slate-600 text-center py-8">No incidents found.</p>
        )}
      </main>
    </div>
  )
}
