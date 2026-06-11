import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const PULSE_COLORS = ['#0066FF', '#00D4FF', '#3B82F6', '#EEF2FF']

export function fireConfetti() {
  void confetti({
    particleCount: 120,
    spread: 75,
    origin: { y: 0.6 },
    colors: PULSE_COLORS,
    disableForReducedMotion: true,
  })
}

/** Fires once on mount — drop into the tree when a celebration should happen. */
export function ConfettiBlast() {
  useEffect(() => {
    fireConfetti()
  }, [])
  return null
}
