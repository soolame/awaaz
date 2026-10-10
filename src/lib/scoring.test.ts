import { describe, expect, it } from 'vitest'
import type { Creator, Meta, Post } from '../types'
import { enrich } from './scoring'

const TIERS: Meta['tiers'] = [
  { id: 't1', label: 'Under 1M', league: 'Spark league', max: 1_000_000 },
  { id: 't2', label: '1M to 10M', league: 'Bronze league', max: 10_000_000 },
  { id: 't3', label: '10M and up', league: 'Silver league', max: Number.MAX_SAFE_INTEGER },
]

function makeMeta(windowTo: string, tiers: Meta['tiers'] = TIERS): Meta {
  return {
    issue: 'test issue',
    issueSlug: 'test-issue',
    window: { from: '2026-01-01', to: windowTo },
    updatedAt: `${windowTo}T00:00:00Z`,
    platformFocus: 'instagram',
    sample: false,
    notice: '',
    tiers,
  }
}

function makePost(overrides: Partial<Post>): Post {
  return {
    date: '2026-01-01',
    platform: 'instagram',
    depth: 1,
    url: 'https://example.com/post',
    summary: 'a post',
    ...overrides,
  }
}

function makeCreator(overrides: Partial<Creator>): Creator {
  return {
    id: 'creator',
    name: 'Creator',
    category: 'Film',
    followers: 500_000,
    followersApprox: false,
    handles: { instagram: 'creator' },
    status: 'unchecked',
    checkedAt: null,
    posts: [],
    ...overrides,
  }
}

function scoreFromRawFormula(raw: number): number {
  return Math.round(100 * (1 - Math.exp(-raw / 22)))
}

describe('recency decay', () => {
  it('halves a post worth every 30 days of age', () => {
    const windowTo = '2026-10-05'
    const meta = makeMeta(windowTo)
    const creator = makeCreator({
      posts: [makePost({ date: '2026-09-05', depth: 1 })], // 30 days old
    })
    const result = enrich(creator, meta)

    // base points 1 * 0.5^(30/30) = 0.5, plus +2 for the one distinct week touched
    const expectedRaw = 1 * Math.pow(0.5, 30 / 30) + 2
    expect(result.score).toBe(scoreFromRawFormula(expectedRaw))
  })

  it('applies no decay to a post made on the window end date', () => {
    const windowTo = '2026-10-05'
    const meta = makeMeta(windowTo)
    const creator = makeCreator({
      posts: [makePost({ date: windowTo, depth: 2 })],
    })
    const result = enrich(creator, meta)

    const expectedRaw = 3 * Math.pow(0.5, 0 / 30) + 2
    expect(result.score).toBe(scoreFromRawFormula(expectedRaw))
  })

  it('gives no score at all when there are no counted posts', () => {
    const meta = makeMeta('2026-10-05')
    const creator = makeCreator({ posts: [] })
    expect(enrich(creator, meta).score).toBe(0)
  })

  it('ignores X posts entirely', () => {
    const meta = makeMeta('2026-10-05')
    const creator = makeCreator({
      posts: [makePost({ date: '2026-10-05', platform: 'x', depth: 3 })],
    })
    const result = enrich(creator, meta)
    expect(result.countedPosts).toHaveLength(0)
    expect(result.score).toBe(0)
  })
})

describe('consistency (week) bonus', () => {
  it('only awards the +2 bonus once for two posts in the same ISO week', () => {
    const windowTo = '2026-10-08' // Thursday, ISO week Mon 10-05 .. Sun 10-11
    const meta = makeMeta(windowTo)
    const creator = makeCreator({
      posts: [
        makePost({ date: '2026-10-05', depth: 1 }),
        makePost({ date: '2026-10-07', depth: 1 }),
      ],
    })
    const result = enrich(creator, meta)

    const expectedRaw =
      1 * Math.pow(0.5, 3 / 30) + // age of 10-05 from 10-08
      1 * Math.pow(0.5, 1 / 30) + // age of 10-07 from 10-08
      2 * 1 // one distinct week
    expect(result.score).toBe(scoreFromRawFormula(expectedRaw))
  })

  it('awards the +2 bonus twice for posts split across two ISO weeks', () => {
    const windowTo = '2026-10-08'
    const meta = makeMeta(windowTo)
    const creator = makeCreator({
      posts: [
        makePost({ date: '2026-10-07', depth: 1 }), // same week as window end
        makePost({ date: '2026-09-28', depth: 1 }), // prior week
      ],
    })
    const result = enrich(creator, meta)

    const expectedRaw =
      1 * Math.pow(0.5, 1 / 30) +
      1 * Math.pow(0.5, 10 / 30) +
      2 * 2 // two distinct weeks
    expect(result.score).toBe(scoreFromRawFormula(expectedRaw))
  })
})

