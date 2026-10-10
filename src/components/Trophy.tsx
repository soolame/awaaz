import { motion, useReducedMotion } from 'framer-motion'
import { avatarColor, initials } from '../format'

export type TrophyVariant = 'gold' | 'silver' | 'bronze'

const GRADIENTS: Record<TrophyVariant, [string, string, string]> = {
  gold: ['#fff6d8', '#ffd76a', '#c98a2d'],
  silver: ['#ffffff', '#d8dee8', '#8d97ad'],
  bronze: ['#f3c08a', '#cd7f32', '#8a5223'],
}

const PLATE_LABEL: Record<TrophyVariant, string> = {
  gold: 'No.1',
  silver: 'No.2',
  bronze: 'No.3',
}

interface TrophyProps {
  variant: TrophyVariant
  name: string
  className?: string
}

export default function Trophy({ variant, name, className = '' }: TrophyProps) {
  const reduceMotion = useReducedMotion()
  const gradientId = `trophy-grad-${variant}`
  const [c1, c2, c3] = GRADIENTS[variant]

  return (
    <motion.div
      className={className}
      whileHover={reduceMotion ? undefined : { rotate: [0, -4, 4, -2, 0] }}
      transition={{ duration: 0.5 }}
    >
      <svg
        viewBox="0 0 120 160"
        role="img"
        aria-label={`${PLATE_LABEL[variant]} trophy for ${name}`}
        className="h-full w-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="55%" stopColor={c2} />
            <stop offset="100%" stopColor={c3} />
          </linearGradient>
          <linearGradient id="trophy-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff6fb5" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        <path
          d="M28,30 C5,30 5,62 26,66 C27,69 28.5,71.5 30.5,73.5 L30,55 C30,45 28.5,37 28,30 Z"
          fill={`url(#${gradientId})`}
        />
        <path
          d="M92,30 C115,30 115,62 94,66 C93,69 91.5,71.5 89.5,73.5 L90,55 C90,45 91.5,37 92,30 Z"
          fill={`url(#${gradientId})`}
        />

        <path
          d="M30,20 C30,10 90,10 90,20 L90,55 C90,85 75,97 60,97 C45,97 30,85 30,55 Z"
          fill={`url(#${gradientId})`}
        />
        <path d="M30,20 C30,14 90,14 90,20 C90,26 30,26 30,20 Z" fill="white" opacity="0.35" />

        <circle cx="60" cy="50" r="20" fill="url(#trophy-ring)" />
        <circle cx="60" cy="50" r="17" fill={avatarColor(name)} />
        <text
          x="60"
          y="56"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fontFamily="var(--font-heading)"
          fill="white"
        >
          {initials(name)}
        </text>

        <rect x="55" y="97" width="10" height="20" fill={`url(#${gradientId})`} />
        <rect x="32" y="117" width="56" height="13" rx="4" fill={`url(#${gradientId})`} />
        <rect x="26" y="130" width="68" height="9" rx="3" fill={`url(#${gradientId})`} opacity="0.85" />

        <text
          x="60"
          y="127"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          fontFamily="var(--font-heading)"
          fill="#2a1a08"
        >
          {PLATE_LABEL[variant]}
        </text>
      </svg>
    </motion.div>
  )
}
