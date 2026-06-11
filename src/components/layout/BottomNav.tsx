import { Compass, MapPin, Trophy, User, Zap } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGroupStore } from '@/store/useGroupStore'

const TABS = [
  { to: '/tonight', label: 'Tonight', Icon: MapPin },
  { to: '/explore', label: 'Explore', Icon: Compass },
  { to: '/social', label: 'Social', Icon: Trophy },
  { to: '/profile', label: 'Profile', Icon: User },
] as const

export function BottomNav() {
  const { pathname } = useLocation()
  const openSheet = useGroupStore((s) => s.openSheet)

  const renderTab = ({ to, label, Icon }: (typeof TABS)[number]) => {
    const active = pathname.startsWith(to)
    return (
      <NavLink
        key={to}
        to={to}
        aria-label={label}
        className="relative flex h-full w-14 flex-col items-center justify-center gap-0.5"
      >
        <Icon size={22} color={active ? '#00D4FF' : '#475569'} strokeWidth={active ? 2.2 : 1.8} />
        {active && (
          <>
            <span className="text-[10px] font-medium text-cyan">{label}</span>
            <motion.span
              layoutId="nav-dot"
              className="absolute bottom-1 h-1 w-1 rounded-full bg-cyan glow-cyan"
            />
          </>
        )}
      </NavLink>
    )
  }

  return (
    <nav
      aria-label="Main navigation"
      className="absolute inset-x-0 bottom-0 z-30 flex h-[72px] items-center justify-around border-t border-[rgba(0,150,255,0.1)] px-2 pb-2 backdrop-blur-xl"
      style={{ background: 'rgba(7, 7, 15, 0.85)' }}
    >
      {renderTab(TABS[0])}
      {renderTab(TABS[1])}
      <button
        type="button"
        aria-label="Start a group night"
        onClick={openSheet}
        className="fab-pulse -mt-6 flex h-14 w-14 items-center justify-center rounded-full gradient-blue glow-blue"
      >
        <Zap size={24} color="#fff" fill="#fff" />
      </button>
      {renderTab(TABS[2])}
      {renderTab(TABS[3])}
    </nav>
  )
}
