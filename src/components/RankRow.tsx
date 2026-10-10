import { useState, type ComponentType } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { EnrichedCreator } from '../lib/scoring'
import { avatarColor, formatDateShort, initials, instagramUrl } from '../format'
import { useCountUp } from '../useCountUp'
import {
  SproutIcon,
  SpeechIcon,
  MegaphoneIcon,
  FlameIcon,
  BookIcon,
  PlacardIcon,
  SignalIcon,
  CalendarIcon,
  SparkleIcon,
  MedalIcon,
  type IconProps,
} from './icons'

const LEVEL_INDEX: Record<string, number> = {
  'First words': 1,
  'Steady voice': 2,
  Amplifier: 3,
  Torchbearer: 4,
}

const LEVEL_ICON: Record<string, ComponentType<IconProps>> = {
  'First words': SproutIcon,
  'Steady voice': SpeechIcon,
  Amplifier: MegaphoneIcon,
  Torchbearer: FlameIcon,
}

const LEVEL_THRESHOLDS = [0, 25, 50, 75]

const ACHIEVEMENT_ICON: Record<string, ComponentType<IconProps>> = {
  Explainer: BookIcon,
  'Showed up': PlacardIcon,
  'On a streak': FlameIcon,
  'Big reach': SignalIcon,
  Consistent: CalendarIcon,
  'Broke format': SparkleIcon,
}

const RANK_TINT: Record<number, { bg: string; ring: string }> = {
  1: { bg: 'linear-gradient(90deg, rgba(180,120,40,0.35), rgba(180,120,40,0.08))', ring: '#d4a24c' },
  2: { bg: 'linear-gradient(90deg, rgba(45,217,194,0.3), rgba(45,217,194,0.06))', ring: '#2dd9c2' },
  3: { bg: 'linear-gradient(90deg, rgba(90,169,255,0.3), rgba(90,169,255,0.06))', ring: '#5aa9ff' },
}

function muted() {
  return { bg: 'linear-gradient(90deg, rgba(167,139,250,0.2), rgba(167,139,250,0.05))', ring: '#a78bfa' }
}

function xpProgress(score: number): { pct: number; label: string } {
  const idx = LEVEL_THRESHOLDS.findLastIndex((t) => score >= t)
  const min = LEVEL_THRESHOLDS[idx]
  const max = LEVEL_THRESHOLDS[idx + 1]
  if (max === undefined) return { pct: 100, label: 'Top level reached' }
  const pct = Math.round(((score - min) / (max - min)) * 100)
  return { pct, label: `${max - score} pts to ${idx === 0 ? 'Steady voice' : idx === 1 ? 'Amplifier' : 'Torchbearer'}` }
}

interface RankRowProps {
  creator: EnrichedCreator
  rank: number
}

export default function RankRow({ creator, rank }: RankRowProps) {
  const [expanded, setExpanded] = useState(false)
  const reduceMotion = useReducedMotion()
  const tint = RANK_TINT[rank] ?? muted()
  const xp = xpProgress(creator.score)
  const animatedScore = useCountUp(creator.score)
  const sortedPosts = [...creator.posts].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <motion.li
      id={`creator-${creator.id}`}
      layout
      initial={reduceMotion ? false : { opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(rank, 10) * 0.04 }}
      className="list-none"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 transition-transform hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
        style={{ background: tint.bg }}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-left sm:gap-4 sm:px-4"
        >
          <span className="relative shrink-0">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full font-heading text-sm font-bold text-white"
              style={{ background: avatarColor(creator.name), boxShadow: `0 0 0 2px ${tint.ring}` }}
            >
              {initials(creator.name)}
            </span>
            <span
              className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-black"
              style={{ background: tint.ring }}
            >
              {rank}
            </span>
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-1.5">
              <span className="truncate font-heading text-sm font-semibold text-white sm:text-base">
                {creator.name}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                Lev-{LEVEL_INDEX[creator.level]}
              </span>
            </span>
            <span className="mt-0.5 hidden items-center gap-1.5 text-xs text-white/65 sm:flex">
              {(() => {
                const LevelIcon = LEVEL_ICON[creator.level]
                return <LevelIcon className="h-3.5 w-3.5" />
              })()}
              <span>{creator.level}</span>
              {creator.badges.map((badge) => {
                const BadgeIcon = ACHIEVEMENT_ICON[badge] ?? MedalIcon
                return (
                  <span key={badge} title={badge} aria-label={badge} className="rounded-md bg-white/5 px-1 py-0.5">
                    <BadgeIcon className="h-3 w-3" />
                  </span>
                )
              })}
            </span>
          </span>

          <span className="accent-gradient flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white sm:h-6 sm:w-6"
              style={{ background: avatarColor(creator.name) }}
            >
              {initials(creator.name)}
            </span>
            <span className="font-heading text-sm font-bold text-black/90">{animatedScore}</span>
          </span>
        </button>

        <div className="px-3 pb-2.5 sm:px-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="accent-gradient h-full rounded-full"
              initial={reduceMotion ? false : { width: 0 }}
              animate={{ width: `${xp.pct}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-white/55">
            <span>{xp.label}</span>
            {creator.streak > 0 && (
              <span className="inline-flex items-center gap-1">
                <FlameIcon className="h-3 w-3" />
                {creator.streak}-week streak
              </span>
            )}
          </div>
        </div>

        {expanded && (
          <div className="border-t border-white/10 bg-black/20 px-3 py-3 sm:px-4">
            {sortedPosts.length === 0 ? (
              <p className="text-xs text-white/60">No posts logged yet.</p>
            ) : (
              <ul className="space-y-2">
                {sortedPosts.map((post, i) => (
                  <li key={i} className="rounded-xl bg-white/5 px-3 py-2 text-xs text-white/80">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-white/90">{formatDateShort(post.date)}</span>
                      <span className="flex gap-0.5" aria-label={`Depth ${post.depth} of 3`}>
                        {[1, 2, 3].map((d) => (
                          <span
                            key={d}
                            className={`h-1.5 w-1.5 rounded-full ${d <= post.depth ? 'bg-accent-from' : 'bg-white/15'}`}
                          />
                        ))}
                      </span>
                      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/60">
                        {post.platform}
                      </span>
                    </div>
                    <p className="mt-1">{post.summary}</p>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-[11px] font-semibold text-accent-from underline-offset-2 hover:underline"
                    >
                      {post.source ? `Source: ${post.source}` : 'View source'}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {creator.handles.instagram && (
              <a
                href={instagramUrl(creator.handles.instagram)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs font-semibold text-white/80 underline-offset-2 hover:underline"
              >
                Open Instagram profile →
              </a>
            )}
          </div>
        )}
      </div>
    </motion.li>
  )
}
