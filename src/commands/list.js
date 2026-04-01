import { apiFetch } from '../api.js'

// Parse --key=value or --key value flags from args
function parseFlags(args) {
  const flags = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const [key, val] = args[i].slice(2).split('=')
      flags[key] = val !== undefined ? val : (args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true)
    }
  }
  return flags
}

export async function list(args) {
  const flags = parseFlags(args)
  const params = new URLSearchParams()
  if (flags.archetype) params.set('archetype', flags.archetype)
  if (flags.owner)     params.set('owner', flags.owner)
  if (flags.q)         params.set('q', flags.q)
  if (flags.limit)     params.set('limit', flags.limit)
  if (flags.offset)    params.set('offset', flags.offset)

  const qs = params.toString()
  const data = await apiFetch(`/souls${qs ? '?' + qs : ''}`)

  console.log(`Found ${data.total} soul(s) — showing ${data.items.length} (offset ${data.offset})\n`)
  for (const item of data.items) {
    const date = new Date(item.created_at).toISOString().slice(0, 10)
    console.log(`  ${item.soul_id.padEnd(36)} ${(item.name || '').padEnd(20)} ${(item.archetype || '').padEnd(16)} ${date}`)
  }
}
