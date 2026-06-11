import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, VibeTag } from '@/types'
import { CURRENT_USER } from '@/lib/seedData'

interface AuthState {
  user: User
  onboarded: boolean
  setVibes: (vibes: VibeTag[]) => void
  completeOnboarding: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: CURRENT_USER,
      onboarded: false,
      setVibes: (vibes) => set((s) => ({ user: { ...s.user, vibeTags: vibes } })),
      completeOnboarding: () => set({ onboarded: true }),
    }),
    { name: 'pulse-auth' },
  ),
)
