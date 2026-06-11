import { useQuery } from '@tanstack/react-query'
import { SEED_USERS } from '@/lib/seedData'
import type { User } from '@/types'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function useFriends() {
  return useQuery({
    queryKey: ['friends'],
    queryFn: async (): Promise<User[]> => {
      await wait(250)
      return SEED_USERS
    },
  })
}
