import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/Skeleton'
import { Pill } from '@/components/ui/Pill'
import { useVenues } from '@/hooks/useVenues'
import { useMapStore } from '@/store/useMapStore'
import { useNavigate } from 'react-router-dom'
import { VenueCard } from './VenueCard'

type ExploreFilter = 'all' | 'neighborhood' | 'vibe' | 'price' | 'open'

const FILTERS: { id: ExploreFilter; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'neighborhood', label: 'neighborhood' },
  { id: 'vibe', label: 'vibe' },
  { id: 'price', label: 'price' },
  { id: 'open', label: 'open now' },
]

export default function Explore() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<ExploreFilter>('all')
  const { data: venues, isLoading, isError } = useVenues()
  const setActiveVenue = useMapStore((s) => s.setActiveVenue)
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    if (!venues) return []
    let list = venues
    if (query) {
      const q = query.toLowerCase()
      list = list.filter(
        (v) => v.name.toLowerCase().includes(q) || v.neighborhood.toLowerCase().includes(q),
      )
    }
    switch (filter) {
      case 'open':
        return list.filter((v) => v.openNow)
      case 'price':
        return [...list].sort((a, b) => a.priceLevel - b.priceLevel)
      case 'vibe':
        return [...list].sort((a, b) => b.matchScore - a.matchScore)
      case 'neighborhood':
        return [...list].sort((a, b) => a.neighborhood.localeCompare(b.neighborhood))
      default:
        return list
    }
  }, [venues, query, filter])

  const openVenue = (id: string) => {
    setActiveVenue(id)
    navigate('/tonight')
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="sticky top-0 z-20 space-y-3 bg-base/85 px-4 pb-3 pt-5 backdrop-blur-xl">
        <div className="glass flex items-center gap-2 px-4 py-2.5 focus-within:ring-1 focus-within:ring-cyan">
          <Search size={16} color="#475569" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search venues, neighborhoods…"
            aria-label="Search venues"
            className="w-full bg-transparent text-sm text-text-1 placeholder:text-text-3 focus:outline-none"
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <Pill
              key={f.id}
              active={filter === f.id}
              onClick={() => setFilter(f.id)}
              className="whitespace-nowrap"
              aria-label={`Filter by ${f.label}`}
            >
              {f.label}
            </Pill>
          ))}
        </div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-28 pt-1">
        {isError && (
          <p className="mt-12 text-center text-sm text-text-2">Couldn't load venues. Try again.</p>
        )}
        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[280px] w-full !rounded-[20px]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="mt-12 text-center text-sm text-text-2">Nothing nearby matches. Loosen up the filters.</p>
        ) : (
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
          >
            {filtered.map((venue) => (
              <VenueCard key={venue.id} venue={venue} onSelect={openVenue} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
