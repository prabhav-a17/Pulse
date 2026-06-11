import { useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Pill } from '@/components/ui/Pill'
import { useSubmitRating } from '@/hooks/useRatings'
import { useVenues } from '@/hooks/useVenues'
import { useCheckins } from '@/hooks/useCheckins'
import { useAuthStore } from '@/store/useAuthStore'
import { ALL_ATTRIBUTES, type RatingAttribute, type Venue } from '@/types'
import { SwipeCard } from './SwipeCard'

interface PendingRating {
  venue: Venue
  checkinId: string
}

export default function Rate() {
  const navigate = useNavigate()
  const userId = useAuthStore((s) => s.user.id)
  const { data: venues } = useVenues()
  const { data: checkins } = useCheckins()
  const submitRating = useSubmitRating()

  const queue: PendingRating[] = useMemo(() => {
    if (!venues || !checkins) return []
    const unrated = checkins.filter((c) => c.userId === userId && !c.rated)
    const source = unrated.length > 0 ? unrated : checkins.slice(0, 3)
    return source
      .map((c) => {
        const venue = venues.find((v) => v.id === c.venueId)
        return venue ? { venue, checkinId: c.id } : null
      })
      .filter((p): p is PendingRating => p !== null)
      .slice(0, 5)
  }, [venues, checkins, userId])

  const [index, setIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const [phase, setPhase] = useState<'swipe' | 'detail' | 'done'>('swipe')
  const [attrs, setAttrs] = useState<RatingAttribute[]>([])
  const [note, setNote] = useState('')
  const [toast, setToast] = useState(false)

  const current = queue[index]
  const next = queue[index + 1]

  const onSwipe = (wasLiked: boolean) => {
    setLiked(wasLiked)
    setPhase('detail')
  }

  const toggleAttr = (a: RatingAttribute) =>
    setAttrs((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))

  const submit = () => {
    if (!current) return
    submitRating.mutate({
      venueId: current.venue.id,
      checkinId: current.checkinId,
      wouldReturn: liked,
      attributes: attrs,
      note,
    })
    setToast(true)
    setTimeout(() => setToast(false), 1800)
    setAttrs([])
    setNote('')
    if (index + 1 < queue.length) {
      setIndex((i) => i + 1)
      setPhase('swipe')
    } else {
      setPhase('done')
      setTimeout(() => navigate('/tonight'), 1400)
    }
  }

  if (!current && phase !== 'done') {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-lg text-text-1">All caught up</p>
        <p className="mt-2 text-sm text-text-2">No nights waiting on a rating.</p>
        <button
          type="button"
          onClick={() => navigate('/tonight')}
          className="mt-6 rounded-2xl gradient-blue px-6 py-3 text-sm font-semibold text-white glow-blue"
          aria-label="Back to map"
        >
          Back to the map
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col px-5 pb-28 pt-8">
      <h1 className="font-display text-2xl font-semibold text-text-1">Last night</h1>
      <p className="mt-1 text-sm text-text-2">Rate it while it's still a memory.</p>

      {phase === 'swipe' && current && (
        <div className="relative mt-6 flex-1">
          {next && (
            <div className="glass absolute inset-0 scale-[0.94] opacity-50">
              <div className="flex h-full items-center justify-center">
                <p className="font-display text-lg text-text-2">{next.venue.name}</p>
              </div>
            </div>
          )}
          <AnimatePresence>
            <SwipeCard key={current.venue.id + index} venue={current.venue} onSwipe={onSwipe} />
          </AnimatePresence>
        </div>
      )}

      {phase === 'detail' && current && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex-1">
          <p className="font-display text-lg text-text-1">
            {current.venue.name} {liked ? '· going back 💚' : '· skipped'}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ALL_ATTRIBUTES.map((a) => (
              <Pill key={a} active={attrs.includes(a)} glow onClick={() => toggleAttr(a)} aria-label={`Toggle ${a}`}>
                {a}
              </Pill>
            ))}
          </div>
          <div className="glass relative mt-5">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 140))}
              maxLength={140}
              rows={3}
              placeholder="One-liner about the night…"
              aria-label="Rating note"
              className="w-full resize-none bg-transparent p-4 font-mono text-[13px] text-text-1 placeholder:text-text-3 focus:outline-none"
            />
            <span className="absolute bottom-2 right-3 font-mono text-[10px] text-text-3">{note.length}/140</span>
          </div>
          <AnimatePresence>
            {attrs.length >= 1 && (
              <motion.button
                type="button"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                onClick={submit}
                aria-label="Submit rating"
                className="mt-6 w-full rounded-2xl gradient-blue py-3.5 font-semibold text-white glow-blue"
              >
                Submit
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {phase === 'done' && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(0,212,255,0.12)] glow-cyan"
          >
            <Check size={40} color="#00D4FF" strokeWidth={2.5} />
          </motion.span>
          <p className="mt-5 text-sm text-text-1">All rated. See you tonight.</p>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass absolute bottom-24 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap px-5 py-2.5 text-sm text-text-1"
            role="status"
          >
            Taste profile updated 🎯
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
