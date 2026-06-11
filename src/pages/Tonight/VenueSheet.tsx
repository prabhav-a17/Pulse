import { BottomSheet } from '@/components/layout/BottomSheet'
import { Avatar } from '@/components/ui/Avatar'
import { findUser } from '@/lib/seedData'
import { useCheckIn } from '@/hooks/useCheckins'
import { useRatings } from '@/hooks/useRatings'
import type { Venue } from '@/types'

interface VenueSheetProps {
  venue: Venue | null
  liveFriends: { userId: string; venueId: string }[]
  onClose: () => void
}

const crowdColor = (score: number) => (score > 80 ? '#EF4444' : score > 55 ? '#F59E0B' : '#10B981')
const crowdLabel = (score: number) => (score > 80 ? 'Packed' : score > 55 ? 'Busy' : 'Quiet')

export function VenueSheet({ venue, liveFriends, onClose }: VenueSheetProps) {
  const checkIn = useCheckIn()
  const { data: ratings } = useRatings()

  const friendsHere = venue
    ? liveFriends.filter((f) => f.venueId === venue.id).map((f) => findUser(f.userId)).filter(Boolean)
    : []

  const recentAttrs = venue
    ? [...new Set(ratings?.filter((r) => r.venueId === venue.id).flatMap((r) => r.attributes) ?? [])].slice(0, 5)
    : []

  return (
    <BottomSheet open={venue !== null} onClose={onClose} ariaLabel="Venue details">
      {venue && (
        <div>
          <h2 className="font-display text-[22px] font-semibold text-text-1">{venue.name}</h2>

          <div className="mt-3 flex items-center gap-3">
            <span className="pill">{venue.neighborhood}</span>
            <span className="font-mono text-xs text-text-2">{venue.distanceMi} mi</span>
            <div className="flex flex-1 items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${venue.crowdScore}%`, background: `linear-gradient(90deg, #10B981, ${crowdColor(venue.crowdScore)})` }}
                />
              </div>
              <span className="text-[11px] font-medium" style={{ color: crowdColor(venue.crowdScore) }}>
                {crowdLabel(venue.crowdScore)}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <span className="pill pill-active glow-cyan">⚡ {venue.matchScore}% vibe match</span>
          </div>

          {friendsHere.length > 0 && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex -space-x-2">
                {friendsHere.slice(0, 5).map((u) => (
                  <Avatar key={u!.id} src={u!.avatarUrl} alt={u!.username} size={30} ring />
                ))}
              </div>
              <span className="text-xs text-text-2">
                {friendsHere.length} friend{friendsHere.length > 1 ? 's' : ''} here now
              </span>
            </div>
          )}

          {recentAttrs.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {recentAttrs.map((attr) => (
                <span key={attr} className="pill">
                  {attr}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              aria-label="Mark as going later"
              className="glass flex-1 rounded-2xl border-cyan/40 py-3 text-sm font-medium text-cyan"
            >
              👀 Going later
            </button>
            <button
              type="button"
              aria-label="Check in here"
              onClick={() => {
                checkIn.mutate(venue.id)
                onClose()
              }}
              className="flex-1 rounded-2xl gradient-blue py-3 text-sm font-semibold text-white glow-blue"
            >
              📍 I'm here
            </button>
          </div>
        </div>
      )}
    </BottomSheet>
  )
}
