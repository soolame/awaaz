#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { COUNTED_PLATFORMS, today, slugify, loadData, saveData, validateData } from './lib/data-contract.mjs'

const REQUIRED_HEADERS = [
  'name',
  'instagram_handle',
  'category',
  'followers',
  'status',
  'post_url',
  'post_date',
  'depth',
  'summary',
]

function usageAndExit(message) {
  if (message) console.error(`✖ ${message}\n`)
  console.error('Usage:\n  npm run import -- <path-to-filled-csv>')
  process.exit(1)
}

// Minimal RFC4180 parser: handles quoted fields, embedded commas/newlines, and "" escaping.
function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  let i = 0

  const pushField = () => {
    row.push(field)
    field = ''
  }
  const pushRow = () => {
    pushField()
    rows.push(row)
    row = []
  }

  while (i < text.length) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      field += c
      i++
      continue
    }
    if (c === '"') {
      inQuotes = true
      i++
      continue
    }
    if (c === ',') {
      pushField()
      i++
      continue
    }
    if (c === '\r') {
      i++
      continue
    }
    if (c === '\n') {
      pushRow()
      i++
      continue
    }
    field += c
    i++
  }
  if (field.length > 0 || row.length > 0) pushRow()

  return rows.filter((r) => !(r.length === 1 && r[0] === ''))
}

function normalizeHandle(handle) {
  return handle.trim().replace(/^@/, '').toLowerCase()
}

const [csvPathArg] = process.argv.slice(2)
if (!csvPathArg) usageAndExit()

const csvPath = path.resolve(process.cwd(), csvPathArg)
let csvText
try {
  csvText = readFileSync(csvPath, 'utf8')
} catch {
  usageAndExit(`Could not read "${csvPathArg}"`)
}

const rows = parseCSV(csvText)
if (rows.length === 0) usageAndExit('CSV is empty')

const header = rows[0].map((h) => h.trim().toLowerCase())
const missingHeaders = REQUIRED_HEADERS.filter((h) => !header.includes(h))
if (missingHeaders.length > 0) {
  usageAndExit(`CSV is missing column(s): ${missingHeaders.join(', ')}`)
}
const colIndex = Object.fromEntries(header.map((h, i) => [h, i]))

const data = loadData()
const byHandle = new Map()
const byId = new Map()
for (const c of data.creators) {
  byId.set(c.id, c)
  if (c.handles?.instagram) byHandle.set(normalizeHandle(c.handles.instagram), c)
}

const report = { added: [], spoke: [], quiet: [], followersUpdated: [], skipped: [] }
const skip = (rowNum, reason) => report.skipped.push(`row ${rowNum}: ${reason}`)

rows.slice(1).forEach((cells, idx) => {
  const rowNum = idx + 2 // +2: 1-indexed, plus the header row
  const get = (col) => (cells[colIndex[col]] ?? '').trim()

  const name = get('name')
  if (!name || name.toUpperCase().startsWith('EXAMPLE')) return

  const handleRaw = get('instagram_handle')
  const handle = handleRaw ? normalizeHandle(handleRaw) : ''
  const category = get('category')
  const followersStr = get('followers')
  const status = get('status').toLowerCase()
  const postUrl = get('post_url')
  const postDate = get('post_date') || today()
  const depthStr = get('depth')
  const summary = get('summary')

  let creator = (handle && byHandle.get(handle)) || byId.get(slugify(name))

  if (!creator) {
    if (!followersStr || !category) {
      skip(rowNum, `"${name}" isn't an existing creator and is missing followers/category needed to add them`)
      return
    }
    const followers = Number(followersStr)
    if (!Number.isFinite(followers) || followers < 0) {
      skip(rowNum, `"${name}": followers must be a non-negative number, got "${followersStr}"`)
      return
    }
    const id = slugify(name)
    if (!id) {
      skip(rowNum, `could not derive an id from name "${name}"`)
      return
    }
    creator = {
      id,
      name,
      category,
      followers,
      followersApprox: true,
      handles: handle ? { instagram: handle } : {},
      status: 'unchecked',
      checkedAt: null,
      posts: [],
    }
    data.creators.push(creator)
    byId.set(id, creator)
    if (handle) byHandle.set(handle, creator)
    report.added.push(`${name} (${id})`)
  } else if (followersStr) {
    const followers = Number(followersStr)
    if (Number.isFinite(followers) && followers >= 0 && followers !== creator.followers) {
      creator.followers = followers
      report.followersUpdated.push(`${creator.id}: ${followers.toLocaleString('en-US')}`)
    }
  }

  if (status === 'posted') {
    if (!postUrl || !depthStr || !summary) {
      skip(rowNum, `${creator.id}: status "posted" requires post_url, depth and summary`)
      return
    }
    const depth = Number(depthStr)
    if (![1, 2, 3].includes(depth)) {
      skip(rowNum, `${creator.id}: depth must be 1, 2 or 3, got "${depthStr}"`)
      return
    }
    if (creator.posts.some((p) => p.url === postUrl)) {
      skip(rowNum, `${creator.id}: a post with this exact url is already on file, skipped as a duplicate`)
      return
    }
    creator.posts.push({ date: postDate, platform: 'instagram', depth, url: postUrl, summary })
    creator.status = 'spoke'
    creator.checkedAt = today()
    report.spoke.push(`${creator.id} (depth ${depth})`)
  } else if (status === 'not_posted') {
    const countedPosts = creator.posts.filter((p) => COUNTED_PLATFORMS.has(p.platform))
    if (countedPosts.length > 0) {
      skip(rowNum, `${creator.id}: already has counted post(s) on file, leaving status as "spoke"`)
      return
    }
    creator.status = 'no_post_found'
    creator.checkedAt = today()
    report.quiet.push(creator.id)
  }
  // Blank/other status: leave status untouched (new creators stay "unchecked").
})

const errors = validateData(data)
if (errors.length > 0) {
  console.error(`✖ Import produced ${errors.length} problem(s) — nothing was written:\n`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

saveData(data)

console.log(`✔ Imported ${csvPathArg}`)
if (report.added.length) console.log(`  Added: ${report.added.join(', ')}`)
if (report.spoke.length) console.log(`  Marked spoke: ${report.spoke.join(', ')}`)
if (report.quiet.length) console.log(`  Marked quiet: ${report.quiet.join(', ')}`)
if (report.followersUpdated.length) console.log(`  Updated followers: ${report.followersUpdated.join(', ')}`)
if (report.skipped.length) {
  console.log(`  Skipped ${report.skipped.length} row(s):`)
  for (const s of report.skipped) console.log(`    - ${s}`)
}
