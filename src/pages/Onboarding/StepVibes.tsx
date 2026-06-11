import { Pill } from '@/components/ui/Pill'
import { ALL_VIBES, type VibeTag } from '@/types'

interface StepVibesProps {
  selected: VibeTag[]
  onToggle: (vibe: VibeTag) => void
}

export function StepVibes({ selected, onToggle }: StepVibesProps) {
  return (
    <div>
      <h2 className="font-display text-4xl font-semibold text-text-1 leading-tight">Your vibe.</h2>
      <p className="mt-3 text-base text-text-2">Pick what moves you.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {ALL_VIBES.map((vibe) => (
          <Pill
            key={vibe}
            active={selected.includes(vibe)}
            glow
            onClick={() => onToggle(vibe)}
            className="!px-5 !py-3 !text-sm"
            aria-label={`Select ${vibe}`}
          >
            {vibe}
          </Pill>
        ))}
      </div>
    </div>
  )
}
