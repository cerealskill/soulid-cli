const BASE = process.env.SOULID_REGISTRY || 'https://registry.soulid.io'

export async function apiFetch(path, opts = {}) {
  const url = `${BASE}${path}`
  const res = await fetch(url, opts)
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { json = { raw: text } }
  if (!res.ok) {
    throw new Error(`${res.status} ${JSON.stringify(json)}`)
  }
  return json
}

export function getApiKey() {
  const key = process.env.SOULID_API_KEY
  if (!key) {
    console.error('Missing SOULID_API_KEY environment variable.')
    process.exit(1)
  }
  return key
}