describe('streak', () => {
  it('counts consecutive weeks with posts back from the window-end week', () => {
    const windowTo = '2026-10-05' // Monday
    const meta = makeMeta(windowTo)
    const creator = makeCreator({
      posts: [
        makePost({ date: '2026-10-05' }), // end week
        makePost({ date: '2026-09-28' }), // end week - 1
        makePost({ date: '2026-09-21' }), // end week - 2
        // end week - 3 (2026-09-14) deliberately has no post
      ],
    })
    expect(enrich(creator, meta).streak).toBe(3)
  })

  it('counts from the week before the end week when the end week itself is empty', () => {
    const windowTo = '2026-10-05' // Monday, no post this week
    const meta = makeMeta(windowTo)
    const creator = makeCreator({
      posts: [
        makePost({ date: '2026-09-28' }), // end week - 1
        makePost({ date: '2026-09-21' }), // end week - 2
      ],
    })
    expect(enrich(creator, meta).streak).toBe(2)
  })

  it('is zero when both the end week and the week before are empty', () => {
    const windowTo = '2026-10-05'
    const meta = makeMeta(windowTo)
    const creator = makeCreator({
      posts: [makePost({ date: '2026-09-07' })], // far older, breaks the streak
    })
    expect(enrich(creator, meta).streak).toBe(0)
  })
})

describe('levels', () => {
  it('starts everyone at First words', () => {
    const meta = makeMeta('2026-10-05')
    const creator = makeCreator({ posts: [] })
    expect(enrich(creator, meta).level).toBe('First words')
  })

  it('promotes to Steady voice, Amplifier and Torchbearer as score crosses thresholds', () => {
    const meta = makeMeta('2026-10-05')
    // Enough same-day depth-3 posts (6 pts each, no decay) to climb through every level.
    const postsFor = (count: number): Post[] =>
      Array.from({ length: count }, (_, i) => makePost({ date: '2026-10-05', depth: 3, url: `https://example.com/${i}` }))

    const low = enrich(makeCreator({ posts: postsFor(1) }), meta)
    const mid = enrich(makeCreator({ posts: postsFor(3) }), meta)
    const high = enrich(makeCreator({ posts: postsFor(6) }), meta)

    expect(low.level).toBe('Steady voice')
    expect(mid.level).toBe('Amplifier')
    expect(high.level).toBe('Torchbearer')
    expect(high.nextLevel).toBeNull()
  })
})

describe('tiers', () => {
  it('places a creator in the first tier where followers is under the max', () => {
    const meta = makeMeta('2026-10-05')
    expect(enrich(makeCreator({ followers: 500_000 }), meta).tier.id).toBe('t1')
    expect(enrich(makeCreator({ followers: 5_000_000 }), meta).tier.id).toBe('t2')
    expect(enrich(makeCreator({ followers: 50_000_000 }), meta).tier.id).toBe('t3')
  })
})

describe('status and the quiet rule', () => {
  it('is "unchecked" when no_post_found is set without a checkedAt date', () => {
    const meta = makeMeta('2026-10-05')
    const creator = makeCreator({ status: 'no_post_found', checkedAt: null, posts: [] })
    expect(enrich(creator, meta).status).toBe('unchecked')
  })

  it('is "no_post_found" (quiet) only once checkedAt is set', () => {
    const meta = makeMeta('2026-10-05')
    const creator = makeCreator({ status: 'no_post_found', checkedAt: '2026-10-05', posts: [] })
    expect(enrich(creator, meta).status).toBe('no_post_found')
  })

  it('a counted post overrides quiet status back to "spoke"', () => {
    const meta = makeMeta('2026-10-05')
    const creator = makeCreator({
      status: 'no_post_found',
      checkedAt: '2026-10-05',
      posts: [makePost({ date: '2026-10-05' })],
    })
    expect(enrich(creator, meta).status).toBe('spoke')
  })
})
