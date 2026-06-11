import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface PillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  glow?: boolean
  children: ReactNode
}

export function Pill({ active = false, glow = false, children, className = '', ...rest }: PillProps) {
  return (
    <button
      type="button"
      className={`pill transition-all duration-150 ${active ? 'pill-active' : ''} ${
        active && glow ? 'glow-cyan' : ''
      } ${className}`}
      aria-pressed={active}
      {...rest}
    >
      {children}
    </button>
  )
}
