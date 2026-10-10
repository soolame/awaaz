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

Every push to `main` runs `.github/workflows/deploy.yml`, which installs dependencies, runs
the test suite, builds the site, and publishes `dist/` to GitHub Pages via
`actions/upload-pages-artifact` and `actions/deploy-pages`.

For this to work, GitHub Pages must be configured to deploy from GitHub Actions (see
**Settings → Pages → Source → GitHub Actions** in the repository settings).

## Data

Creator data lives in `public/data/influencers.json` and is fetched at runtime by the app.
See `CLAUDE.md` for the full data contract and scoring rules.

## License

MIT, see [LICENSE](LICENSE).
