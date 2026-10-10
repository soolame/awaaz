import { AnimatePresence, motion } from 'framer-motion'
import type { EnrichedCreator } from '../lib/scoring'
import RankRow from './RankRow'

interface RankListProps {
  creators: EnrichedCreator[]
}

export default function RankList({ creators }: RankListProps) {
  return (
    <div className="glass-panel relative z-10 -mt-6 rounded-[22px] p-3 sm:p-4">
      <div className="flex items-center justify-between px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
        <span>Rank &amp; User</span>
        <span>Point</span>
      </div>

      {creators.length === 0 ? (
        <p className="px-2 py-6 text-center text-sm text-white/60">
          No one in this tier has spoken up yet — check back soon.
        </p>
      ) : (
        <motion.ul layout className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {creators.map((creator, i) => (
              <RankRow key={creator.id} creator={creator} rank={i + 1} />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  )
}
