import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')

export const dataPath = path.join(root, 'public/data/influencers.json')
export const schemaPath = path.join(root, 'schema/influencers.schema.json')

export const COUNTED_PLATFORMS = new Set(['instagram', 'public'])

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function loadData() {
  return JSON.parse(readFileSync(dataPath, 'utf8'))
}

export function saveData(data) {
  data.meta.updatedAt = new Date().toISOString()
  writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`)
}

let compiledValidator = null
function getValidator() {
  if (!compiledValidator) {
    const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
    const ajv = new Ajv2020({ allErrors: true, strict: true })
    addFormats(ajv)
    compiledValidator = ajv.compile(schema)
  }
  return compiledValidator
}

// Schema compliance plus the cross-field business rules the schema can't express on its own.
export function validateData(data) {
  const errors = []
  const validateSchema = getValidator()

  if (!validateSchema(data)) {
    for (const err of validateSchema.errors) {
      errors.push(`[schema] ${err.instancePath || '(root)'} ${err.message}`)
    }
  }

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

  return errors
}
