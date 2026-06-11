import { Pill } from '@/components/ui/Pill'
import { ALL_VIBES, type VibeTag } from '@/types'

interface StepVibesProps {
  selected: VibeTag[]
  onToggle: (vibe: VibeTag) => void
}

export function StepVibes({ selected, onToggle }: StepVibesProps) {
  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-text-1">What moves you?</h2>
      <p className="mt-2 text-sm text-text-2">Pick at least 2 — we'll tune your map to it.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {ALL_VIBES.map((vibe) => (
          <Pill
            key={vibe}
            active={selected.includes(vibe)}
            glow
            onClick={() => onToggle(vibe)}
            className="!px-4 !py-2 !text-sm"
            aria-label={`Select ${vibe}`}
          >
            {vibe}
          </Pill>
        ))}
      </div>
    </div>
  )
}
