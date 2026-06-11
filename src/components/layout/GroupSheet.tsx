import { useState } from 'react'
import { BottomSheet } from '@/components/layout/BottomSheet'
import { Avatar } from '@/components/ui/Avatar'
import { useFriends } from '@/hooks/useFriends'
import { useGroupStore } from '@/store/useGroupStore'

export function GroupSheet() {
  const { sheetOpen, closeSheet, startGroup } = useGroupStore()
  const { data: friends } = useFriends()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const start = () => {
    startGroup({
      id: `g-${Date.now()}`,
      name: 'Tonight',
      venueId: null,
      memberIds: selected,
      nightDate: new Date().toISOString().slice(0, 10),
    })
    setSelected([])
    if (navigator.vibrate) navigator.vibrate(50)
  }

  return (
    <BottomSheet open={sheetOpen} onClose={closeSheet} ariaLabel="Start a group night">
      <h2 className="font-display text-xl font-semibold text-text-1">Start a group night</h2>
      <p className="mt-1 text-sm text-text-2">Pick the crew. Everyone sees the same map.</p>
      <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
        {(friends ?? []).map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => toggle(f.id)}
            aria-label={`${selected.includes(f.id) ? 'Remove' : 'Add'} ${f.username}`}
            aria-pressed={selected.includes(f.id)}
            className="flex flex-col items-center gap-1.5"
          >
            <Avatar src={f.avatarUrl} alt={f.username} size={48} ring={selected.includes(f.id)} />
            <span className={`text-[10px] ${selected.includes(f.id) ? 'text-cyan' : 'text-text-3'}`}>
              {f.username}
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={selected.length === 0}
        onClick={start}
        aria-label="Start group night"
        className="mt-5 w-full rounded-2xl gradient-blue py-3.5 font-semibold text-white glow-blue disabled:opacity-30"
      >
        Start the night ⚡
      </button>
    </BottomSheet>
  )
}
