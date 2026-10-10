import { motion, useReducedMotion } from 'framer-motion'
import type { EnrichedCreator } from '../lib/scoring'

interface LightWallProps {
  creators: EnrichedCreator[]
  selectedTierId: string
}

function statusLabel(status: EnrichedCreator['status']): string {
  if (status === 'spoke') return 'Spoke up'
  if (status === 'no_post_found') return 'No post found'
  return 'Not checked yet'
}

function lampStyle(status: EnrichedCreator['status']): React.CSSProperties {
  if (status === 'spoke') {
    return {
      border: '2px solid #f2b65c',
      background: '#f2b65c',
      boxShadow: '0 0 10px #f2b65c',
    }
  }
  if (status === 'no_post_found') {
    return { border: '2px solid rgba(255,255,255,0.35)', background: 'transparent' }
  }
  return { border: '1px solid rgba(255,255,255,0.12)', background: 'transparent' }
}

export default function LightWall({ creators, selectedTierId }: LightWallProps) {
  const reduceMotion = useReducedMotion()
  const sorted = [...creators].sort((a, b) => b.followers - a.followers)

  function scrollToCreator(id: string) {
    document.getElementById(`creator-${id}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
  }

  return (
    <div>
      <p className="mb-2 font-heading text-sm font-semibold text-white">Light wall</p>
      <div className="flex flex-wrap gap-1.5" role="list">
        {sorted.map((creator, i) => {
          const dimmed = selectedTierId !== 'all' && creator.tier.id !== selectedTierId
          return (
            <motion.button
              key={creator.id}
              type="button"
              role="listitem"
              title={`${creator.name} — ${statusLabel(creator.status)}`}
              aria-label={`${creator.name}: ${statusLabel(creator.status)}`}
              onClick={() => scrollToCreator(creator.id)}
              className={`h-3 w-3 shrink-0 rounded-full transition-opacity ${
                !reduceMotion && creator.status === 'spoke' ? 'animate-lamp-ripple' : ''
              }`}
              style={{ ...lampStyle(creator.status), '--lamp-color': '#f2b65c' } as React.CSSProperties}
              initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: dimmed ? 0.2 : 1 }}
              transition={{ delay: Math.min(i, 24) * 0.02, type: 'spring', stiffness: 300, damping: 18 }}
            />
          )
        })}
      </div>
    </div>
  )
}
