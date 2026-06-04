import PanelShell from '@/components/ui/PanelShell'
import EntityBadge from './EntityBadge'
import { useEntitiesStore } from '@/store/entitiesStore'
import { ENTITY_TYPES, ENTITY_TYPE_KEYS } from '@/config/entityTypes'

export default function EntityPanel() {
  const grouped        = useEntitiesStore(s => s.getGrouped())
  const selectedId     = useEntitiesStore(s => s.selectedEntityId)
  const selectEntity   = useEntitiesStore(s => s.selectEntity)

  const hasEntities = Object.values(grouped).some(g => g.length > 0)
  const status = hasEntities ? 'live' : 'empty'

  return (
    <PanelShell title="Extracted Entities" status={status} className="h-full">
      <div className="p-3 space-y-4 overflow-y-auto h-full scrollbar-thin">
        {ENTITY_TYPE_KEYS.map(typeKey => {
          const items = grouped[typeKey] ?? []
          if (!items.length) return null
          const cfg = ENTITY_TYPES[typeKey]
          return (
            <div key={typeKey}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {cfg.label} ({items.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map(e => (
                  <EntityBadge
                    key={e.entityId}
                    entity={e}
                    selected={e.entityId === selectedId}
                    onClick={selectEntity}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </PanelShell>
  )
}
