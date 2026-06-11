export const GOOGLE_MAPS_KEY = (import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined) ?? ''
export const NYC_CENTER = { lat: 40.7228, lng: -73.9654 }
export const NYC_ZOOM = 12

// Typed as any[] so google namespace isn't required at build time (loaded lazily at runtime)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MAP_STYLES: any[] = [
  { elementType: 'geometry', stylers: [{ color: '#0A0A14' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0A0A14' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#14142A' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1A1A35' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#050510' }] },
  { featureType: 'transit.station', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1A1A40' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ color: '#2D2D5A' }] },
]
