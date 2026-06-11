import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { fireConfetti } from '@/components/ui/ConfettiBlast'
import { useAuthStore } from '@/store/useAuthStore'
import type { VibeTag } from '@/types'
import { StepVibes } from './StepVibes'
import { StepConnect } from './StepConnect'
import { StepLocation } from './StepLocation'

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [vibes, setVibesLocal] = useState<VibeTag[]>([])
  const navigate = useNavigate()
  const setVibes = useAuthStore((s) => s.setVibes)
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding)

  const toggleVibe = (vibe: VibeTag) =>
    setVibesLocal((prev) => (prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]))

  const next = () => setStep((s) => Math.min(s + 1, 2))

  const finish = () => {
    setVibes(vibes)
    completeOnboarding()
    fireConfetti()
    navigate('/tonight')
  }

  const canAdvance = step !== 0 || vibes.length >= 2
  const progress = ((step + 1) / 3) * 100

  return (
    <div className="flex h-full flex-col" style={{ background: '#09090F' }}>
      {/* Progress bar */}
      <div className="h-[2px] w-full bg-[rgba(255,255,255,0.06)]">
        <motion.div
          className="h-full bg-cyan"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      <div className="flex flex-1 flex-col px-6 pb-10 pt-14">
        <p className="font-display text-xl font-semibold text-gradient-cyan">Pulse</p>
        <div className="mt-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {step === 0 && <StepVibes selected={vibes} onToggle={toggleVibe} />}
              {step === 1 && <StepConnect onSkip={next} />}
              {step === 2 && <StepLocation />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          {step < 2 ? (
            <button
              type="button"
              disabled={!canAdvance}
              onClick={next}
              aria-label="Continue"
              className="flex h-14 w-full items-center justify-center rounded-full bg-white font-semibold text-black transition-opacity disabled:opacity-30"
            >
              Continue
            </button>
          ) : (
            <div className="space-y-3">
              <button
                type="button"
                onClick={finish}
                aria-label="Grant location and finish"
                className="flex h-14 w-full items-center justify-center rounded-full bg-white font-semibold text-black"
              >
                Let's go ⚡
              </button>
              <button type="button" onClick={finish} className="w-full py-2 text-sm text-text-3" aria-label="Maybe later">
                Maybe later
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={step < 2 ? next : finish}
            className="w-full py-2 text-center text-xs text-text-3"
            aria-label="Skip"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
