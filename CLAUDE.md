# Awaaz

A public, non-partisan scoreboard of Indian Instagram creators and how they use their reach
on a public issue (currently: electoral integrity and the right to peaceful protest).
Goal: encourage people to speak up by celebrating those who do. Never harass or shame.

## Stack
- Vite + React + TypeScript, Tailwind CSS, Framer Motion, Vitest.
- Static build deployed to GitHub Pages via GitHub Actions. Vite `base` = "/<repo-name>/".
- Data lives in `public/data/influencers.json` and is fetched at runtime.
- Phase 2 (later): FastAPI + SQLite backend in `/server`, hosted on a VM, returning the
  exact same JSON shape. The frontend only switches its data URL.

## Data contract (public/data/influencers.json)
meta: { issue, issueSlug, window{from,to}, updatedAt, platformFocus, sample, notice,
        tiers[] {id, label, league, max} }
creators[]: { id, name, category, followers, followersApprox, needsVerify?,
              handles{instagram?, x?}, status: "spoke"|"no_post_found"|"unchecked",
              checkedAt: "YYYY-MM-DD"|null,
              posts[] {date, platform: "instagram"|"x"|"public", depth: 1|2|3,
                       url, summary, source?} }

## Scoring rules (must stay identical everywhere)
- Only platforms "instagram" and "public" count for now (X ignored).
- Points per post by depth: 1 -> 1, 2 -> 3, 3 -> 6.
- Recency decay: points * 0.5^(ageDays / 30), age measured from meta.window.to.
- Consistency: +2 per distinct ISO week (Monday start) with at least one post.
- score = round(100 * (1 - e^(-raw / 22))), 0 if no counted posts.
- Streak: consecutive weeks with posts, counting back from the window end week
  (or the week before it if that week is empty).
- Levels: First words 0+, Steady voice 25+, Amplifier 50+, Torchbearer 75+.
- Tier = first tier where followers < tier.max.
- Achievements: Explainer (any depth 3), Showed up (any "public"), On a streak (streak>=3),
  Big reach (followers>=5M), Consistent (>=5 posts), Broke format (category not in
  Education/Law/News/Politics).
- Leaderboard order: score desc, then followers desc.

## Status rules (important for fairness)
- Any counted post => "spoke", whatever the status field says.
- "Quiet" (shown in "Waiting to hear from") ONLY when status is "no_post_found" AND
  checkedAt is set. Display it as "No Instagram post found on this issue as of <date>",
  never as "silent".
- Everything else is "unchecked" and must never be shown as quiet.

## Principles
- Substance, not stance: never score by which side a post takes.
- Every point links to a public source.
- No Pokémon, Nintendo or other branded/copyrighted imagery. No remote images.
  Avatars are colored initials circles.
- Respect prefers-reduced-motion. Keyboard accessible. Responsive down to 360px.
- Design reference: docs/reference.webp (inspiration, not a copy).
