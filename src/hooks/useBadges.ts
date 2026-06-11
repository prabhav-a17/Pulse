import { useQuery } from '@tanstack/react-query'
import { SEED_BADGES } from '@/lib/seedData'
import type { BadgeState } from '@/types'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function useBadges() {
  return useQuery({
    queryKey: ['badges'],
    queryFn: async (): Promise<BadgeState[]> => {
      await wait(250)
      return SEED_BADGES
    },
  })
}
