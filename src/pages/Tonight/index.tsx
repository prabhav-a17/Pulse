import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PulseMap } from '@/components/map/PulseMap'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pill } from '@/components/ui/Pill'
import { useVenues } from '@/hooks/useVenues'
import { useLiveFriendCheckins, useRealtimeCheckins } from '@/hooks/useCheckins'
import { useAuthStore } from '@/store/useAuthStore'
import { useMapStore, type MapFilter } from '@/store/useMapStore'
import { VenueSheet } from './VenueSheet'

const FILTERS: { id: MapFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'friends', label: 'Friends' },
  { id: 'vibe', label: 'Your Vibe' },
  { id: 'hot', label: '🔥' },
]

export default function Tonight() {
  const user = useAuthStore((s) => s.user)
  const { filter, setFilter, activeVenueId, setActiveVenue } = useMapStore()
  const { data: venues, isLoading, isError } = useVenues()
  const { data: liveFriends = [] } = useLiveFriendCheckins()
  useRealtimeCheckins()

  const visibleVenues = useMemo(() => {
    if (!venues) return []
    switch (filter) {
      case 'friends':
        return venues.filter((v) => liveFriends.some((f) => f.venueId === v.id))
      case 'vibe':
        return venues.filter((v) => v.vibeTags.some((t) => user.vibeTags.includes(t)))
      case 'hot':
        return venues.filter((v) => v.crowdScore >= 70)
      default:
        return venues
    }
  }, [venues, filter, liveFriends, user.vibeTags])

  const activeVenue = venues?.find((v) => v.id === activeVenueId) ?? null
  const friendsOut = liveFriends.length
  const atYourVibe = liveFriends.filter((f) => {
    const v = venues?.find((venue) => venue.id === f.venueId)
    return v?.vibeTags.some((t) => user.vibeTags.includes(t))
  }).length

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center px-8 text-center text-sm text-text-2">
        Couldn't load the map. Pull yourself together and retry.
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {isLoading ? (
        <div className="h-full w-full p-4 pt-20">
          <Skeleton className="h-full w-full !rounded-3xl" />
        </div>
      ) : (
        <PulseMap venues={visibleVenues} liveFriends={liveFriends} />
      )}

      {/* Top overlay: glass pill with Pulse + filter chips */}
      <header className="absolute inset-x-4 top-4 z-30 flex items-center gap-2">
        <div
          className="flex items-center gap-2 rounded-full px-4 py-2.5 backdrop-blur-xl"
          style={{ background: 'rgba(9,9,15,0.80)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="font-display text-base font-semibold text-gradient-cyan">Pulse</span>
          <div className="flex gap-1.5">
            {FILTERS.map((f) => (
              <Pill key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)} aria-label={`Filter: ${f.label}`}>
                {f.label}
              </Pill>
            ))}
          </div>
        </div>
      </header>

      {/* Bottom card: bigger with better typography */}
      <motion.button
        type="button"
        aria-label="See who's out tonight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute inset-x-3 bottom-[84px] z-20 flex h-[140px] flex-col justify-between rounded-[20px] px-5 py-4 text-left backdrop-blur-xl"
        style={{ background: 'rgba(9,9,15,0.88)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-text-1">
              <span className="font-mono text-cyan">{friendsOut}</span>
              <span className="ml-2 text-lg text-text-2">friends out</span>
            </p>
            <p className="mt-1 text-sm text-text-2">
              <span className="font-mono text-cyan">{atYourVibe}</span> at venues you'd like
            </p>
          </div>
          <span className="flex h-2.5 w-2.5 rounded-full bg-green glow-green mt-1" aria-label="Live" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-3">{visibleVenues.length} venues showing</span>
        </div>
      </motion.button>

      <VenueSheet venue={activeVenue} liveFriends={liveFriends} onClose={() => setActiveVenue(null)} />
    </div>
  )
}
