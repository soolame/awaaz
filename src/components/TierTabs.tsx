import { motion } from 'framer-motion'
import type { Tier } from '../types'

export interface TierTabCounts {
  spoke: number
  total: number
}

interface TierTabsProps {
  tiers: Tier[]
  selected: string
  onSelect: (id: string) => void
  countsByTier: Record<string, TierTabCounts>
}

export default function TierTabs({ tiers, selected, onSelect, countsByTier }: TierTabsProps) {
  const tabs = [
    { id: 'all', label: 'All', league: 'All tiers' },
    ...tiers.map((t) => ({ id: t.id, label: t.label, league: t.league })),
  ]

  return (
    <div
      role="tablist"
      aria-label="Filter by follower tier"
      className="no-scrollbar flex gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-1.5"
    >
      {tabs.map((tab) => {
        const counts = countsByTier[tab.id] ?? { spoke: 0, total: 0 }
        const isActive = selected === tab.id
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(tab.id)}
            className="relative shrink-0 rounded-xl px-3.5 py-2 text-left transition-transform hover:-translate-y-0.5"
          >
            {isActive && (
              <motion.span
                layoutId="tier-active-pill"
                className="accent-gradient absolute inset-0 rounded-xl shadow-[0_6px_20px_rgba(255,111,181,0.3)]"
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              />
            )}
            <span className="relative z-10 block">
              <span
                className={`font-heading block text-sm font-semibold ${isActive ? 'text-black/90' : 'text-white'}`}
              >
                {tab.label}
              </span>
              <span className={`block text-[11px] ${isActive ? 'text-black/70' : 'text-white/55'}`}>
                {tab.league} · {counts.spoke}/{counts.total}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
