Read CLAUDE.md first; it is the source of truth for data, scoring and fairness rules.

Set up this empty repo as the Awaaz app:

1. Scaffold Vite + React + TypeScript in the repo root (not a subfolder). Add Tailwind CSS,
   Framer Motion, Vitest and ESLint. Use npm. Set Vite `base` to "/<repo-name>/" using the
   actual repo name from `git remote get-url origin`.

2. Create:
   - src/types.ts: types matching the data contract in CLAUDE.md.
   - src/lib/scoring.ts: pure functions implementing every scoring, status, level, tier,
     streak and achievement rule in CLAUDE.md. Export one `enrich(creator, meta)` that
     returns the creator plus { countedPosts, score, streak, status, level, nextLevel,
     tier, badges }, and a `rank(creators)` helper.
   - src/lib/data.ts: `loadData()` that fetches `${import.meta.env.BASE_URL}data/influencers.json`
     (later we will point it at an API via VITE_DATA_URL; support that env var now,
     falling back to the local file).
   - src/lib/scoring.test.ts: Vitest tests covering decay, week bonus, streaks, levels,
     tiers, the "quiet needs checkedAt" rule, and "a post overrides quiet".

3. Replace the default App with a plain placeholder page (no styling effort) that loads
   the data and shows a table: rank, name, tier, status, score, level, badges. This is only
   to verify the logic.

4. Add .github/workflows/deploy.yml: on push to main, npm ci, npm test, npm run build,
   then deploy dist/ with actions/upload-pages-artifact and actions/deploy-pages.

5. Add a README.md explaining the project, how to run locally (npm install, npm run dev),
   how to test, and how deployment works. Add an MIT LICENSE and a sensible .gitignore.

6. Run npm install, npm test and npm run build. Fix anything failing. Then commit in small,
   clearly named commits and push. Tell me exactly what to click in GitHub Settings > Pages.
