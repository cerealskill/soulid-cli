import { apiFetch, getApiKey } from '../api.js'
import { readFileSync } from 'fs'
import { validate } from '@soulid/core'

export async function publish([filePath]) {
  if (!filePath) {
    console.error('Usage: soulid publish <soul.json>')
    process.exit(1)
  }

  let doc
  try {
    doc = JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (e) {
    console.error(`Cannot read ${filePath}: ${e.message}`)
    process.exit(1)
  }

  // Validate before publishing
  const result = validate(doc)
  if (!result.valid) {
    console.error('✗ Invalid Soul Document:')
    for (const err of result.errors) {
      console.error(`  • ${err.field}: ${err.message}`)
    }
    process.exit(1)
  }

  const key = getApiKey()
  const res = await apiFetch('/publish', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(doc),
  })

  console.log(`✓ Published: ${res.soul_id}`)
}
