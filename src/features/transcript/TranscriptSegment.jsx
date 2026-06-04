import clsx from 'clsx'
import { highlightEntities } from '@/utils/textHighlighter'
import { ENTITY_TYPES } from '@/config/entityTypes'
import { fmt } from '@/utils/formatters'

export default function TranscriptSegment({ segment, entities = [] }) {
  const runs = highlightEntities(segment.text, entities)

  return (
    <div className={clsx('px-4 py-2 hover:bg-surface-border/30 transition-colors', !segment.isFinal && 'opacity-50')}>
      <div className="flex items-baseline gap-2 mb-0.5">
        {segment.speaker && (
          <span className="text-xs font-semibold text-blue-400 shrink-0">{segment.speaker}</span>
        )}
        <span className="text-xs text-slate-600 font-mono shrink-0">{fmt.time(segment.ts)}</span>
        {!segment.isFinal && (
          <span className="text-xs text-slate-600 italic">interim…</span>
        )}
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        {runs.map((run, i) =>
          run.entity ? (
            <mark
              key={i}
              className={clsx(
                'rounded px-0.5 font-mono text-xs',
                ENTITY_TYPES[run.entity.type]?.bgClass ?? 'bg-slate-500/20 text-slate-300'
              )}
              title={`${ENTITY_TYPES[run.entity.type]?.label ?? run.entity.type} · ${Math.round(run.entity.confidence * 100)}% confidence`}
            >
              {run.text}
            </mark>
          ) : (
            <span key={i}>{run.text}</span>
          )
        )}
      </p>
    </div>
  )
}
