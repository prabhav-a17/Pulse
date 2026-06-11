import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { LIVE_FRIEND_CHECKINS, SEED_CHECKINS } from '@/lib/seedData'
import { useAuthStore } from '@/store/useAuthStore'
import type { Checkin } from '@/types'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function useCheckins() {
  return useQuery({
    queryKey: ['checkins'],
    queryFn: async (): Promise<Checkin[]> => {
      if (!supabase) {
        await wait(300)
        return SEED_CHECKINS
      }
      const { data, error } = await supabase
        .from('checkins')
        .select('*')
        .order('checked_in_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as Checkin[]
    },
  })
}

export function useLiveFriendCheckins() {
  return useQuery({
    queryKey: ['checkins', 'live-friends'],
    queryFn: async () => {
      await wait(250)
      return LIVE_FRIEND_CHECKINS
    },
  })
}

/** Optimistic check-in: appears instantly, rolls back on failure. */
export function useCheckIn() {
  const queryClient = useQueryClient()
  const userId = useAuthStore((s) => s.user.id)

  return useMutation({
    mutationFn: async (venueId: string): Promise<Checkin> => {
      const now = new Date()
      const checkin: Checkin = {
        id: `c-local-${now.getTime()}`,
        userId,
        venueId,
        checkedInAt: now.toISOString(),
        isLive: true,
        nightDate: now.toISOString().slice(0, 10),
        rated: false,
      }
      if (supabase) {
        const { error } = await supabase.from('checkins').insert({
          user_id: userId,
          venue_id: venueId,
        })
        if (error) throw error
      } else {
        await wait(400)
      }
      return checkin
    },
    onMutate: async (venueId) => {
      await queryClient.cancelQueries({ queryKey: ['checkins'] })
      const previous = queryClient.getQueryData<Checkin[]>(['checkins'])
      const optimistic: Checkin = {
        id: `c-optimistic-${Date.now()}`,
        userId,
        venueId,
        checkedInAt: new Date().toISOString(),
        isLive: true,
        nightDate: new Date().toISOString().slice(0, 10),
        rated: false,
      }
      queryClient.setQueryData<Checkin[]>(['checkins'], (old) => [optimistic, ...(old ?? [])])
      if (navigator.vibrate) navigator.vibrate(50)
      return { previous }
    },
    onError: (_err, _venueId, context) => {
      if (context?.previous) queryClient.setQueryData(['checkins'], context.previous)
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['checkins'] })
    },
  })
}

/** Realtime subscription to live check-in changes (no-op in demo mode). */
export function useRealtimeCheckins() {
  const queryClient = useQueryClient()
  useEffect(() => {
    if (!supabase) return
    const channel = supabase
      .channel('checkins-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checkins' }, () => {
        void queryClient.invalidateQueries({ queryKey: ['checkins'] })
      })
      .subscribe()
    return () => {
      void supabase?.removeChannel(channel)
    }
  }, [queryClient])
}
