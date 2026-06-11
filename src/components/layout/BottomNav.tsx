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
        className="relative flex h-full w-14 flex-col items-center justify-center"
      >
        <Icon size={22} color={active ? '#00D4FF' : '#2D2D4A'} strokeWidth={active ? 2.2 : 1.8} />
        {active && (
          <motion.span
            layoutId="nav-dot"
            className="absolute bottom-2 h-[3px] w-[3px] rounded-full bg-cyan"
          />
        )}
      </NavLink>
    )
  }

  return (
    <nav
      aria-label="Main navigation"
      className="absolute inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-[rgba(0,150,255,0.08)] px-2 backdrop-blur-xl"
      style={{ background: 'rgba(9,9,15,0.92)' }}
    >
      {renderTab(TABS[0])}
      {renderTab(TABS[1])}
      <motion.button
        type="button"
        aria-label="Start a group night"
        onClick={openSheet}
        className="-mt-5 flex h-[52px] w-[52px] items-center justify-center rounded-full gradient-blue glow-blue"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Zap size={22} color="#fff" fill="#fff" />
      </motion.button>
      {renderTab(TABS[2])}
      {renderTab(TABS[3])}
    </nav>
  )
}
