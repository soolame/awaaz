#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const schemaPath = path.join(root, 'schema/influencers.schema.json')
const dataPath = path.join(root, 'public/data/influencers.json')

const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
const data = JSON.parse(readFileSync(dataPath, 'utf8'))

const ajv = new Ajv2020({ allErrors: true, strict: true })
addFormats(ajv)
const validateSchema = ajv.compile(schema)

const errors = []

if (!validateSchema(data)) {
  for (const err of validateSchema.errors) {
    errors.push(`[schema] ${err.instancePath || '(root)'} ${err.message}`)
  }
}

// Business rules the schema can't express on its own (cross-field checks).
const COUNTED_PLATFORMS = new Set(['instagram', 'public'])
const windowFrom = data.meta?.window?.from
const windowTo = data.meta?.window?.to
const seenIds = new Set()

for (const [i, creator] of (data.creators ?? []).entries()) {
  const label = `creators[${i}] (${creator.id ?? creator.name ?? '?'})`

  if (creator.id) {
    if (seenIds.has(creator.id)) {
      errors.push(`${label}: duplicate id "${creator.id}"`)
    }
    seenIds.add(creator.id)
  }

  const posts = creator.posts ?? []
  const countedPosts = posts.filter((p) => COUNTED_PLATFORMS.has(p.platform))

  posts.forEach((post, j) => {
    if (!post.url) {
      errors.push(`${label}.posts[${j}]: missing url`)
    }
    if (windowFrom && windowTo && post.date && (post.date < windowFrom || post.date > windowTo)) {
      errors.push(`${label}.posts[${j}]: date ${post.date} is outside the window ${windowFrom}..${windowTo}`)
    }
  })

  if (creator.status === 'no_post_found' && !creator.checkedAt) {
    errors.push(`${label}: status is "no_post_found" but checkedAt is not set`)
  }

  if (creator.status === 'no_post_found' && countedPosts.length > 0) {
    errors.push(`${label}: status is "no_post_found" but has ${countedPosts.length} counted post(s) on file`)
  }

  if (creator.status === 'spoke' && posts.length === 0) {
    errors.push(`${label}: status is "spoke" but has no posts at all`)
  }
}

if (errors.length > 0) {
  console.error(`✖ ${errors.length} problem(s) found in public/data/influencers.json:\n`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log(`✔ public/data/influencers.json is valid (${data.creators.length} creators)`)
