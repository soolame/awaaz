import { useEffect, useState } from 'react'
import { loadData } from './lib/data'
import { enrich, rank, type EnrichedCreator } from './lib/scoring'
import type { Meta } from './types'

function statusLabel(creator: EnrichedCreator): string {
  if (creator.status === 'spoke') return 'Spoke'
  if (creator.status === 'no_post_found' && creator.checkedAt) {
    return `No Instagram post found on this issue as of ${creator.checkedAt}`
  }
  return 'Not checked yet'
}

export default function App() {
  const [meta, setMeta] = useState<Meta | null>(null)
  const [creators, setCreators] = useState<EnrichedCreator[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
      .then((data) => {
        setMeta(data.meta)
        setCreators(rank(data.creators.map((c) => enrich(c, data.meta))))
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      })
  }, [])

  if (error) return <p>Error: {error}</p>
  if (!meta || !creators) return <p>Loading…</p>

  return (
    <div>
      <h1>Awaaz — {meta.issue}</h1>
      <table border={1} cellPadding={6}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Tier</th>
            <th>Status</th>
            <th>Score</th>
            <th>Level</th>
            <th>Badges</th>
          </tr>
        </thead>
        <tbody>
          {creators.map((creator, index) => (
            <tr key={creator.id}>
              <td>{index + 1}</td>
              <td>{creator.name}</td>
              <td>{creator.tier.label}</td>
              <td>{statusLabel(creator)}</td>
              <td>{creator.score}</td>
              <td>{creator.level}</td>
              <td>{creator.badges.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
