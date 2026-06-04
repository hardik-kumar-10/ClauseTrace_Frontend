import PanelShell from '@/components/ui/PanelShell'
import { useIncidentStore } from '@/store/incidentStore'
import { INCIDENT_STATES, STATE_SEQUENCE } from '@/config/incidentStates'
import { fmt } from '@/utils/formatters'
import { useElapsedTime } from '@/hooks/useElapsedTime'

function StateStep({ stateKey, current }) {
  const cfg    = INCIDENT_STATES[stateKey]
  const idx    = STATE_SEQUENCE.indexOf(stateKey)
  const curIdx = STATE_SEQUENCE.indexOf(current)
  const done   = idx < curIdx
  const active = idx === curIdx

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-3 h-3 rounded-full border-2 shrink-0 ${
          active ? `${cfg.ringClass} ring-2 ring-offset-1 ring-offset-surface-raised bg-current ${cfg.colorClass}` :
          done   ? 'bg-slate-500 border-slate-500' :
                   'border-slate-700 bg-transparent'
        }`}
      />
      <span className={`text-xs font-medium ${active ? cfg.colorClass : done ? 'text-slate-500' : 'text-slate-700'}`}>
        {cfg.label}
      </span>
    </div>
  )
}

export default function StateMapPanel() {
  const incident     = useIncidentStore(s => s.incident)
  const stateHistory = useIncidentStore(s => s.stateHistory)
  const elapsed      = useElapsedTime(incident?.since)

  const status = incident ? 'live' : 'loading'

  return (
    <PanelShell title="Incident State" status={status} className="h-full">
      <div className="p-4 space-y-5">
        {/* Current state + time-in-state */}
        {incident && (
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${INCIDENT_STATES[incident.state]?.colorClass}`}>
              {INCIDENT_STATES[incident.state]?.label}
            </span>
            <span className="text-xs font-mono text-slate-500">{elapsed} in state</span>
          </div>
        )}

        {/* State progress bar */}
        <div className="space-y-2">
          {STATE_SEQUENCE.map(key => (
            <StateStep key={key} stateKey={key} current={incident?.state ?? 'DETECTED'} />
          ))}
        </div>

        {/* Transition timeline */}
        {stateHistory.length > 1 && (
          <div>
            <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Transitions</h4>
            <ol className="space-y-1">
              {stateHistory.map((entry, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono text-slate-600">{fmt.time(entry.since)}</span>
                  <span className={INCIDENT_STATES[entry.state]?.colorClass}>{INCIDENT_STATES[entry.state]?.label}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </PanelShell>
  )
}
