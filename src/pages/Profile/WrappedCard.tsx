import { forwardRef } from 'react'
import type { ProfileStats, User, Venue } from '@/types'

interface WrappedCardProps {
  user: User
  stats: ProfileStats
  topVenue: Venue | undefined
  identity: string
}

/** Off-screen 390×700 card rendered to PNG by html2canvas. */
export const WrappedCard = forwardRef<HTMLDivElement, WrappedCardProps>(function WrappedCard(
  { user, stats, topVenue, identity },
  ref,
) {
  return (
    <div
      ref={ref}
      className="absolute -left-[9999px] top-0 flex h-[700px] w-[390px] flex-col items-center px-10 py-14"
      style={{ background: 'linear-gradient(180deg, #07070F 0%, #0A0020 100%)' }}
      aria-hidden="true"
    >
      <p className="font-display text-2xl font-semibold text-gradient-cyan">Pulse</p>
      <p className="mt-10 font-display text-xl text-text-1">@{user.username}</p>
      <p className="mt-1 text-center text-sm text-gradient-cyan">{identity}</p>

      <div className="mt-14 space-y-8 text-center">
        <div>
          <p className="font-mono text-5xl font-semibold text-cyan">{stats.totalNights}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-text-2">Nights out</p>
        </div>
        <div>
          <p className="font-mono text-5xl font-semibold text-cyan">{stats.uniqueVenues}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-text-2">Venues</p>
        </div>
        <div>
          <p className="font-mono text-5xl font-semibold text-cyan">{stats.neighborhoods}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-text-2">Neighborhoods</p>
        </div>
      </div>

      <div className="mt-auto text-center">
        {topVenue && (
          <p className="text-sm text-text-1">
            Top spot: <span className="text-cyan">{topVenue.name}</span>
          </p>
        )}
        <div className="mt-3 flex justify-center gap-2">
          {user.vibeTags.slice(0, 3).map((v) => (
            <span key={v} className="pill pill-active">
              {v}
            </span>
          ))}
        </div>
        <p className="mt-8 text-[11px] text-text-3">Made on Pulse</p>
      </div>
    </div>
  )
})
