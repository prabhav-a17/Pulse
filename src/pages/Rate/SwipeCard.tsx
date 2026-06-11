import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion'
import type { Venue } from '@/types'

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
    ['rgba(239,68,68,0.08)', 'rgba(0,0,0,0)', 'rgba(16,185,129,0.08)'],
  )

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
      className="glass absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
      aria-label={`Rate ${venue.name}: drag right if you'd go back, left to skip`}
    >
      <motion.div className="flex h-full flex-col items-center justify-center rounded-[20px] px-6 text-center" style={{ background: tint }}>
        <span className="pill">{venue.neighborhood}</span>
        <h2 className="mt-4 font-display text-[20px] font-semibold text-text-1">{venue.name}</h2>
        <p className="mt-2 text-sm text-text-2">Back for more?</p>
        <div className="mt-6 flex gap-8 text-xs text-text-3">
          <span>← skip</span>
          <span>going back →</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
