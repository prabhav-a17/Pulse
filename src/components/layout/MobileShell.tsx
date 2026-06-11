import type { ReactNode } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'

export function MobileShell({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <div className="relative h-full w-full overflow-hidden" style={{ background: '#05050E' }}>{children}</div>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#04040A]">
      <div
        className="relative h-[844px] w-[390px] overflow-hidden rounded-[44px] border border-white/10"
        style={{
          background: '#09090F',
          boxShadow:
            '0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.9), 0 0 140px rgba(0,120,255,0.12), 0 0 60px rgba(0,200,255,0.06)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
