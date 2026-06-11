import { useState } from 'react'
import { motion } from 'framer-motion'
import { FriendsBoard } from './FriendsBoard'
import { CityBoard } from './CityBoard'
import { BadgesGrid } from './BadgesGrid'

type SocialTab = 'friends' | 'nyc' | 'badges'

const TABS: { id: SocialTab; label: string }[] = [
  { id: 'friends', label: 'Friends' },
  { id: 'nyc', label: 'NYC' },
  { id: 'badges', label: 'Badges' },
]

export default function Social() {
  const [tab, setTab] = useState<SocialTab>('friends')

  return (
    <div className="flex h-full flex-col overflow-hidden px-4 pt-5">
      <h1 className="font-display text-2xl font-semibold text-text-1">Social</h1>

      {/* Underline-style tab switcher */}
      <div className="mt-4 flex border-b border-[rgba(255,255,255,0.07)]" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`relative mr-6 pb-3 text-[13px] font-medium ${
              tab === t.id ? 'text-text-1' : 'text-text-3'
            }`}
          >
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId="tab-underline"
                className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-cyan"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="no-scrollbar mt-4 flex-1 overflow-y-auto pb-28">
        {tab === 'friends' && <FriendsBoard />}
        {tab === 'nyc' && <CityBoard />}
        {tab === 'badges' && <BadgesGrid />}
      </div>
    </div>
  )
}
