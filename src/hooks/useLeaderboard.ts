import { useQuery } from '@tanstack/react-query'
import { CITY_LEADERBOARD, LEADERBOARD } from '@/lib/seedData'
import type { CityLeaderboardEntry, LeaderboardEntry, LeaderboardMetric } from '@/types'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function useLeaderboard(metric: LeaderboardMetric) {
  return useQuery({
    queryKey: ['leaderboard', metric],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      await wait(280)
      return [...LEADERBOARD]
        .sort((a, b) => b.stats[metric] - a.stats[metric])
        .map((e, i) => ({ ...e, rank: i + 1 }))
    },
  })
}

export function useCityLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard', 'city'],
    queryFn: async (): Promise<CityLeaderboardEntry[]> => {
      await wait(280)
      return CITY_LEADERBOARD
    },
  })
}
