import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ProfileStats } from '@/types'

const VIBE_COLORS: Record<string, string> = {
  house: '#0066FF',
  techno: '#00D4FF',
  'hip-hop': '#4F46E5',
  'R&B': '#7C3AED',
  indie: '#0EA5E9',
  other: '#475569',
}

interface RoundedBarProps {
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
}

function RoundedBar({ x = 0, y = 0, width = 0, height = 0, fill }: RoundedBarProps) {
  const r = Math.min(height / 2, 6)
  return (
    <path
      d={`M${x},${y} h${Math.max(width - r, 0)} a${r},${r} 0 0 1 ${r},${r} v${height - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${Math.max(width - r, 0)} z`}
      fill={fill}
    />
  )
}

export function VibeChart({ data }: { data: ProfileStats['vibeBreakdown'] }) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
          <XAxis
            type="number"
            stroke="#475569"
            fontSize={10}
            fontFamily="JetBrains Mono, monospace"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="vibe"
            stroke="#94A3B8"
            fontSize={11}
            width={64}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,100,255,0.06)' }}
            contentStyle={{
              background: 'rgba(18,18,42,0.95)',
              border: '1px solid rgba(0,150,255,0.2)',
              borderRadius: 14,
              fontSize: 12,
              color: '#EEF2FF',
            }}
          />
          <Bar dataKey="count" shape={<RoundedBar />} barSize={16}>
            {data.map((d) => (
              <Cell key={d.vibe} fill={VIBE_COLORS[d.vibe] ?? '#475569'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
