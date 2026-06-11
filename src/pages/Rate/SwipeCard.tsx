import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import type { Venue } from '@/types'

const GRADIENTS: Record<string, string> = {
  house: 'linear-gradient(160deg, #0066FF 0%, #4F46E5 100%)',
  'hip-hop': 'linear-gradient(160deg, #4F46E5 0%, #7C3AED 100%)',
  techno: 'linear-gradient(160deg, #00D4FF 0%, #0066FF 100%)',
  'R&B': 'linear-gradient(160deg, #4F46E5 0%, #EC4899 100%)',
}
const FALLBACK_GRADIENT = 'linear-gradient(160deg, #0D0D1A 0%, #12122A 100%)'

interface SwipeCardProps {
  venue: Venue
  onSwipe: (liked: boolean) => void
}

export function SwipeCard({ venue, onSwipe }: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-180, 180], [-18, 18])
  const tint = useTransform(
    x,
    [-80, 0, 80],
    ['rgba(239,68,68,0.12)', 'rgba(0,0,0,0)', 'rgba(16,185,129,0.12)'],
  )

  const gradient = venue.vibeTags.map((t) => GRADIENTS[t]).find(Boolean) ?? FALLBACK_GRADIENT

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 90) {
      const liked = info.offset.x > 0
      if (navigator.vibrate) navigator.vibrate(40)
      onSwipe(liked)
    }
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -180, right: 180 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
      exit={{ x: 0, opacity: 0, scale: 0.9 }}
      className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing rounded-[20px] overflow-hidden"
      aria-label={`Rate ${venue.name}: drag right if you'd go back, left to skip`}
    >
      {/* Venue gradient background */}
      <div className="absolute inset-0" style={{ background: gradient }} />
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ background: tint }}
      >
        <span className="pill">{venue.neighborhood}</span>
        <h2 className="mt-6 font-display text-[28px] font-bold text-white leading-tight">{venue.name}</h2>
        <p className="mt-3 text-base text-white/70">Back for more?</p>
        <div className="mt-8 flex gap-10 text-sm text-white/40">
          <span>← skip</span>
          <span>going back →</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
