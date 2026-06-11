import { create } from 'zustand'
import type { GroupNight } from '@/types'

interface GroupState {
  activeGroup: GroupNight | null
  sheetOpen: boolean
  openSheet: () => void
  closeSheet: () => void
  startGroup: (group: GroupNight) => void
  endGroup: () => void
}

export const useGroupStore = create<GroupState>((set) => ({
  activeGroup: null,
  sheetOpen: false,
  openSheet: () => set({ sheetOpen: true }),
  closeSheet: () => set({ sheetOpen: false }),
  startGroup: (group) => set({ activeGroup: group, sheetOpen: false }),
  endGroup: () => set({ activeGroup: null }),
}))
