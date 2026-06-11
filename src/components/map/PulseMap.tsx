import { useEffect, useMemo, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MAPBOX_STYLE, MAPBOX_TOKEN, NYC_CENTER, NYC_ZOOM } from '@/lib/mapbox'
import { findUser } from '@/lib/seedData'
import { useMapStore } from '@/store/useMapStore'
import { HeatBlob, syncHeatmapLayer } from './HeatmapLayer'
import { FriendPin } from './FriendPins'
import { VenueMarker } from './VenueMarker'
import type { Venue } from '@/types'

interface PulseMapProps {
  venues: Venue[]
  liveFriends: { userId: string; venueId: string }[]
}

/** Real Mapbox map when a token is configured, stylized projection otherwise. */
export function PulseMap({ venues, liveFriends }: PulseMapProps) {
  if (MAPBOX_TOKEN) return <RealMap venues={venues} liveFriends={liveFriends} />
  return <FallbackMap venues={venues} liveFriends={liveFriends} />
}

function RealMap({ venues, liveFriends }: PulseMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [loaded, setLoaded] = useState(false)
  const setActiveVenue = useMapStore((s) => s.setActiveVenue)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    mapboxgl.accessToken = MAPBOX_TOKEN
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: MAPBOX_STYLE,
      center: NYC_CENTER,
      zoom: NYC_ZOOM,
      attributionControl: false,
    })
    map.on('load', () => setLoaded(true))
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded) return
    syncHeatmapLayer(map, venues)

    const hottestId = [...venues].sort((a, b) => b.crowdScore - a.crowdScore)[0]?.id
    const markers: mapboxgl.Marker[] = []

    for (const venue of venues) {
      const el = document.createElement('button')
      el.setAttribute('aria-label', `Open ${venue.name}`)
      const size = 8 + (venue.crowdScore / 100) * 10
      el.style.cssText = `width:${size}px;height:${size}px;border-radius:999px;background:#fff;box-shadow:0 0 8px rgba(255,255,255,.6);border:none;cursor:pointer`
      if (venue.id === hottestId) el.classList.add('pulse-ring')
      el.onclick = () => setActiveVenue(venue.id)
      markers.push(new mapboxgl.Marker(el).setLngLat([venue.lng, venue.lat]).addTo(map))
    }

    for (const fc of liveFriends) {
      const user = findUser(fc.userId)
      const venue = venues.find((v) => v.id === fc.venueId)
      if (!user || !venue) continue
      const el = document.createElement('img')
      el.src = user.avatarUrl
      el.alt = `${user.username} is here`
      el.style.cssText =
        'width:30px;height:30px;border-radius:999px;border:2px solid #00D4FF;box-shadow:0 0 12px rgba(0,212,255,.5);background:#12122A'
      markers.push(
        new mapboxgl.Marker(el).setLngLat([venue.lng + 0.0012, venue.lat + 0.0012]).addTo(map),
      )
    }

    return () => markers.forEach((m) => m.remove())
  }, [venues, liveFriends, loaded, setActiveVenue])

  return <div ref={containerRef} className="h-full w-full" aria-label="Live venue map" />
}

/** Demo-mode map: dark grid with venues projected by lat/lng. */
function FallbackMap({ venues, liveFriends }: PulseMapProps) {
  const setActiveVenue = useMapStore((s) => s.setActiveVenue)

  const bounds = useMemo(() => {
    const lats = venues.map((v) => v.lat)
    const lngs = venues.map((v) => v.lng)
    return {
      minLat: Math.min(...lats) - 0.01,
      maxLat: Math.max(...lats) + 0.01,
      minLng: Math.min(...lngs) - 0.012,
      maxLng: Math.max(...lngs) + 0.012,
    }
  }, [venues])

  const project = (lat: number, lng: number) => ({
    left: `${((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100}%`,
    top: `${(1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100}%`,
  })

  const hottestId = useMemo(
    () => [...venues].sort((a, b) => b.crowdScore - a.crowdScore)[0]?.id,
    [venues],
  )

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      aria-label="Live venue map"
      style={{
        background:
          'radial-gradient(circle at 35% 30%, #0B0B22 0%, #07070F 60%), #07070F',
        backgroundImage:
          'linear-gradient(rgba(0,150,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,150,255,0.05) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }}
    >
      {/* stylized East River divider */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[46%] w-[10%] -skew-x-12 bg-[rgba(0,100,255,0.06)]"
      />
      {venues.map((v) => {
        const pos = project(v.lat, v.lng)
        return (
          <div key={v.id} className="absolute" style={pos}>
            <HeatBlob crowdScore={v.crowdScore} />
            <div className="-translate-x-1/2 -translate-y-1/2">
              <VenueMarker
                crowdScore={v.crowdScore}
                hottest={v.id === hottestId}
                name={v.name}
                onClick={() => setActiveVenue(v.id)}
              />
            </div>
          </div>
        )
      })}
      {liveFriends.map((fc, i) => {
        const user = findUser(fc.userId)
        const venue = venues.find((v) => v.id === fc.venueId)
        if (!user || !venue) return null
        const pos = project(venue.lat + 0.003, venue.lng + 0.003 + i * 0.0008)
        return (
          <div key={fc.userId} className="absolute -translate-x-1/2 -translate-y-1/2" style={pos}>
            <FriendPin user={user} />
          </div>
        )
      })}
    </div>
  )
}
