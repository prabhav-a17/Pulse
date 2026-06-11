import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SEED_RATINGS } from '@/lib/seedData'
import { useAuthStore } from '@/store/useAuthStore'
import type { Rating, RatingAttribute } from '@/types'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function useRatings() {
  return useQuery({
    queryKey: ['ratings'],
    queryFn: async (): Promise<Rating[]> => {
      await wait(250)
      return SEED_RATINGS
    },
  })
}

export interface SubmitRatingInput {
  venueId: string
  checkinId: string
  wouldReturn: boolean
  attributes: RatingAttribute[]
  note: string
}

export function useSubmitRating() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((s) => s.user.id)

  return useMutation({
    mutationFn: async (input: SubmitRatingInput): Promise<void> => {
      if (supabase) {
        const { error } = await supabase.from('ratings').insert({
          user_id: userId,
          venue_id: input.venueId,
          checkin_id: input.checkinId,
          would_return: input.wouldReturn,
          attributes: input.attributes,
          note: input.note,
        })
        if (error) throw error
      } else {
        await wait(350)
      }
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['ratings'] })
      const previous = queryClient.getQueryData<Rating[]>(['ratings'])
      const optimistic: Rating = {
        id: `r-optimistic-${Date.now()}`,
        userId,
        venueId: input.venueId,
        checkinId: input.checkinId,
        wouldReturn: input.wouldReturn,
        attributes: input.attributes,
        note: input.note,
        createdAt: new Date().toISOString(),
      }
      queryClient.setQueryData<Rating[]>(['ratings'], (old) => [optimistic, ...(old ?? [])])
      return { previous }
    },
    onError: (_e, _i, context) => {
      if (context?.previous) queryClient.setQueryData(['ratings'], context.previous)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['ratings'] })
    },
  })
}
