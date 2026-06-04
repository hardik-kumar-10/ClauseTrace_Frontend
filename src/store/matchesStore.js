import { create } from 'zustand'

export const useMatchesStore = create((set) => ({
  matches: [],   // HistoricalMatch[]

  setMatches: (matches) => set({ matches }),

  reset: () => set({ matches: [] }),
}))
