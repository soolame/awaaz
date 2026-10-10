#!/usr/bin/env node
import { loadData, validateData } from './lib/data-contract.mjs'

const data = loadData()
const errors = validateData(data)

if (errors.length > 0) {
  console.error(`✖ ${errors.length} problem(s) found in public/data/influencers.json:\n`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log(`✔ public/data/influencers.json is valid (${data.creators.length} creators)`)
