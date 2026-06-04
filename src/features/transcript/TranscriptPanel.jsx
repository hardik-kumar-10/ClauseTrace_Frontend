import PanelShell from '@/components/ui/PanelShell'
import TranscriptSegment from './TranscriptSegment'
import { useTranscriptStore } from '@/store/transcriptStore'
import { useEntitiesStore } from '@/store/entitiesStore'
import { useAutoScroll } from '@/hooks/useAutoScroll'
import { ENTITY_TYPES } from '@/config/entityTypes'

export default function TranscriptPanel() {
  const segments  = useTranscriptStore(s => s.segments)
  const entities  = useEntitiesStore(s => Object.values(s.entities))
  const { containerRef, isPaused, resume } = useAutoScroll([segments.length])

  const status = segments.length === 0 ? 'empty' : 'live'

  return (
    <PanelShell title="Live Transcript" status={status} className="h-full">
      {/* Entity legend */}
      <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-surface-border">
        {Object.entries(ENTITY_TYPES).map(([key, cfg]) => (
          <span key={key} className={`text-xs px-1.5 py-0.5 rounded ${cfg.bgClass}`}>
            {cfg.icon} {cfg.label}
          </span>
        ))}
      </div>

      {/* Scrollable transcript */}
      <div ref={containerRef} className="overflow-y-auto h-full scrollbar-thin divide-y divide-surface-border/50">
        {segments.map(seg => (
          <TranscriptSegment key={seg.segmentId} segment={seg} entities={entities} />
        ))}
      </div>

      {/* Pause-scroll affordance (FE-11) */}
      {isPaused && (
        <button
          onClick={resume}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-full shadow-lg"
        >
          ↓ Resume live scroll
        </button>
      )}
    </PanelShell>
  )
}
