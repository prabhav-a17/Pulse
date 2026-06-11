import { memo, useState } from 'react'
import { Crown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import type { LeaderboardEntry, LeaderboardMetric } from '@/types'

const METRICS: { id: LeaderboardMetric; label: string }[] = [
  { id: 'barsPerNight', label: 'Bars/night' },
  { id: 'streak', label: 'Streak' },
  { id: 'uniqueSpots', label: 'Unique spots' },
  { id: 'hoods', label: 'Hoods' },
]

const CROWN_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']

interface RowEntry extends LeaderboardEntry {
  currentStat: number
  displayStat: string
}

const Row = memo(function Row({ entry, max }: { entry: RowEntry; max: number }) {
  return (
    <motion.li
      layout
      layoutId={entry.user.id}
      transition={{ type: 'spring', stiffness: 500, damping: 50 }}
      className={`flex items-center gap-4 rounded-2xl px-3 py-3 ${
        entry.isYou
          ? 'border border-[rgba(0,212,255,0.2)] bg-[rgba(0,100,255,0.08)]'
          : ''
      }`}
    >
      <span className="w-7 text-center">
        {entry.rank <= 3 ? (
          <Crown size={16} color={CROWN_COLORS[entry.rank - 1]} fill={CROWN_COLORS[entry.rank - 1]} />
        ) : (
          <span className="font-mono text-sm font-bold text-text-3">{entry.rank}</span>
        )}
      </span>
      <Avatar src={entry.user.avatarUrl} alt={entry.user.username} size={42} ring={entry.rank <= 3} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-1">
          {entry.isYou ? 'You' : entry.user.username}
        </p>
        <ProgressBar value={max > 0 ? entry.currentStat / max : 0} className="mt-1.5" />
      </div>
      <span className="font-mono text-sm font-medium text-cyan">{entry.displayStat}</span>
    </motion.li>
  )
})

export function FriendsBoard() {
  const [metric, setMetric] = useState<LeaderboardMetric>('barsPerNight')
  const { data, isLoading, isError } = useLeaderboard(metric)

  const rows: RowEntry[] = (data ?? []).map((e) => ({
    ...e,
    currentStat: e.stats[metric],
    displayStat:
      metric === 'barsPerNight' ? e.stats[metric].toFixed(1) : String(e.stats[metric]),
  }))
  const max = rows[0]?.currentStat ?? 1
  const you = rows.find((r) => r.isYou)
  const ahead = you && you.rank > 1 ? rows[you.rank - 2] : null

  return (
    <div>
      <div className="flex gap-4 border-b border-[rgba(255,255,255,0.07)] px-1">
        {METRICS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMetric(m.id)}
            aria-label={`Sort by ${m.label}`}
            className={`relative pb-2 text-[13px] font-medium ${
              metric === m.id ? 'text-cyan' : 'text-text-3'
            }`}
          >
            {m.label}
            {metric === m.id && (
              <motion.span
                layoutId="metric-indicator"
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-cyan glow-cyan"
              />
            )}
          </button>
        ))}
      </div>

      {you && ahead && (
        <p className="glass mt-3 px-4 py-2 text-xs text-cyan">
          You're #{you.rank} · {ahead.isYou ? '' : `${(ahead.currentStat - you.currentStat).toFixed(metric === 'barsPerNight' ? 1 : 0)} behind ${ahead.user.username}`} 👀
        </p>
      )}

      {isError && <p className="mt-8 text-center text-sm text-text-2">Leaderboard unavailable.</p>}
      {isLoading ? (
        <div className="mt-4 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <ul className="mt-3 space-y-1" aria-label="Friends leaderboard">
          {rows.map((entry) => (
            <Row key={entry.user.id} entry={entry} max={max} />
          ))}
        </ul>
      )}
    </div>
  )
}
