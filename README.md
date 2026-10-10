# Awaaz

A public, non-partisan scoreboard of Indian Instagram creators and how they use their reach
on a public issue (currently: electoral integrity and the right to peaceful protest).

The goal is to encourage people to speak up by celebrating those who do — never to harass
or shame anyone. Creators are scored only on how much they've engaged with the issue, never
on which side of it they're on. Every point on the board links back to a public source.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- Framer Motion
- Vitest

The site is a static build, deployed to GitHub Pages. A future phase will add a FastAPI +
SQLite backend that serves the same JSON shape, at which point the frontend only needs to
point at a new data URL.

## Running locally

```bash
npm install
npm run dev
```

This starts a local dev server (see the URL it prints) that reads data from
`public/data/influencers.json`.

To point the app at a different data source (e.g. a future backend API), set `VITE_DATA_URL`:

```bash
VITE_DATA_URL=https://example.com/influencers.json npm run dev
```

## Testing

```bash
npm test
```

Runs the Vitest suite, which covers every scoring, status, level, tier, streak and
achievement rule described in `CLAUDE.md`.

## Building

```bash
npm run build
```

Type-checks the project and produces a static build in `dist/`.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which installs dependencies,
validates the data file, runs the test suite, builds the site, and publishes `dist/` to
GitHub Pages via `actions/upload-pages-artifact` and `actions/deploy-pages`.

For this to work, GitHub Pages must be configured to deploy from GitHub Actions (see
**Settings → Pages → Source → GitHub Actions** in the repository settings).

## Data

Creator data lives in `public/data/influencers.json` and is fetched at runtime by the app.
See `CLAUDE.md` for the full data contract and scoring rules, and `schema/influencers.schema.json`
for the machine-checkable version of that contract.

```bash
npm run validate
```

Checks the data file against the schema, and also fails on a few things the schema can't
express on its own: a post missing a `url`, duplicate creator ids, a post dated outside
`meta.window`, a `no_post_found` status with no `checkedAt`, a `no_post_found` status that
still has counted posts on file, or a `spoke` status with no posts at all. This runs in CI
on every push, and you should run it locally before committing any data change.

## Maintaining the data

The data is maintained by hand, on purpose — every status is a claim about what you
personally checked. Use the `mark` script instead of hand-editing the JSON so the file stays
well-formed and `checkedAt`/`updatedAt` stay accurate:

```bash
# Mark a creator as checked with nothing found (sets status + today's checkedAt)
npm run mark -- <id> quiet

# Record a post and mark the creator as having spoken
npm run mark -- <id> spoke <url> <depth 1-3> "<short neutral summary>"

# Add a new creator to track (status starts as unchecked)
npm run mark -- add "<name>" <instagram_handle> <followers> <category>
```

**Daily checking routine:**

1. Open each `unchecked` creator's Instagram profile (and Stories, which vanish after 24
   hours — check regularly, not just once).
2. Look for any post or Story about the issue since `meta.window.from`.
3. If you find one, run `npm run mark -- <id> spoke ...` with a direct link and a neutral
   one-line summary of what they did (not which side they took).
4. If you find nothing, run `npm run mark -- <id> quiet` so it's clear they were actually
   checked, not just not-yet-reviewed.
5. Run `npm run validate` to confirm the file is still well-formed.
6. Commit and push — `git add public/data/influencers.json && git commit -m "..." && git push`.

Incoming `add-post` and `correction` issues (see `.github/ISSUE_TEMPLATE/`) are community
submissions — verify each one yourself before marking a creator spoke on the strength of it.

## License

MIT, see [LICENSE](LICENSE).
