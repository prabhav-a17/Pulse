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
