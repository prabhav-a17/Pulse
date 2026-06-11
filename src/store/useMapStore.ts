import { create } from 'zustand'

export type MapFilter = 'all' | 'friends' | 'vibe' | 'hot'

interface MapState {
  activeVenueId: string | null
  filter: MapFilter
  setActiveVenue: (id: string | null) => void
  setFilter: (f: MapFilter) => void
}

export const useMapStore = create<MapState>((set) => ({
  activeVenueId: null,
  filter: 'all',
  setActiveVenue: (id) => set({ activeVenueId: id }),
  setFilter: (f) => set({ filter: f }),
}))
