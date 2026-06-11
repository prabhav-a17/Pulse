import { useState } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCityLeaderboard } from '@/hooks/useLeaderboard'

export function CityBoard() {
  const { data, isLoading, isError } = useCityLeaderboard()
  const [optedIn, setOptedIn] = useState(true)

  const others = (data ?? []).filter((e) => !e.isYou)
  const you = (data ?? []).find((e) => e.isYou)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-1 py-2">
        <p className="text-[13px] text-text-2">NYC board · anonymized</p>
        <button
          type="button"
          role="switch"
          aria-checked={optedIn}
          aria-label="Opt in to city leaderboard"
          onClick={() => setOptedIn((v) => !v)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            optedIn ? 'bg-cyan/30' : 'bg-white/10'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full transition-all ${
              optedIn ? 'left-[22px] bg-cyan glow-cyan' : 'left-0.5 bg-text-3'
            }`}
          />
        </button>
      </div>

      {isError && <p className="mt-8 text-center text-sm text-text-2">City board unavailable.</p>}
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <>
          <ul className="space-y-1" aria-label="NYC leaderboard">
            {others.map((e) => (
              <li key={e.rank} className="flex items-center gap-3 rounded-2xl px-3 py-3">
                <span className="w-8 font-mono text-xs text-text-3">#{e.rank}</span>
                <span className="flex-1 text-sm text-text-1">Someone in {e.neighborhood}</span>
                <span className="font-mono text-sm text-cyan">{e.nights}</span>
              </li>
            ))}
          </ul>
          {you && optedIn && (
            <div className="glass mt-4 flex items-center gap-3 px-4 py-3.5">
              <span className="text-sm font-medium text-text-1">You</span>
              <span className="font-mono text-xs text-text-2">#{you.rank}</span>
              <span className="pill pill-active ml-auto">Top 8%</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
