Read CLAUDE.md first. Now build the real UI. Look at docs/reference.webp and match its
mood, layout ideas and polish, using our own content and motifs. Use it for inspiration,
not as a copy. No Pokémon, Nintendo or branded imagery.

Keep all logic in src/lib untouched; the UI only consumes it.

## Components (src/components)
TopBar, Ticker, TierTabs, Podium, Trophy, RankRow, RankList, WaitingList, Sidebar,
IssueCard, VoiceMeter, LightWall, FeatureCard, Achievements, Toast, Confetti, Background.
Styled with Tailwind, animated with Framer Motion.

## Visual direction
- Dark theme only. Deep navy/indigo base with large soft blurred color blobs (purple,
  orange, pink, blue) drifting slowly behind everything.
- Glassmorphism: translucent dark panels, backdrop blur, 1px light borders, radius 20–24px
  for panels and 14–16px for rows.
- Accent gradient pink to orange (#ff6fb5 -> #ff8a4c) for the active nav pill, active tab,
  primary buttons. Inactive pills: dark with a thin pink outline.
- Fonts from Google Fonts: Bricolage Grotesque (headings, numbers), Mukta (body).

## Layout
1. TopBar: logo (glossy gradient tile with a megaphone + "Awaaz" wordmark), centered pill
   nav (Leaderboard, Waiting list, How it works, as anchor links), "Live, updated <date>"
   chip on the right.
2. Ticker: thin glass strip scrolling the latest posts ("X spoke up on Instagram, 2 days ago").
   Pauses on hover.
3. Notice banner from meta.notice (or a sample-data notice when meta.sample is true).
4. Two columns: main (~65%) and sidebar (~35%); stack on mobile.
5. Main column:
   - "Leaderboard" heading + TierTabs as a segmented control (All plus each tier from
     meta.tiers; each tab shows label, league name and "spoke/total"; sliding gradient
     indicator using Framer Motion layoutId). The selected tier filters podium, rows,
     waiting list and meter.
   - Podium hero: three CSS 3D blocks. Left No.2 purple gradient, center No.1 orange and
     tallest, right No.3 lavender. Each has a lighter trapezoid top face and a huge extruded
     number on the front (layered text-shadow; the "1" yellow). On top of each block an SVG
     Trophy (gold/silver/bronze metallic gradients, handles, stem, base plate "No.1") with
     the creator's initials avatar inside a pink-to-purple ring in the cup. Name and points
     on a glass tag on the block front. Empty spots say "Open spot, speak up to claim it".
     If nobody in the tier spoke: "Nobody in this tier has spoken up yet. The first one gets
     the gold."
   - RankList: "Rank & User" glass panel overlapping the bottom of the podium, "Point"
     column header. Each RankRow is a rounded bar tinted by rank: #1 warm brown/gold,
     #2 teal-green, #3 blue, rest muted purple. Contents: avatar with rank dot, name,
     "Lev-N" pill colored by level, middle column with level icon + level name + small
     achievement icons (tooltips), right side a gradient points chip with mini avatar and
     score. Thin XP bar along the bottom ("8 pts to Torchbearer", streak flame). Clicking
     expands the evidence list: date, depth dots, summary, platform, source link, and an
     "Open Instagram profile" link.
   - WaitingList ("Waiting to hear from"): only creators whose status is quiet per
     CLAUDE.md. Desaturated cards with a muted-mic badge, "No Instagram post found on this
     issue as of <date>", and a "They spoke? Send the link" button. Above them a big counter
     of combined followers. Below, a collapsible "Not checked yet (N)" watchlist with dashed
     cards and "Open profile to check" links.
6. Sidebar:
   - IssueCard: icon tile, issue name, last updated, top-right outlined chip "Voices 2/23".
   - VoiceMeter: circular gradient ring (spoke / tracked in current tier) + LightWall below:
     one lamp per creator, biggest first. Gold glowing lamp = spoke, hollow ring = no post
     found, faint ring = not checked. Tooltip with name and status; click scrolls to them.
     Lamps outside the selected tier dim.
   - FeatureCards with glossy icon tiles: Track public posts; Score by depth (show level
     chips); Keep a streak; Unlock achievements (compact badge grid with unlocked counts,
     locked ones greyed); Substance, not stance (fairness rules + "Request a correction"
     link); Submit a post (gradient button).
   - Links use REPO_URL from a config file: issues/new?template=add-post.yml and
     issues/new?template=correction.md.
7. Decorative floating objects around the edges (hide on small screens): a glossy
   megaphone, a microphone and a raised-fist tile, built with CSS/SVG or emoji in glossy
   tiles, soft shadows, slow bob/rotate.

## Animation
- Load sequence: blobs fade in, top bar slides down, podium blocks grow one by one
  (No.3, No.2, No.1) with springy overshoot, trophies drop on with a bounce, sparkles
  around No.1, confetti burst plus a toast "<name> leads with N points".
- Rows slide in staggered; scores count up; XP bars fill.
- Tier change: sliding tab indicator, podium regrows, rows reorder with layout animation.
- Hover: rows lift with slight 3D tilt and glow in their tint; trophies wobble; sidebar
  icon tiles tilt; nav pills glow.
- Lamps pop in, flicker, emit ripple rings.
- prefers-reduced-motion: render final states, no motion.

## Quality
- Responsive to 360px, no horizontal page scroll. Real buttons, visible focus rings, aria
  labels on trophies and lamps, good contrast on glass.
- Run npm run dev, check at 1280px and 390px (use Playwright screenshots if available),
  check the console for errors, run npm test and npm run build.
- Compare against docs/reference.webp and tell me what you matched and what you changed
  on purpose. Commit and push.
