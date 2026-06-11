import type { ReactNode } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  ariaLabel: string
}

export function BottomSheet({ open, onClose, children, ariaLabel }: BottomSheetProps) {
  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.y > 90 || info.velocity.y > 600) onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close sheet"
            className="absolute inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label={ariaLabel}
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] border-t border-x border-[rgba(0,200,255,0.25)] bg-raised px-5 pb-8 pt-3"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
          >
            <div
              className="mx-auto mb-4 h-1 w-9 rounded-full"
              style={{ background: 'var(--border-bright)' }}
              aria-hidden="true"
            />
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
