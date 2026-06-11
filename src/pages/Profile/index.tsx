import { useRef, useState } from 'react'
import { Check, Share2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import { Avatar } from '@/components/ui/Avatar'
import { GlassCard } from '@/components/ui/GlassCard'
import { useCountUp } from '@/hooks/useCountUp'
import { findVenue, PROFILE_STATS } from '@/lib/seedData'
import { useAuthStore } from '@/store/useAuthStore'
import { ActivityHeatmap } from './ActivityHeatmap'
import { VibeChart } from './VibeChart'
import { WrappedCard } from './WrappedCard'

function StatCard({ label, value, decimals = 0 }: { label: string; value: number; decimals?: number }) {
  const { ref, value: animated } = useCountUp(value)
  return (
    <GlassCard className="p-4 transition-shadow hover:glow-blue">
      <p
        ref={ref as React.RefObject<HTMLParagraphElement>}
        className="font-mono text-[28px] font-semibold text-cyan"
      >
        {animated.toFixed(decimals)}
      </p>
      <p className="mt-1 font-mono text-xs uppercase tracking-wider text-text-2">{label}</p>
    </GlassCard>
  )
}

export default function Profile() {
  const user = useAuthStore((s) => s.user)
  const stats = PROFILE_STATS
  const wrappedRef = useRef<HTMLDivElement>(null)
  const [sharing, setSharing] = useState(false)

  const topVibe = user.vibeTags[0] ?? 'house'
  const identity = `Late Night ${topVibe.charAt(0).toUpperCase() + topVibe.slice(1)} Head · ${user.homeNeighborhood} Local`
  const topVenue = findVenue(stats.topVenueIds[0] ?? '')

  const share = async () => {
    if (!wrappedRef.current || sharing) return
    setSharing(true)
    try {
      const canvas = await html2canvas(wrappedRef.current, { backgroundColor: '#07070F' })
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'))
      if (!blob) return
      const file = new File([blob], 'pulse-wrapped.png', { type: 'image/png' })
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'My summer on Pulse' })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'pulse-wrapped.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="no-scrollbar h-full overflow-y-auto px-4 pb-28 pt-8">
      <div className="flex flex-col items-center text-center">
        <Avatar src={user.avatarUrl} alt={user.username} size={72} ring />
        <h1 className="mt-3 font-display text-xl font-semibold text-text-1">@{user.username}</h1>
        <p className="mt-1 text-sm font-medium text-gradient-cyan">{identity}</p>
        <p className="mt-2 text-xs text-text-2">
          <span className="font-mono text-cyan">{stats.friendsCount}</span> friends ·{' '}
          <span className="font-mono text-cyan">{stats.totalNights}</span> nights
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard label="Nights out" value={stats.totalNights} />
        <StatCard label="Unique venues" value={stats.uniqueVenues} />
        <StatCard label="Neighborhoods" value={stats.neighborhoods} />
        <StatCard label="Best streak" value={stats.longestStreak} />
      </div>

      <GlassCard className="mt-5 overflow-x-auto p-4">
        <h2 className="mb-3 text-sm font-medium text-text-1">Activity</h2>
        <ActivityHeatmap activityByDay={stats.activityByDay} />
      </GlassCard>

      <GlassCard className="mt-5 p-4">
        <h2 className="mb-1 text-sm font-medium text-text-1">Vibe breakdown</h2>
        <VibeChart data={stats.vibeBreakdown} />
      </GlassCard>

      <GlassCard className="mt-5 p-4">
        <h2 className="mb-3 text-sm font-medium text-text-1">Top venues</h2>
        <ul className="space-y-3">
          {stats.topVenueIds.map((id, i) => {
            const venue = findVenue(id)
            if (!venue) return null
            return (
              <li key={id} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full gradient-blue font-mono text-[11px] font-semibold text-white">
                  {5 - i}
                </span>
                <span className="flex-1 text-sm text-text-1">{venue.name}</span>
                <span className="text-xs text-text-2">{venue.neighborhood}</span>
                <Check size={15} color="#00D4FF" aria-label="Would return" />
              </li>
            )
          })}
        </ul>
      </GlassCard>

      <button
        type="button"
        onClick={() => void share()}
        disabled={sharing}
        aria-label="Share my summer recap"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl gradient-blue py-3.5 font-semibold text-white glow-blue disabled:opacity-60"
      >
        <Share2 size={17} />
        {sharing ? 'Rendering…' : 'Share my summer'}
      </button>

      <WrappedCard ref={wrappedRef} user={user} stats={stats} topVenue={topVenue} identity={identity} />
    </div>
  )
}
