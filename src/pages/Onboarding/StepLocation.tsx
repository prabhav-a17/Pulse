import { MapPin } from 'lucide-react'

export function StepLocation() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[rgba(0,212,255,0.08)] glow-cyan">
        <MapPin size={48} color="#00D4FF" strokeWidth={1.5} />
      </div>
      <h2 className="mt-8 font-display text-3xl font-semibold text-text-1">Turn on location</h2>
      <p className="mx-auto mt-2 max-w-[260px] text-sm text-text-2">
        Pulse uses your location to show what's hot around you — never shared without your say.
      </p>
    </div>
  )
}
