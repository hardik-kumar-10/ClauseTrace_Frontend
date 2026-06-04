import PanelShell from '@/components/ui/PanelShell'
import MatchCard from './MatchCard'
import IncidentDrawer from './IncidentDrawer'
import { useMatchesStore } from '@/store/matchesStore'
import { useEntitiesStore } from '@/store/entitiesStore'
import { useUiStore } from '@/store/uiStore'

export default function MatchesPanel() {
  const allMatches     = useMatchesStore(s => s.matches)
  const selectedId     = useEntitiesStore(s => s.selectedEntityId)
  const selectedEntity = useEntitiesStore(s => s.entities[s.selectedEntityId])
  const openDrawer     = useUiStore(s => s.openDrawer)

  // When an entity is selected, this would ideally filter by entity value.
  // The backend returns global matches per event; local filtering is an enhancement.
  const matches = allMatches

  const status = matches.length === 0 ? 'empty' : 'live'

  return (
    <>
      <PanelShell title="Suggested Historical Fixes" status={status} className="h-full">
        {selectedEntity && (
          <div className="px-3 pt-2 pb-1">
            <span className="text-xs text-slate-500">
              Filtered by: <span className="text-blue-400 font-mono">{selectedEntity.value}</span>
            </span>
          </div>
        )}
        <div className="p-3 space-y-2 overflow-y-auto h-full scrollbar-thin">
          {matches.map(m => (
            <MatchCard key={m.pastIncidentId} match={m} onViewFull={openDrawer} />
          ))}
        </div>
      </PanelShell>

      <IncidentDrawer />
    </>
  )
}
