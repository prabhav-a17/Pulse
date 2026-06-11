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

      <div className="mt-4 flex gap-1 rounded-full bg-surface p-1" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`relative flex-1 rounded-full py-2 text-[13px] font-medium ${
              tab === t.id ? 'text-white' : 'text-text-3'
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute inset-0 rounded-full gradient-blue glow-blue"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            <span className="relative">{t.label}</span>
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
