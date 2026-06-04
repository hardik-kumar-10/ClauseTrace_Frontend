import { create } from 'zustand'

export const useUiStore = create((set) => ({
  socketStatus:          'disconnected',  // 'connected' | 'reconnecting' | 'disconnected'
  activeDrawerIncidentId: null,           // past incident shown in side drawer

  setSocketStatus:   (status) => set({ socketStatus: status }),
  openDrawer:        (id)     => set({ activeDrawerIncidentId: id }),
  closeDrawer:       ()       => set({ activeDrawerIncidentId: null }),
}))
