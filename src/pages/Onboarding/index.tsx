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

  return (
    <div className="onboarding-bg flex h-full flex-col px-6 pb-10 pt-16">
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

      <div className="space-y-6">
        {step < 2 ? (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={next}
            aria-label="Continue"
            className="w-full rounded-2xl gradient-blue py-3.5 font-semibold text-white glow-blue transition-opacity disabled:opacity-30"
          >
            Continue
          </button>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={finish}
              aria-label="Grant location and finish"
              className="w-full rounded-2xl gradient-blue py-3.5 font-semibold text-white glow-blue"
            >
              Let's go ⚡
            </button>
            <button type="button" onClick={finish} className="w-full py-2 text-sm text-text-3" aria-label="Maybe later">
              Maybe later
            </button>
          </div>
        )}
        <div className="flex justify-center gap-2" aria-label={`Step ${step + 1} of 3`}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-cyan glow-cyan' : 'w-1.5 bg-text-3'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
