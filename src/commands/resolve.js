import { apiFetch } from '../api.js'

export async function resolve([soulId]) {
  if (!soulId) {
    console.error('Usage: soulid resolve <soul_id>')
    process.exit(1)
  }
  const doc = await apiFetch(`/resolve/${encodeURIComponent(soulId)}`)
  console.log(JSON.stringify(doc, null, 2))
}
