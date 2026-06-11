import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { SEED_VENUES } from '@/lib/seedData'
import type { Venue } from '@/types'

const simulateLatency = <T,>(data: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

async function fetchVenues(): Promise<Venue[]> {
  if (!supabase) return simulateLatency(SEED_VENUES)
  const { data, error } = await supabase.from('venues').select('*')
  if (error) throw error
  // Live deployments enrich rows server-side; demo fields fall back to seed values
  return (data ?? []).map((row, i) => ({
    ...(SEED_VENUES[i % SEED_VENUES.length] as Venue),
    ...row,
  }))
}

export function useVenues() {
  return useQuery({ queryKey: ['venues'], queryFn: fetchVenues })
}

export function useVenue(id: string | null) {
  const { data: venues, ...rest } = useVenues()
  return { ...rest, data: id ? venues?.find((v) => v.id === id) ?? null : null }
}
