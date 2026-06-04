import { create } from 'zustand'

export const useIncidentStore = create((set) => ({
  incident:     null,        // { id, title, severity, state, since }
  stateHistory: [],          // [{ state, since }]

  setIncident: (incident) =>
    set({ incident, stateHistory: [{ state: incident.state, since: incident.since }] }),

  updateState: (state, since) =>
    set(prev => ({
      incident:     prev.incident ? { ...prev.incident, state, since } : prev.incident,
      stateHistory: [...prev.stateHistory, { state, since }],
    })),

  reset: () => set({ incident: null, stateHistory: [] }),
}))
