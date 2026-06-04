import clsx from 'clsx'
import { ENTITY_TYPES } from '@/config/entityTypes'

export default function EntityBadge({ entity, selected, onClick }) {
  const cfg = ENTITY_TYPES[entity.type] ?? {}

  return (
    <button
      onClick={() => onClick(entity.entityId)}
      className={clsx(
        'flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono transition-all text-left',
        cfg.bgClass,
        selected && 'ring-1 ring-white/30 scale-[1.02]'
      )}
      title={`Confidence: ${Math.round(entity.confidence * 100)}%`}
    >
      <span>{cfg.icon}</span>
      <span className="truncate max-w-[180px]">{entity.value}</span>
      <span className="ml-auto text-[10px] opacity-50">{Math.round(entity.confidence * 100)}%</span>
    </button>
  )
}
