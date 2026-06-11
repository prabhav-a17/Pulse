import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#07070F',
        surface: '#0D0D1A',
        raised: '#12122A',
        blue: '#0066FF',
        'blue-mid': '#3B82F6',
        cyan: '#00D4FF',
        'cyan-dim': '#0EA5E9',
        indigo: '#4F46E5',
        green: '#10B981',
        amber: '#F59E0B',
        red: '#EF4444',
        'text-1': '#EEF2FF',
        'text-2': '#94A3B8',
        'text-3': '#475569',
      },
      fontFamily: {
        display: ['Clash Display', 'Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
