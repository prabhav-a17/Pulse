import type { ReactNode } from 'react'

interface TopBarProps {
  title?: string
  left?: ReactNode
  right?: ReactNode
  overlay?: boolean
}

export function TopBar({ title, left, right, overlay = false }: TopBarProps) {
  return (
    <header
      className={`${
        overlay ? 'absolute inset-x-3 top-3 z-30 glass' : 'sticky top-0 z-30 border-b border-[rgba(0,150,255,0.1)] bg-base/85 backdrop-blur-xl'
      } flex items-center justify-between gap-2 px-4 py-3`}
    >
      <div className="flex items-center gap-2">
        {left}
        {title && <h1 className="font-display text-lg font-semibold text-text-1">{title}</h1>}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </header>
  )
}
