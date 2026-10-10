# How to fill this in

Open `template.csv` in Google Sheets, Excel, or Numbers. Delete the two `EXAMPLE` rows, then
add one row per creator you checked or want to add to the board. When you're done, save/export
it as CSV and send it back.

## Columns

- **name** — required. The creator's full name.
- **instagram_handle** — their Instagram handle, without the `@`. Leave blank if unknown.
- **category** — required only if the creator isn't already on the board (e.g. Film, Sports,
  News, Politics, Education, Music, Comedy). Leave blank if you're just updating someone who's
  already tracked.
- **followers** — their current follower count (approximate is fine). Required if you're adding
  a new creator; optional for an existing one (fill it in if you want to refresh an out-of-date
  count).
- **status** — one of:
  - `posted` — they posted or put up a Story about the issue. Fill in post_url, post_date,
    depth, and summary.
  - `not_posted` — you checked their profile *and Stories* and found nothing about the issue.
  - leave blank — you're only adding them to the board, or you're not sure yet.
- **post_url** — required if status is `posted`. A direct link to the post, an archived Story,
  or public coverage of it.
- **post_date** — required if status is `posted`. Format `YYYY-MM-DD`.
- **depth** — required if status is `posted`. One of:
  - `1` — a passing mention
  - `2` — a substantive post
  - `3` — standing on stage / explaining at length
- **summary** — required if status is `posted`. One neutral sentence describing *what* they
  did — never which side they took.
- **notes** — anything you want me to know. Not imported, just for me.

## Rules

- Only report what's public and link-able — no DMs, no rumors.
- Keep summaries neutral: describe the action, not the politics. We score substance, not stance.
- If someone's already on the board, match their name or handle exactly so your row updates
  them instead of creating a duplicate.
- Remember Stories vanish after 24 hours — if you're checking someone regularly, note the date
  you checked even when you found nothing.

Send the finished CSV back and it'll be run through `npm run import -- <file>`, which checks
everything against the data rules before anything is saved. Once it's committed, the leaderboard
rebuilds automatically from the data file — no separate step needed.
