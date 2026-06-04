import { useNavigate } from 'react-router-dom'
import StatusIndicator from '@/components/ui/StatusIndicator'
import { useIncidentStore } from '@/store/incidentStore'
import { useElapsedTime } from '@/hooks/useElapsedTime'
import { incidentsApi } from '@/services/api/incidentsApi'
import { INCIDENT_STATES } from '@/config/incidentStates'

export default function Header() {
  const navigate    = useNavigate()
  const incident    = useIncidentStore(s => s.incident)
  const elapsed     = useElapsedTime(incident?.since)

  const stateConfig = incident ? INCIDENT_STATES[incident.state] : null

  async function handleClose() {
    if (!incident) return
    await incidentsApi.closeIncident(incident.id)
    navigate(`/incident/${incident.id}/postmortem`)
  }

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-surface-raised border-b border-surface-border">
      {/* Left — incident identity */}
      <div className="flex items-center gap-4">
        <span className="text-base font-bold text-slate-100 tracking-tight">
          ClauseTrace
        </span>
        {incident && (
          <>
            <span className="text-slate-600">|</span>
            <span className="text-sm text-slate-300 font-mono">{incident.id}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold uppercase">
              {incident.severity}
            </span>
            {stateConfig && (
              <span className={`text-xs font-medium ${stateConfig.colorClass}`}>
                {stateConfig.label}
              </span>
            )}
          </>
        )}
      </div>

      {/* Centre — MTTR clock */}
      {elapsed && (
        <div className="font-mono text-sm text-amber-300 tabular-nums">
          {elapsed}
        </div>
      )}

      {/* Right — status + action */}
      <div className="flex items-center gap-5">
        <StatusIndicator />
        {incident && incident.state !== 'RESOLVED' && (
          <button
            onClick={handleClose}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
          >
            Close Incident
          </button>
        )}
      </div>
    </header>
  )
}
