interface VenueMarkerProps {
  crowdScore: number
  hottest: boolean
  name: string
  onClick: () => void
}

export function VenueMarker({ crowdScore, hottest, name, onClick }: VenueMarkerProps) {
  const size = 8 + (crowdScore / 100) * 10

  return (
    <button
      type="button"
      aria-label={`Open ${name}`}
      onClick={onClick}
      className="relative flex items-center justify-center"
      style={{ width: 28, height: 28 }}
    >
      {hottest && (
        <span
          className="pulse-ring absolute rounded-full border-2 border-cyan"
          style={{ width: size + 8, height: size + 8 }}
          aria-hidden="true"
        />
      )}
      <span
        className="rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]"
        style={{ width: size, height: size }}
      />
    </button>
  )
}
