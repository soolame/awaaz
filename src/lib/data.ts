import type { Data } from '../types'

export async function loadData(): Promise<Data> {
  const url = import.meta.env.VITE_DATA_URL || `${import.meta.env.BASE_URL}data/influencers.json`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load data from ${url}: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<Data>
}
