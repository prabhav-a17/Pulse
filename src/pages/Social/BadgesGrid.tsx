import { useState } from 'react'
import {
  Beer,
  Compass,
  Crown,
  Flame,
  Lock,
  Map as MapIcon,
  Moon,
  Repeat,
  Sparkles,
  Sun,
  Users,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomSheet } from '@/components/layout/BottomSheet'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useBadges } from '@/hooks/useBadges'
import type { BadgeState, BadgeType } from '@/types'

const ICONS: Record<BadgeType, typeof Crown> = {
  'bar-crawl-king': Crown,
  'night-owl': Moon,
  'borough-hopper': MapIcon,
  regular: Repeat,
  trendsetter: Sparkles,
  'crew-leader': Users,
  'streak-master': Flame,
  'vibe-curator': Beer,
  explorer: Compass,
  'summer-legend': Sun,
}

export function BadgesGrid() {
  const { data: badges, isLoading, isError } = useBadges()
  const [selected, setSelected] = useState<BadgeState | null>(null)

  if (isError) return <p className="mt-8 text-center text-sm text-text-2">Badges unavailable.</p>
  if (isLoading)
    return (
      <div className="grid grid-cols-3 gap-5">
        {Array.from({ length: 9 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    )

  return (
    <>
      <div className="grid grid-cols-3 gap-5" role="list" aria-label="Badges">
        {(badges ?? []).map((badge) => {
          const Icon = ICONS[badge.def.type]
          return (
            <button
              key={badge.def.type}
              type="button"
              role="listitem"
              aria-label={`${badge.def.name} — ${badge.unlocked ? 'unlocked' : 'locked'}`}
              onClick={() => setSelected(badge)}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-full ${
                  badge.unlocked
                    ? 'gradient-blue glow-blue'
                    : 'bg-surface opacity-40 grayscale'
                }`}
              >
                <Icon size={28} color={badge.unlocked ? '#fff' : '#475569'} />
                {!badge.unlocked && (
                  <Lock size={13} color="#94A3B8" className="absolute -bottom-0.5 -right-0.5" />
                )}
              </span>
              <span className="text-center text-[11px] leading-tight text-text-2">{badge.def.name}</span>
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {selected?.unlocked && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              role="dialog"
              aria-label={`${selected.def.name} details`}
              className="glass w-full bg-raised p-6 text-center"
              initial={{ scale: 0.4 }}
              animate={{ scale: [0.4, 1.15, 1] }}
              transition={{ duration: 0.5, type: 'spring' as const, bounce: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full gradient-blue glow-blue">
                {(() => {
                  const Icon = ICONS[selected.def.type]
                  return <Icon size={34} color="#fff" />
                })()}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-text-1">{selected.def.name}</h3>
              <p className="mt-1 text-sm text-text-2">{selected.def.description}</p>
              {selected.unlockedAt && (
                <p className="mt-3 font-mono text-xs text-cyan">
                  Unlocked {new Date(selected.unlockedAt).toLocaleDateString()}
                </p>
              )}
              <button
                type="button"
                aria-label="Share badge"
                className="mt-5 w-full rounded-2xl gradient-blue py-3 text-sm font-semibold text-white glow-blue"
              >
                Share
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomSheet
        open={selected !== null && !selected.unlocked}
        onClose={() => setSelected(null)}
        ariaLabel="Badge progress"
      >
        {selected && !selected.unlocked && (
          <div className="pb-2">
            <h3 className="font-display text-xl font-semibold text-text-1">{selected.def.name}</h3>
            <p className="mt-1 text-sm text-text-2">{selected.def.description}</p>
            <ProgressBar
              value={selected.progress / selected.def.target}
              className="mt-5 !h-2"
              fillClassName="bg-cyan"
            />
            <p className="mt-2 font-mono text-xs text-text-2">
              {selected.progress} / {selected.def.target}
            </p>
          </div>
        )}
      </BottomSheet>
    </>
  )
}
