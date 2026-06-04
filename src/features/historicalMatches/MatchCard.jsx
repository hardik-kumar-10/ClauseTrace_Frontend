import { fmt } from '@/utils/formatters'

export default function MatchCard({ match, onViewFull }) {
  const similarityPct = Math.round(match.similarity * 100)

  return (
    <div className="p-3 rounded-lg border border-surface-border bg-surface-DEFAULT hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-200 leading-snug">{match.title}</span>
        <span
          className={`shrink-0 text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
            similarityPct >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
            similarityPct >= 60 ? 'bg-amber-500/20 text-amber-400' :
            'bg-slate-500/20 text-slate-400'
          }`}
        >
          {similarityPct}%
        </span>
      </div>

      <div className="space-y-1 text-xs text-slate-400 mb-3">
        <p><span className="text-slate-500">Root cause: </span>{match.rootCause}</p>
        <p><span className="text-slate-500">Resolution: </span>{match.resolution}</p>
        <p className="text-slate-600">{fmt.relative(match.date)}</p>
      </div>

      <button
        onClick={() => onViewFull(match.pastIncidentId)}
        className="text-xs text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline"
      >
        View full incident →
      </button>
    </div>
  )
}
