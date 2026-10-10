Read CLAUDE.md first. Phase 2: add a backend in /server that returns the SAME JSON shape as
public/data/influencers.json, so the frontend only sets VITE_DATA_URL.

Stack: Python 3.12, FastAPI, SQLModel + SQLite (/data/awaaz.db), httpx, APScheduler,
Docker Compose, Caddy for HTTPS.

1. Tables: creators, posts (external_id unique, status pending|approved|rejected, depth,
   summary, classifier_reason), checks (creator_id, checked_at, result), runs.
   Seed from public/data/influencers.json.
2. API: GET /api/v1/influencers -> exact contract, approved posts only, status derived by
   the CLAUDE.md rules. GET /api/health. Admin endpoints behind a bearer ADMIN_TOKEN:
   queue, approve (with depth), reject, add creator, mark checked. CORS only for the
   GitHub Pages origin. Cache responses 5 minutes.
3. Collector: Instagram Graph API Business Discovery (requires our own Instagram Business
   account and a Meta app) to read recent public media of creator/business accounts.
   Keyword prefilter from server/keywords.yml (English, Hindi, Marathi, Tamil terms).
   No scraping.
4. Classifier: Anthropic API proposes on_topic, depth 1-3 and a one-line neutral summary
   using a stance-neutral rubric (informative, sourced, constructive; hate or unverified
   claims get no depth and are flagged). It only proposes: everything goes to pending
   and needs my approval in /admin before it affects scores.
5. Every 6 hours: collect -> classify -> log a run. Nightly: export approved data and open
   a PR updating public/data/influencers.json so the static site keeps working if the VM
   is down.
6. /admin: one page in the same visual style to approve/reject the queue.
7. Dockerfile, docker-compose.yml, .env.example (no secrets), server/README with VM setup
   (Ubuntu, Docker, ufw, Caddy, daily DB backup). Tests for the JSON contract and
   collector idempotency.
