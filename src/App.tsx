import { useEffect, useMemo, useState } from 'react'
import Background from './components/Background'
import TopBar from './components/TopBar'
import Ticker from './components/Ticker'
import TierTabs from './components/TierTabs'
import Podium from './components/Podium'
import RankList from './components/RankList'
import WaitingList from './components/WaitingList'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import Confetti from './components/Confetti'
import { loadData } from './lib/data'
import { enrich, rank, type EnrichedCreator } from './lib/scoring'
import type { Meta } from './types'
import { relativeDay } from './format'

export default function App() {
  const [meta, setMeta] = useState<Meta | null>(null)
  const [creators, setCreators] = useState<EnrichedCreator[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedTier, setSelectedTier] = useState('all')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    loadData()
      .then((data) => {
        const enriched = rank(data.creators.map((c) => enrich(c, data.meta)))
        setMeta(data.meta)
        setCreators(enriched)
        const leader = enriched[0]
        if (leader && leader.score > 0) {
          setTimeout(() => setToastMessage(`${leader.name} leads with ${leader.score} points`), 1400)
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      })
  }, [])

  const tierLabel = useMemo(() => {
    if (!meta) return ''
    if (selectedTier === 'all') return 'All tiers'
    return meta.tiers.find((t) => t.id === selectedTier)?.label ?? 'All tiers'
  }, [meta, selectedTier])

  const tierFiltered = useMemo(
    () => (creators ?? []).filter((c) => selectedTier === 'all' || c.tier.id === selectedTier),
    [creators, selectedTier],
  )

  const spokeInTier = useMemo(() => tierFiltered.filter((c) => c.status === 'spoke'), [tierFiltered])
  const quietInTier = useMemo(() => tierFiltered.filter((c) => c.status === 'no_post_found'), [tierFiltered])
  const uncheckedInTier = useMemo(() => tierFiltered.filter((c) => c.status === 'unchecked'), [tierFiltered])

  const countsByTier = useMemo(() => {
    const counts: Record<string, { spoke: number; total: number }> = {}
    if (!creators || !meta) return counts
    counts.all = { spoke: creators.filter((c) => c.status === 'spoke').length, total: creators.length }
    for (const tier of meta.tiers) {
      const inTier = creators.filter((c) => c.tier.id === tier.id)
      counts[tier.id] = { spoke: inTier.filter((c) => c.status === 'spoke').length, total: inTier.length }
    }
    return counts
  }, [creators, meta])

  const tickerItems = useMemo(() => {
    if (!creators || !meta) return []
    const events = creators.flatMap((c) =>
      c.countedPosts.map((post) => ({
        date: post.date,
        text: `${c.name} spoke up on ${post.platform === 'instagram' ? 'Instagram' : 'the public record'}, ${relativeDay(post.date, meta.window.to)}`,
      })),
    )
    events.sort((a, b) => (a.date < b.date ? 1 : -1))
    return events.slice(0, 16).map((e) => e.text)
  }, [creators, meta])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <p className="text-white/70">Couldn't load the scoreboard: {error}</p>
      </div>
    )
  }

  if (!meta || !creators) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-white/60">Loading the scoreboard…</p>
      </div>
    )
  }

  return (
    <>
      <Background />
      <div id="top" className="relative mx-auto max-w-7xl px-2 pb-20 sm:px-4">
        <TopBar updatedAt={meta.updatedAt} />
        <div className="mt-3">
          <Ticker items={tickerItems} />
        </div>

        <div className="glass-panel mx-auto mt-3 max-w-7xl rounded-2xl px-4 py-3 text-sm text-white/70 sm:mx-3 lg:mx-auto">
          {meta.sample && <span className="mr-2 rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-semibold text-amber-300">Sample data</span>}
          {meta.notice}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="flex min-w-0 flex-col gap-6">
            <section id="leaderboard" className="scroll-mt-28">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h1 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">Leaderboard</h1>
              </div>

              <TierTabs
                tiers={meta.tiers}
                selected={selectedTier}
                onSelect={setSelectedTier}
                countsByTier={countsByTier}
              />

              <div className="relative mt-8">
                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
                  <Confetti active={toastMessage !== null} />
                </div>
                <Podium
                  topThree={[spokeInTier[0] ?? null, spokeInTier[1] ?? null, spokeInTier[2] ?? null]}
                  tierLabel={tierLabel}
                />
                <RankList creators={spokeInTier} />
              </div>
            </section>

            <WaitingList quiet={quietInTier} unchecked={uncheckedInTier} />

            <section id="how-it-works" className="glass-panel scroll-mt-28 rounded-[22px] p-5">
              <h2 className="font-heading text-lg font-bold text-white">How it works</h2>
              <div className="mt-3 grid grid-cols-1 gap-4 text-sm text-white/70 sm:grid-cols-3">
                <p>
                  Posts only count on Instagram or when reported publicly. Deeper engagement — standing on stage
                  beats a quick mention — earns more, and recent posts count more than old ones.
                </p>
                <p>
                  A single counted post always means <span className="font-semibold text-white">spoke</span>, no
                  matter the stored status. Nobody is shown as quiet until they've actually been checked, with the
                  date attached.
                </p>
                <p>
                  Nobody is scored by which side of the issue they're on — only by whether they used their reach at
                  all. Every point links to a public source.
                </p>
              </div>
            </section>
          </main>

          <Sidebar
            meta={meta}
            allCreators={creators}
            tierSpoke={spokeInTier.length}
            tierTracked={tierFiltered.length}
            tierLabel={tierLabel}
            selectedTierId={selectedTier}
          />
        </div>
      </div>
      <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
    </>
  )
}
