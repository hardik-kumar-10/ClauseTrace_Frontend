import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from '@/components/layout/Header'
import DashboardGrid from '@/components/layout/DashboardGrid'
import TranscriptPanel from '@/features/transcript/TranscriptPanel'
import EntityPanel from '@/features/entities/EntityPanel'
import MatchesPanel from '@/features/historicalMatches/MatchesPanel'
import StateMapPanel from '@/features/incidentState/StateMapPanel'
import { useSocket } from '@/services/socket/useSocket'
import { useIncidentStore } from '@/store/incidentStore'
import { useTranscriptStore } from '@/store/transcriptStore'
import { useEntitiesStore } from '@/store/entitiesStore'
import { useMatchesStore } from '@/store/matchesStore'
import { incidentsApi } from '@/services/api/incidentsApi'

export default function WarRoomPage() {
  const { id } = useParams()

  // Reset all stores on mount / incident change
  const resetTranscript = useTranscriptStore(s => s.reset)
  const resetEntities   = useEntitiesStore(s => s.reset)
  const resetMatches    = useMatchesStore(s => s.reset)
  const setIncident     = useIncidentStore(s => s.setIncident)
  const resetIncident   = useIncidentStore(s => s.reset)

  useEffect(() => {
    resetTranscript()
    resetEntities()
    resetMatches()
    resetIncident()

    incidentsApi.get(id).then(setIncident)
  }, [id])

  // Establish socket for this incident
  useSocket(id)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface">
      <Header />
      <DashboardGrid
        panelA={<TranscriptPanel />}
        panelB={<EntityPanel />}
        panelC={<MatchesPanel />}
        panelD={<StateMapPanel />}
      />
    </div>
  )
}
