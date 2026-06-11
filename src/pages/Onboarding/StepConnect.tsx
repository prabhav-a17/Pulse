import { AtSign, UsersRound } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export function StepConnect({ onSkip }: { onSkip: () => void }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-semibold text-text-1">Find your crew</h2>
      <p className="mt-2 text-sm text-text-2">Nights are better when your people show up on the map.</p>
      <div className="mt-8 space-y-4">
        <GlassCard className="flex w-full cursor-pointer items-center gap-4 p-4" role="button" tabIndex={0} aria-label="Connect contacts">
          <span className="flex h-11 w-11 items-center justify-center rounded-full gradient-blue">
            <UsersRound size={20} color="#fff" />
          </span>
          <div>
            <p className="font-medium text-text-1">Connect contacts</p>
            <p className="text-xs text-text-2">See which friends are already on Pulse</p>
          </div>
        </GlassCard>
        <GlassCard className="flex w-full cursor-pointer items-center gap-4 p-4" role="button" tabIndex={0} aria-label="Link Instagram">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo">
            <AtSign size={20} color="#fff" />
          </span>
          <div>
            <p className="font-medium text-text-1">Link Instagram</p>
            <p className="text-xs text-text-2">Import your circle in one tap</p>
          </div>
        </GlassCard>
      </div>
      <button type="button" onClick={onSkip} className="mt-6 text-sm text-text-3" aria-label="Skip this step">
        Skip for now
      </button>
    </div>
  )
}
