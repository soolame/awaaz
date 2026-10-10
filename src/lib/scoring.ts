import type { Creator, Depth, Meta, Post, Status, Tier } from '../types'

const DEPTH_POINTS: Record<Depth, number> = { 1: 1, 2: 3, 3: 6 }

const LEVELS = [
  { name: 'First words', min: 0 },
  { name: 'Steady voice', min: 25 },
  { name: 'Amplifier', min: 50 },
  { name: 'Torchbearer', min: 75 },
] as const

const NON_FORMAL_CATEGORIES_EXCLUDED = ['Education', 'Law', 'News', 'Politics']

export interface NextLevel {
  name: string
  pointsNeeded: number
}

export interface EnrichedCreator extends Creator {
  countedPosts: Post[]
  score: number
  streak: number
  status: Status
  level: string
  nextLevel: NextLevel | null
  tier: Tier
  badges: string[]
}

function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

function shiftDays(dateStr: string, days: number): string {
  const date = parseISODate(dateStr)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

/** ISO 8601 week key (Monday-start), e.g. "2026-W41". */
export function isoWeek(dateStr: string): string {
  const date = parseISODate(dateStr)
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const weekNumber = Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`
}

/** Only "instagram" and "public" posts count; "x" is ignored. */
export function countedPostsOf(creator: Creator): Post[] {
  return creator.posts.filter((p) => p.platform === 'instagram' || p.platform === 'public')
}

export function decayedPoints(post: Post, windowTo: string): number {
  const ageDays = (parseISODate(windowTo).getTime() - parseISODate(post.date).getTime()) / 86_400_000
  return DEPTH_POINTS[post.depth] * Math.pow(0.5, ageDays / 30)
}

export function rawScore(counted: Post[], windowTo: string): number {
  const postPoints = counted.reduce((sum, p) => sum + decayedPoints(p, windowTo), 0)
  const distinctWeeks = new Set(counted.map((p) => isoWeek(p.date))).size
  return postPoints + distinctWeeks * 2
}

export function scoreFromRaw(raw: number, countedCount: number): number {
  if (countedCount === 0) return 0
  return Math.round(100 * (1 - Math.exp(-raw / 22)))
}

export function levelForScore(score: number): { level: string; nextLevel: NextLevel | null } {
  let current: (typeof LEVELS)[number] = LEVELS[0]
  for (const lvl of LEVELS) {
    if (score >= lvl.min) current = lvl
  }
  const next = LEVELS[LEVELS.indexOf(current) + 1]
  return {
    level: current.name,
    nextLevel: next ? { name: next.name, pointsNeeded: next.min - score } : null,
  }
}

export function tierForFollowers(followers: number, tiers: Tier[]): Tier {
  return tiers.find((t) => followers < t.max) ?? tiers[tiers.length - 1]
}

/**
 * Consecutive weeks with a counted post, counting back from the window-end
 * week, or the week before it if the end week itself has no post.
 */
export function streakFor(counted: Post[], windowTo: string): number {
  const weeksWithPosts = new Set(counted.map((p) => isoWeek(p.date)))

  let cursor = windowTo
  if (!weeksWithPosts.has(isoWeek(cursor))) {
    cursor = shiftDays(cursor, -7)
  }

  let streak = 0
  while (weeksWithPosts.has(isoWeek(cursor))) {
    streak++
    cursor = shiftDays(cursor, -7)
  }
  return streak
}

/** Any counted post flips status to "spoke", overriding the stored status. */
export function statusFor(creator: Creator, counted: Post[]): Status {
  if (counted.length > 0) return 'spoke'
  if (creator.status === 'no_post_found' && creator.checkedAt) return 'no_post_found'
  return 'unchecked'
}

export function badgesFor(creator: Creator, counted: Post[], streak: number): string[] {
  const badges: string[] = []
  if (counted.some((p) => p.depth === 3)) badges.push('Explainer')
  if (counted.some((p) => p.platform === 'public')) badges.push('Showed up')
  if (streak >= 3) badges.push('On a streak')
  if (creator.followers >= 5_000_000) badges.push('Big reach')
  if (counted.length >= 5) badges.push('Consistent')
  if (!NON_FORMAL_CATEGORIES_EXCLUDED.includes(creator.category)) badges.push('Broke format')
  return badges
}

export function enrich(creator: Creator, meta: Meta): EnrichedCreator {
  const counted = countedPostsOf(creator)
  const raw = rawScore(counted, meta.window.to)
  const score = scoreFromRaw(raw, counted.length)
  const streak = streakFor(counted, meta.window.to)
  const status = statusFor(creator, counted)
  const { level, nextLevel } = levelForScore(score)
  const tier = tierForFollowers(creator.followers, meta.tiers)
  const badges = badgesFor(creator, counted, streak)

  return {
    ...creator,
    countedPosts: counted,
    score,
    streak,
    status,
    level,
    nextLevel,
    tier,
    badges,
  }
}

/** Leaderboard order: score desc, then followers desc. */
export function rank(creators: EnrichedCreator[]): EnrichedCreator[] {
  return [...creators].sort((a, b) => b.score - a.score || b.followers - a.followers)
}
