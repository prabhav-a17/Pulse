import { useEffect, useMemo, useRef, useState } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'
import { GOOGLE_MAPS_KEY, MAP_STYLES, NYC_CENTER, NYC_ZOOM } from '@/lib/maps'
import { findUser } from '@/lib/seedData'
import { useMapStore } from '@/store/useMapStore'
import { HeatBlob } from './HeatmapLayer'
import { FriendPin } from './FriendPins'
import { VenueMarker } from './VenueMarker'
import type { Venue } from '@/types'

interface PulseMapProps {
  venues: Venue[]
  liveFriends: { userId: string; venueId: string }[]
}

/** Real Google Map when an API key is configured, stylized fallback otherwise. */
export function PulseMap({ venues, liveFriends }: PulseMapProps) {
  if (GOOGLE_MAPS_KEY) return <RealMap venues={venues} liveFriends={liveFriends} />
  return <FallbackMap venues={venues} liveFriends={liveFriends} />
}

function RealMap({ venues, liveFriends }: PulseMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const [loaded, setLoaded] = useState(false)
  const setActiveVenue = useMapStore((s) => s.setActiveVenue)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    setOptions({ key: GOOGLE_MAPS_KEY })
    importLibrary('maps').then(() => {
      if (!containerRef.current) return
      const map = new google.maps.Map(containerRef.current, {
        center: NYC_CENTER,
        zoom: NYC_ZOOM,
        styles: MAP_STYLES,
        disableDefaultUI: true,
        clickableIcons: false,
      })
      mapRef.current = map
      setLoaded(true)
    })
    return () => {
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !loaded) return

    const hottestId = [...venues].sort((a, b) => b.crowdScore - a.crowdScore)[0]?.id
    const markers: google.maps.Marker[] = []

    for (const venue of venues) {
      const size = 8 + (venue.crowdScore / 100) * 10
      const isHottest = venue.id === hottestId
      const marker = new google.maps.Marker({
        position: { lat: venue.lat, lng: venue.lng },
        map,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${isHottest ? '#00D4FF' : 'white'}" opacity="0.9"/></svg>`
          ),
          scaledSize: new google.maps.Size(size, size),
          anchor: new google.maps.Point(size / 2, size / 2),
        },
        title: venue.name,
      })
      marker.addListener('click', () => setActiveVenue(venue.id))
      markers.push(marker)
    }

    for (const fc of liveFriends) {
      const user = findUser(fc.userId)
      const venue = venues.find((v) => v.id === fc.venueId)
      if (!user || !venue) continue
      const imgMarker = new google.maps.Marker({
        position: { lat: venue.lat + 0.0012, lng: venue.lng + 0.0012 },
        map,
        icon: {
          url: user.avatarUrl,
          scaledSize: new google.maps.Size(30, 30),
          anchor: new google.maps.Point(15, 15),
        },
        title: `${user.username} is here`,
      })
      markers.push(imgMarker)
    }

    return () => markers.forEach((m) => m.setMap(null))
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
