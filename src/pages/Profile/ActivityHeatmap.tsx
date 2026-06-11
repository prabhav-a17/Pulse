import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const COLS = 15
const ROWS = 7
const CELL = 14
const GAP = 3

const intensityColor = (n: number): string => {
  if (n === 0) return 'rgba(0, 150, 255, 0.05)'
  if (n === 1) return 'rgba(0, 150, 255, 0.25)'
  if (n === 2) return 'rgba(0, 180, 255, 0.5)'
  if (n === 3) return 'rgba(0, 212, 255, 0.72)'
  return '#00D4FF'
}

interface ActivityHeatmapProps {
  /** 105 values, oldest first */
  activityByDay: number[]
}

export function ActivityHeatmap({ activityByDay }: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null)

  const cells = useMemo(() => {
    const today = new Date()
    return activityByDay.slice(0, COLS * ROWS).map((count, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (COLS * ROWS - 1 - i))
      const col = Math.floor(i / ROWS)
      const row = i % ROWS
      const isWeekend = date.getDay() === 5 || date.getDay() === 6
      return { count, date, col, row, isWeekend }
    })
  }, [activityByDay])

  const monthLabels = useMemo(() => {
    const labels: { col: number; text: string }[] = []
    let last = ''
    for (const c of cells) {
      if (c.row !== 0) continue
      const m = c.date.toLocaleString('en-US', { month: 'short' })
      if (m !== last) {
        labels.push({ col: c.col, text: m })
        last = m
      }
    }
    return labels
  }, [cells])

  const width = COLS * (CELL + GAP) + 18
  const height = ROWS * (CELL + GAP) + 16

  return (
    <div className="relative">
      <svg width={width} height={height} role="img" aria-label="Nightlife activity heatmap">
        {monthLabels.map((m) => (
          <text
            key={`${m.text}-${m.col}`}
            x={18 + m.col * (CELL + GAP)}
            y={10}
            fill="#475569"
            fontSize={9}
            fontFamily="JetBrains Mono, monospace"
          >
            {m.text}
          </text>
        ))}
        {/* Friday + Saturday row labels */}
        {[5, 6].map((dow, i) => (
          <text key={dow} x={0} y={16 + 14 + (4 + i) * (CELL + GAP)} fill="#475569" fontSize={9} fontFamily="JetBrains Mono, monospace">
            {i === 0 ? 'F' : 'S'}
          </text>
        ))}
        {cells.map((c, i) => (
          <motion.rect
            key={i}
            x={18 + c.col * (CELL + GAP)}
            y={16 + c.row * (CELL + GAP)}
            width={CELL}
            height={CELL}
            rx={3}
            fill={intensityColor(c.count)}
            style={{ filter: c.isWeekend ? 'brightness(1.25)' : undefined }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.004, duration: 0.3 }}
            onMouseEnter={() =>
              setTooltip({
                x: 18 + c.col * (CELL + GAP),
                y: 16 + c.row * (CELL + GAP),
                label: `${c.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${c.count} bar${c.count === 1 ? '' : 's'} · ${c.count} check-in${c.count === 1 ? '' : 's'}`,
              })
            }
            onMouseLeave={() => setTooltip(null)}
            onClick={() =>
              setTooltip({
                x: 18 + c.col * (CELL + GAP),
                y: 16 + c.row * (CELL + GAP),
                label: `${c.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${c.count} check-in${c.count === 1 ? '' : 's'}`,
              })
            }
          />
        ))}
      </svg>
      {tooltip && (
        <div
          className="glass pointer-events-none absolute z-10 whitespace-nowrap px-2.5 py-1.5 font-mono text-[10px] text-text-1"
          style={{ left: Math.min(tooltip.x, 180), top: tooltip.y - 36 }}
        >
          {tooltip.label}
        </div>
      )}
    </div>
  )
}
