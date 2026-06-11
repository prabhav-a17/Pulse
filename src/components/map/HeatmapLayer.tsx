import type { Map as MapboxMap } from 'mapbox-gl'
import type { Venue } from '@/types'

const SOURCE_ID = 'venue-heat'
const LAYER_ID = 'venue-heat-layer'

/** Adds/updates the crowd heatmap layer on a live Mapbox map. */
export function syncHeatmapLayer(map: MapboxMap, venues: Venue[]) {
  const geojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: venues.map((v) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [v.lng, v.lat] },
      properties: { weight: v.crowdScore / 100 },
    })),
  }

  const existing = map.getSource(SOURCE_ID)
  if (existing && 'setData' in existing) {
    existing.setData(geojson)
    return
  }

  map.addSource(SOURCE_ID, { type: 'geojson', data: geojson })
  map.addLayer({
    id: LAYER_ID,
    type: 'heatmap',
    source: SOURCE_ID,
    paint: {
      'heatmap-weight': ['get', 'weight'],
      'heatmap-intensity': 1.2,
      'heatmap-radius': 46,
      'heatmap-opacity': 0.75,
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(16,185,129,0)',
        0.3, '#10B981',
        0.65, '#F59E0B',
        1, '#EF4444',
      ],
    },
  })
}

/** Demo-mode glow blob matching the heatmap color ramp. */
export function HeatBlob({ crowdScore }: { crowdScore: number }) {
  const color = crowdScore > 80 ? '#EF4444' : crowdScore > 55 ? '#F59E0B' : '#10B981'
  const size = 50 + crowdScore
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color}55 0%, ${color}22 45%, transparent 70%)`,
      }}
    />
  )
}
