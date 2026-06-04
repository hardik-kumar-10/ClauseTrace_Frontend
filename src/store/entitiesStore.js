import { create } from 'zustand'

export const useEntitiesStore = create((set, get) => ({
  entities:         {},   // Record<entityId, Entity>
  selectedEntityId: null,

  addEntities: (incoming) =>
    set(state => {
      const updated = { ...state.entities }
      incoming.forEach(e => { updated[e.entityId] = e })
      return { entities: updated }
    }),

  selectEntity: (entityId) =>
    set({ selectedEntityId: entityId === get().selectedEntityId ? null : entityId }),

  // Derived — grouped by type, de-duplicated by value (FE-04)
  getGrouped: () => {
    const groups = {}
    Object.values(get().entities).forEach(e => {
      if (!groups[e.type]) groups[e.type] = []
      if (!groups[e.type].find(x => x.value === e.value)) groups[e.type].push(e)
    })
    return groups
  },

  reset: () => set({ entities: {}, selectedEntityId: null }),
}))
