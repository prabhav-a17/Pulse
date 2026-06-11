import { motion } from 'framer-motion'

interface ProgressBarProps {
  /** 0..1 */
  value: number
  className?: string
  fillClassName?: string
}

export function ProgressBar({ value, className = '', fillClassName = 'gradient-blue' }: ProgressBarProps) {
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-white/5 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={`h-full rounded-full ${fillClassName}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(value, 0), 1) * 100}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 24 }}
      />
    </div>
  )
}
