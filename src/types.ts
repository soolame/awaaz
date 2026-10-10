export type Platform = 'instagram' | 'x' | 'public'

export type Depth = 1 | 2 | 3

export type Status = 'spoke' | 'no_post_found' | 'unchecked'

export interface Tier {
  id: string
  label: string
  league: string
  max: number
}

export interface Meta {
  issue: string
  issueSlug: string
  window: {
    from: string
    to: string
  }
  updatedAt: string
  platformFocus: string
  sample: boolean
  notice: string
  tiers: Tier[]
}

export interface Post {
  date: string
  platform: Platform
  depth: Depth
  url: string
  summary: string
  source?: string
}

export interface Handles {
  instagram?: string
  x?: string
}

export interface Creator {
  id: string
  name: string
  category: string
  followers: number
  followersApprox: boolean
  needsVerify?: boolean
  handles: Handles
  status: Status
  checkedAt: string | null
  posts: Post[]
}

export interface Data {
  meta: Meta
  creators: Creator[]
}
