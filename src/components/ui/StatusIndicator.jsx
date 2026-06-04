import { useUiStore } from '@/store/uiStore'

const CFG = {
  connected:    { label: 'Connected',    dot: 'bg-emerald-400', pulse: true  },
  disconnected: { label: 'Disconnected', dot: 'bg-red-400',     pulse: false },
  reconnecting: { label: 'Reconnecting', dot: 'bg-amber-400',   pulse: true  },
}

export default function StatusIndicator() {
  const status = useUiStore(s => s.socketStatus)
  const cfg    = CFG[status] ?? CFG.disconnected

  return (
    <div className="flex items-center gap-2 text-xs text-slate-400" role="status">
      <span className={`w-2 h-2 rounded-full ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </div>
  )
}
