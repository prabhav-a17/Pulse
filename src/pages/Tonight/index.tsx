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

function greeting(): string {
  const h = new Date().getHours()
  if (h < 5) return 'Still going'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

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

      <header className="absolute inset-x-3 top-3 z-30 glass flex items-center justify-between px-4 py-3">
        <span className="font-display text-lg font-semibold text-gradient-cyan">Pulse</span>
        <div className="flex gap-1.5">
          {FILTERS.map((f) => (
            <Pill key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)} aria-label={`Filter: ${f.label}`}>
              {f.label}
            </Pill>
          ))}
        </div>
      </header>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute left-5 top-[72px] z-20 text-sm text-text-2"
      >
        {greeting()}, <span className="text-text-1">{user.username}</span>
      </motion.p>

      <button
        type="button"
        aria-label="See who's out tonight"
        className="glass absolute inset-x-3 bottom-[84px] z-20 flex h-[72px] items-center justify-between px-5 text-left"
      >
        <div>
          <p className="text-sm font-medium text-text-1">
            <span className="font-mono text-cyan">{friendsOut}</span> friends out tonight
          </p>
          <p className="mt-0.5 text-xs text-text-2">
            <span className="font-mono text-cyan">{atYourVibe}</span> at venues you'd like
          </p>
        </div>
        <span className="flex h-2.5 w-2.5 rounded-full bg-green glow-green" aria-label="Live" />
      </button>

      <VenueSheet venue={activeVenue} liveFriends={liveFriends} onClose={() => setActiveVenue(null)} />
    </div>
  )
}
