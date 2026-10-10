import { motion, useReducedMotion } from 'framer-motion'

interface VoiceMeterProps {
  spoke: number
  tracked: number
  tierLabel: string
}

export default function VoiceMeter({ spoke, tracked, tierLabel }: VoiceMeterProps) {
  const reduceMotion = useReducedMotion()
  const pct = tracked === 0 ? 0 : spoke / tracked
  const radius = 42
  const circumference = 2 * Math.PI * radius

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-28 w-28 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="9" />
          <defs>
            <linearGradient id="voice-meter-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff6fb5" />
              <stop offset="100%" stopColor="#ff8a4c" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#voice-meter-grad)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={reduceMotion ? false : { strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - pct) }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-xl font-bold text-white">{spoke}</span>
          <span className="text-[11px] text-white/55">of {tracked}</span>
        </div>
      </div>
      <div>
        <p className="font-heading text-sm font-semibold text-white">Voices heard</p>
        <p className="text-xs text-white/55">in {tierLabel}</p>
      </div>
    </div>
  )
}
