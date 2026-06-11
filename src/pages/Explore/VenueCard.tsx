import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { SEED_USERS } from '@/lib/seedData'
import type { Venue } from '@/types'

const GRADIENTS: Record<string, string> = {
  house: 'linear-gradient(135deg, #0066FF, #4F46E5)',
  'hip-hop': 'linear-gradient(135deg, #4F46E5, #7C3AED)',
  techno: 'linear-gradient(135deg, #00D4FF, #0066FF)',
  'R&B': 'linear-gradient(135deg, #4F46E5, #EC4899)',
}
const FALLBACK_GRADIENT = 'linear-gradient(135deg, #0D0D1A, #12122A)'

interface VenueCardProps {
  venue: Venue
  onSelect: (id: string) => void
}

export function VenueCard({ venue, onSelect }: VenueCardProps) {
  const gradient = venue.vibeTags.map((t) => GRADIENTS[t]).find(Boolean) ?? FALLBACK_GRADIENT
  const friends = SEED_USERS.slice(0, 2)

  return (
    <motion.button
      type="button"
      aria-label={`View ${venue.name}`}
      onClick={() => onSelect(venue.id)}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="glass w-full overflow-hidden text-left"
      variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
    >
      <div className="relative h-[160px] w-full" style={{ background: gradient }}>
        <span className="pill pill-active absolute right-3 top-3">{venue.matchScore}% match</span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-[17px] font-medium text-text-1">{venue.name}</h3>
        <p className="mt-0.5 text-[13px] text-text-2">
          {venue.neighborhood} · {venue.distanceMi} mi
        </p>
        <div className="mt-2.5 flex gap-1.5">
          {venue.vibeTags.slice(0, 3).map((tag) => (
            <span key={tag} className="pill">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {friends.map((u) => (
                <Avatar key={u.id} src={u.avatarUrl} alt={u.username} size={22} />
              ))}
            </div>
            <span className="text-[11px] text-text-2">+ 2 others have been here</span>
          </div>
          <span className="font-mono text-sm font-medium text-cyan">{venue.rating.toFixed(1)}</span>
        </div>
      </div>
    </motion.button>
  )
}
