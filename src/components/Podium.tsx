import { motion, useReducedMotion } from 'framer-motion'
import type { EnrichedCreator } from '../lib/scoring'
import Trophy, { type TrophyVariant } from './Trophy'
import { SparkleIcon } from './icons'

interface Slot {
  rank: 1 | 2 | 3
  variant: TrophyVariant
  creator: EnrichedCreator | null
  height: string
  width: string
  from: string
  to: string
  topFace: string
  numberColor: string
  shadowColor: string
  order: number
  delay: number
}

function buildExtrudedShadow(color: string, depth = 7): string {
  const layers: string[] = []
  for (let i = 1; i <= depth; i++) {
    layers.push(`${i}px ${i}px 0 ${color}`)
  }
  layers.push(`${depth + 4}px ${depth + 4}px 14px rgba(0,0,0,0.45)`)
  return layers.join(', ')
}

interface PodiumProps {
  topThree: [EnrichedCreator | null, EnrichedCreator | null, EnrichedCreator | null]
  tierLabel: string
}

export default function Podium({ topThree, tierLabel }: PodiumProps) {
  const reduceMotion = useReducedMotion()
  const [first, second, third] = topThree
  const allEmpty = !first && !second && !third

  const slots: Slot[] = [
    {
      rank: 2,
      variant: 'silver',
      creator: second,
      height: '13rem',
      width: 'clamp(4.6rem, 20vw, 7.5rem)',
      from: '#8b5cf6',
      to: '#3f1f82',
      topFace: '#c4b5fd',
      numberColor: '#ece7ff',
      shadowColor: '#5b2fae',
      order: 1,
      delay: 0.5,
    },
    {
      rank: 1,
      variant: 'gold',
      creator: first,
      height: '17rem',
      width: 'clamp(5.2rem, 23vw, 8.5rem)',
      from: '#ffb648',
      to: '#e4571f',
      topFace: '#ffd9a0',
      numberColor: '#fff176',
      shadowColor: '#b23f12',
      order: 2,
      delay: 0.8,
    },
    {
      rank: 3,
      variant: 'bronze',
      creator: third,
      height: '10.5rem',
      width: 'clamp(4.2rem, 18vw, 7rem)',
      from: '#d9c9ff',
      to: '#8f78d6',
      topFace: '#ece3ff',
      numberColor: '#fdf9ff',
      shadowColor: '#6b53ad',
      order: 3,
      delay: 0.2,
    },
  ]

  if (allEmpty) {
    return (
      <div className="glass-panel flex min-h-[220px] items-center justify-center rounded-[22px] px-6 text-center">
        <p className="max-w-sm text-balance text-white/70">
          Nobody in <span className="font-semibold text-white">{tierLabel}</span> has spoken up yet. The first one
          gets the gold.
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex items-end justify-center gap-3 pt-16 sm:gap-5">
      {slots
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((slot) => (
          <div key={slot.rank} className="relative flex flex-col items-center" style={{ width: slot.width }}>
            <motion.div
              className="relative z-20 mb-[-1.75rem] h-16 w-16 sm:h-20 sm:w-20"
              initial={reduceMotion ? false : { y: -36, opacity: 0, rotate: -8 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: slot.delay + 0.45 }}
            >
              {slot.creator && <Trophy variant={slot.variant} name={slot.creator.name} />}
              {slot.rank === 1 && slot.creator && !reduceMotion && (
                <>
                  <motion.span
                    className="absolute -left-3 -top-2 text-rank-gold"
                    animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: 1.4 }}
                  >
                    <SparkleIcon className="h-4 w-4" />
                  </motion.span>
                  <motion.span
                    className="absolute -right-3 top-4 text-rank-gold"
                    animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: 2.1 }}
                  >
                    <SparkleIcon className="h-4 w-4" />
                  </motion.span>
                </>
              )}
            </motion.div>

            <motion.div
              className="relative w-full origin-bottom overflow-hidden rounded-t-2xl shadow-[0_18px_30px_rgba(0,0,0,0.5)]"
              style={{ height: slot.height, background: `linear-gradient(180deg, ${slot.from}, ${slot.to})` }}
              initial={reduceMotion ? false : { scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 90, damping: 9, delay: slot.delay }}
              whileHover={{ y: -4 }}
            >
              <div
                className="absolute inset-x-0 top-0 h-5"
                style={{ background: slot.topFace, clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}
              />
              <div className="absolute inset-0 flex items-end justify-center pb-10">
                <span
                  className="font-heading select-none text-6xl font-extrabold leading-none sm:text-7xl"
                  style={{ color: slot.numberColor, textShadow: buildExtrudedShadow(slot.shadowColor) }}
                >
                  {slot.rank}
                </span>
              </div>
              <div className="glass-panel absolute inset-x-1.5 bottom-1.5 rounded-xl px-2 py-1.5 text-center">
                {slot.creator ? (
                  <>
                    <p className="truncate font-heading text-xs font-semibold text-white">{slot.creator.name}</p>
                    <p className="text-[11px] text-white/70">{slot.creator.score} pts</p>
                  </>
                ) : (
                  <p className="text-[10px] leading-tight text-white/60">Open spot, speak up to claim it</p>
                )}
              </div>
            </motion.div>
          </div>
        ))}
    </div>
  )
}
