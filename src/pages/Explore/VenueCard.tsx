import { motion } from 'framer-motion'
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

  return (
    <motion.button
      type="button"
      aria-label={`View ${venue.name}`}
      onClick={() => onSelect(venue.id)}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="w-full overflow-hidden text-left card"
      variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
    >
      {/* Header with gradient and venue name overlaid */}
      <div className="relative h-[200px] w-full" style={{ background: gradient }}>
        {/* Match score badge top-right */}
        <span className="pill pill-active absolute right-3 top-3">{venue.matchScore}% match</span>
        {/* Venue name overlaid at bottom with gradient */}
        <div
          className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-8"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}
        >
          <h3 className="font-display text-[19px] font-bold text-white leading-tight">{venue.name}</h3>
        </div>
      </div>

      {/* Below header: metadata */}
      <div className="px-4 py-3">
        <p className="text-[13px] text-text-2">
          {venue.neighborhood} · {venue.distanceMi} mi · <span className="font-mono text-cyan">{venue.rating.toFixed(1)}</span>
        </p>
        <div className="mt-2 flex gap-1.5">
          {venue.vibeTags.slice(0, 3).map((tag) => (
            <span key={tag} className="pill">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  )
}
