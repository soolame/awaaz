Read CLAUDE.md first. Add the data workflow so I can maintain the list by hand safely.

1. schema/influencers.schema.json: JSON Schema (draft 2020-12) for the data contract.
2. scripts/validate.mjs (ajv): validate public/data/influencers.json and also fail if any
   post lacks a url, ids repeat, a post date is outside meta.window, status is
   "no_post_found" without checkedAt, status is "no_post_found" but counted posts exist,
   or status is "spoke" with no posts. Add `npm run validate` and run it in CI before build.
3. scripts/mark.mjs, a small CLI:
   - npm run mark -- <id> quiet                  -> status no_post_found, checkedAt today
   - npm run mark -- <id> spoke <url> <depth> "<summary>"   -> adds an instagram post,
     status spoke, checkedAt today
   - npm run mark -- add "<name>" <instagram_handle> <followers> <category>  -> new
     unchecked creator with a slug id
   It updates meta.updatedAt and keeps the file pretty-printed.
4. .github/ISSUE_TEMPLATE/add-post.yml (form: creator, Instagram handle, post URL, date,
   suggested depth 1-3, short neutral summary) and .github/ISSUE_TEMPLATE/correction.md
   (for fixes or removal requests).
5. A short "Maintaining the data" section in README.md with the daily checking routine:
   open each unchecked profile, check posts and stories since meta.window.from, run mark,
   validate, commit.
Commit and push.
