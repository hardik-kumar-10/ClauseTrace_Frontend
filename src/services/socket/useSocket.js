import { useEffect, useRef } from 'react'
import { getSocket } from './socketClient'
import { SOCKET_EVENTS } from './socketEvents'
import { useTranscriptStore } from '@/store/transcriptStore'
import { useEntitiesStore } from '@/store/entitiesStore'
import { useMatchesStore } from '@/store/matchesStore'
import { useIncidentStore } from '@/store/incidentStore'
import { useUiStore } from '@/store/uiStore'

/**
 * Establishes a Socket.io room for `incidentId`, wires all inbound events to
 * their respective Zustand stores, and applies a rAF-based flush buffer so
 * high-frequency events are batched per animation frame rather than triggering
 * individual React renders (FE-13).
 */
export function useSocket(incidentId) {
  const bufferRef = useRef({ segments: [], entities: [] })
  const rafRef    = useRef(null)

  const addSegments  = useTranscriptStore(s => s.addSegments)
  const addEntities  = useEntitiesStore(s => s.addEntities)
  const setMatches   = useMatchesStore(s => s.setMatches)
  const updateState  = useIncidentStore(s => s.updateState)
  const setSocketStatus = useUiStore(s => s.setSocketStatus)

  useEffect(() => {
    if (!incidentId) return
    const socket = getSocket()

    function flushBuffer() {
      const buf = bufferRef.current
      if (buf.segments.length) { addSegments([...buf.segments]); buf.segments = [] }
      if (buf.entities.length) { addEntities([...buf.entities]); buf.entities = [] }
      rafRef.current = requestAnimationFrame(flushBuffer)
    }

    socket.connect()
    socket.emit(SOCKET_EVENTS.JOIN_INCIDENT, incidentId)
    rafRef.current = requestAnimationFrame(flushBuffer)

    socket.on(SOCKET_EVENTS.CONNECT,           () => setSocketStatus('connected'))
    socket.on(SOCKET_EVENTS.DISCONNECT,        () => setSocketStatus('disconnected'))
    socket.on(SOCKET_EVENTS.RECONNECT_ATTEMPT, () => setSocketStatus('reconnecting'))
    socket.on(SOCKET_EVENTS.RECONNECT, () => {
      setSocketStatus('connected')
      socket.emit(SOCKET_EVENTS.JOIN_INCIDENT, incidentId)
    })

    socket.on(SOCKET_EVENTS.TRANSCRIPT_SEGMENT, seg => {
      if (seg.incidentId === incidentId) bufferRef.current.segments.push(seg)
    })

    socket.on(SOCKET_EVENTS.ENTITY_EXTRACTED, entity => {
      if (entity.incidentId === incidentId) bufferRef.current.entities.push(entity)
    })

    socket.on(SOCKET_EVENTS.MATCH_HISTORICAL, ({ incidentId: id, matches }) => {
      if (id === incidentId) setMatches(matches)
    })

    socket.on(SOCKET_EVENTS.INCIDENT_STATE, ({ incidentId: id, state, since }) => {
      if (id === incidentId) updateState(state, since)
    })

    return () => {
      cancelAnimationFrame(rafRef.current)
      socket.emit(SOCKET_EVENTS.LEAVE_INCIDENT, incidentId)
      ;[
        SOCKET_EVENTS.CONNECT, SOCKET_EVENTS.DISCONNECT,
        SOCKET_EVENTS.RECONNECT_ATTEMPT, SOCKET_EVENTS.RECONNECT,
        SOCKET_EVENTS.TRANSCRIPT_SEGMENT, SOCKET_EVENTS.ENTITY_EXTRACTED,
        SOCKET_EVENTS.MATCH_HISTORICAL, SOCKET_EVENTS.INCIDENT_STATE,
      ].forEach(ev => socket.off(ev))
      socket.disconnect()
    }
  }, [incidentId])
}
