# Start here

## 0. Install once
- Node.js 20 or newer: https://nodejs.org (check with `node -v`)
- Git (check with `git --version`)
- Claude Code (check with `claude --version`)

## 1. Get your repo on your computer
    git clone https://github.com/<your-user>/<your-repo>.git
    cd <your-repo>

## 2. Add the starter files
Copy everything from this kit into the repo root, so it looks like:

    <your-repo>/
      CLAUDE.md
      START_HERE.md
      docs/reference.webp        <- put your reference image here
      prompts/01-scaffold.md
      prompts/02-design.md
      prompts/03-contributions.md
      prompts/04-backend.md
      public/data/influencers.json

Then commit:

    git add .
    git commit -m "Add project brief, prompts and seed data"
    git push

## 3. Build with Claude Code, one prompt at a time
    claude

Paste the contents of each prompt file, in order. Finish and check each one before the next.

| Step | Prompt | Check before moving on |
|------|--------|------------------------|
| 1 | prompts/01-scaffold.md | `npm run dev` shows a table with Prakash Raj and Dhruv Rathee scored; `npm test` passes |
| 2 | GitHub: Settings > Pages > Source: **GitHub Actions** | The Actions tab shows a green deploy; the site opens at https://<your-user>.github.io/<your-repo>/ |
| 3 | prompts/02-design.md | The site looks like the reference mood; works on your phone |
| 4 | prompts/03-contributions.md | `npm run mark -- virat-kohli quiet` updates the JSON; `npm run validate` passes |
| 5 | prompts/04-backend.md | Only when you have a VM and a Meta developer app |

Tip: you can also tell Claude Code "Read prompts/01-scaffold.md and do it" instead of pasting.

## 4. Before going public
- Verify every follower count and the blank Instagram handle (Prakash Raj).
- Check profiles yourself before marking anyone "quiet". Stories vanish after 24 hours,
  so re-check regularly.
- Replace the placeholder repo links (REPO_URL) with your real repo.
