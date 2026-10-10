import { useState } from 'react'
import { motion } from 'framer-motion'
import type { EnrichedCreator } from '../lib/scoring'
import { addPostUrlFor } from '../config'
import { avatarColor, formatFollowers, initials, instagramUrl } from '../format'

interface WaitingListProps {
  quiet: EnrichedCreator[]
  unchecked: EnrichedCreator[]
}

export default function WaitingList({ quiet, unchecked }: WaitingListProps) {
  const [showWatchlist, setShowWatchlist] = useState(false)
  const combinedFollowers = quiet.reduce((sum, c) => sum + c.followers, 0)

  return (
    <section id="waiting" className="glass-panel scroll-mt-28 rounded-[22px] p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-white">Waiting to hear from</h2>
          <p className="text-sm text-white/60">Checked and no post found yet — this can change any day.</p>
        </div>
        {quiet.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-right">
            <p className="font-heading text-lg font-bold text-white">{formatFollowers(combinedFollowers)}</p>
            <p className="text-[11px] text-white/55">combined followers waiting</p>
          </div>
        )}
      </div>

      {quiet.length === 0 ? (
        <p className="mt-4 text-sm text-white/55">
          Nobody in this tier has been marked quiet yet — checks are still in progress.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quiet.map((creator) => (
            <motion.div
              key={creator.id}
              id={`creator-${creator.id}`}
              layout
              className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/[0.03] p-3 opacity-80 grayscale-[35%] transition hover:opacity-100 hover:grayscale-0"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: avatarColor(creator.name) }}
                >
                  {initials(creator.name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{creator.name}</p>
                  <span
                    role="img"
                    aria-label="Muted microphone"
                    className="inline-flex items-center gap-1 text-[11px] text-white/55"
                  >
                    🔇 Quiet
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-white/65">
                No Instagram post found on this issue as of {creator.checkedAt}
              </p>
              <a
                href={addPostUrlFor(creator.name)}
                target="_blank"
                rel="noreferrer"
                className="accent-gradient mt-3 inline-block w-full rounded-lg px-3 py-1.5 text-center text-xs font-semibold text-black/90"
              >
                They spoke? Send the link
              </a>
            </motion.div>
          ))}
        </div>
      )}

      {unchecked.length > 0 && (
        <div className="mt-5 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => setShowWatchlist((v) => !v)}
            aria-expanded={showWatchlist}
            className="flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white"
          >
            <span className={`transition-transform ${showWatchlist ? 'rotate-90' : ''}`}>›</span>
            Not checked yet ({unchecked.length})
          </button>

          {showWatchlist && (
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {unchecked.map((creator) => (
                <div
                  key={creator.id}
                  id={`creator-${creator.id}`}
                  className="scroll-mt-28 rounded-xl border border-dashed border-white/15 px-3 py-2.5"
                >
                  <p className="truncate text-sm font-medium text-white/85">{creator.name}</p>
                  {creator.handles.instagram ? (
                    <a
                      href={instagramUrl(creator.handles.instagram)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-accent-from underline-offset-2 hover:underline"
                    >
                      Open profile to check →
                    </a>
                  ) : (
                    <span className="text-[11px] text-white/45">No handle on file</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
