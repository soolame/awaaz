#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const dataPath = path.join(root, 'public/data/influencers.json')

const COUNTED_PLATFORMS = new Set(['instagram', 'public'])

function usageAndExit(message) {
  if (message) console.error(`✖ ${message}\n`)
  console.error(`Usage:
  npm run mark -- <id> quiet
  npm run mark -- <id> spoke <url> <depth 1-3> "<summary>"
  npm run mark -- add "<name>" <instagram_handle> <followers> <category>`)
  process.exit(1)
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function loadData() {
  return JSON.parse(readFileSync(dataPath, 'utf8'))
}

function saveData(data) {
  data.meta.updatedAt = new Date().toISOString()
  writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`)
}

function findCreator(data, id) {
  const creator = data.creators.find((c) => c.id === id)
  if (!creator) {
    usageAndExit(`No creator with id "${id}". Check public/data/influencers.json for the correct id.`)
  }
  return creator
}

const [cmd, ...rest] = process.argv.slice(2)
if (!cmd) usageAndExit()

if (cmd === 'add') {
  const [name, handle, followersStr, category] = rest
  if (!name || !handle || !followersStr || !category) {
    usageAndExit('add requires: "<name>" <instagram_handle> <followers> <category>')
  }
  const followers = Number(followersStr)
  if (!Number.isFinite(followers) || followers < 0) {
    usageAndExit(`followers must be a non-negative number, got "${followersStr}"`)
  }

  const data = loadData()
  const id = slugify(name)
  if (!id) usageAndExit(`Could not derive an id from name "${name}"`)
  if (data.creators.some((c) => c.id === id)) {
    usageAndExit(`A creator with id "${id}" already exists. Edit the file by hand if this is intentional.`)
  }

  data.creators.push({
    id,
    name,
    category,
    followers,
    followersApprox: true,
    handles: { instagram: handle },
    status: 'unchecked',
    checkedAt: null,
    posts: [],
  })

  saveData(data)
  console.log(`✔ Added "${name}" as ${id} (unchecked)`)
} else {
  const id = cmd
  const action = rest[0]
  const data = loadData()
  const creator = findCreator(data, id)

  if (action === 'quiet') {
    const countedPosts = creator.posts.filter((p) => COUNTED_PLATFORMS.has(p.platform))
    if (countedPosts.length > 0) {
      usageAndExit(
        `${id} already has ${countedPosts.length} counted post(s) on file — marking "quiet" would fail validation. Review the existing posts instead.`,
      )
    }
    creator.status = 'no_post_found'
    creator.checkedAt = today()
    saveData(data)
    console.log(`✔ Marked ${id} as quiet (no post found as of ${creator.checkedAt})`)
  } else if (action === 'spoke') {
    const [url, depthStr, summary] = rest.slice(1)
    if (!url || !depthStr || !summary) {
      usageAndExit('spoke requires: <id> spoke <url> <depth 1-3> "<summary>"')
    }
    const depth = Number(depthStr)
    if (![1, 2, 3].includes(depth)) {
      usageAndExit(`depth must be 1, 2 or 3, got "${depthStr}"`)
    }

    creator.posts.push({
      date: today(),
      platform: 'instagram',
      depth,
      url,
      summary,
    })
    creator.status = 'spoke'
    creator.checkedAt = today()
    saveData(data)
    console.log(`✔ Added a depth-${depth} Instagram post for ${id} and marked them spoke`)
  } else {
    usageAndExit(`Unknown action "${action ?? ''}" for creator "${id}"`)
  }
}
