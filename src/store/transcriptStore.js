import { create } from 'zustand'

export const useTranscriptStore = create((set) => ({
  segments: [],   // TranscriptSegment[]

  // Upserts by segmentId — handles interim→final replacement (FE-02)
  addSegments: (incoming) =>
    set(state => {
      const map = new Map(state.segments.map(s => [s.segmentId, s]))
      incoming.forEach(s => map.set(s.segmentId, s))
      return {
        segments: Array.from(map.values())
          .sort((a, b) => new Date(a.ts) - new Date(b.ts)),
      }
    }),

  reset: () => set({ segments: [] }),
}))
