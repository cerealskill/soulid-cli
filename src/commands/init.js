import { createInterface } from 'readline'
import { writeFile, readFile } from 'fs/promises'
import { existsSync }         from 'fs'

function ask(rl, question, fallback = '') {
  return new Promise(resolve => {
    const prompt = fallback ? `${question} (${fallback}): ` : `${question}: `
    rl.question(prompt, ans => resolve(ans.trim() || fallback))
  })
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function init(args) {
  const outFile = args[0] || 'soul.json'

  // Don't overwrite without confirmation
  if (existsSync(outFile)) {
    const rl0 = createInterface({ input: process.stdin, output: process.stdout })
    const ans = await ask(rl0, `⚠️  ${outFile} already exists. Overwrite? (y/N)`, 'N')
    rl0.close()
    if (ans.toLowerCase() !== 'y') {
      console.log('Aborted.')
      process.exit(0)
    }
  }

  console.log('\n  ⚡ SOUL ID — Interactive Setup\n')

  const rl = createInterface({ input: process.stdin, output: process.stdout })

  const name      = await ask(rl, '  Agent name', 'My Agent')
  const slugRaw   = await ask(rl, '  Slug (identifier)', slugify(name))
  const slug      = slugify(slugRaw)
  const namespace = await ask(rl, '  Namespace', 'soulid')
  const version   = await ask(rl, '  Version', 'v1')
  const instance  = await ask(rl, '  Instance', '001')
  const soul_id   = `${namespace}:${slug}:${version}:${instance}`

  console.log(`\n  soul_id → ${soul_id}`)

  const archetype = await ask(rl, '\n  Archetype (assistant/analyst/coder/writer/researcher)', 'assistant')
  const purpose   = await ask(rl, '  Purpose (one line)')
  const valuesRaw = await ask(rl, '  Values (comma-separated)', 'reliability,helpfulness')
  const capsRaw   = await ask(rl, '  Capabilities (comma-separated)', 'web_search,code,memory')
  const runtime   = await ask(rl, '  Preferred runtime (openclaw/claude-code/codex/gemini)', 'openclaw')
  const ownerRaw  = await ask(rl, '  Owner (github username or DID)', '')

  rl.close()

  const values       = valuesRaw.split(',').map(v => v.trim()).filter(Boolean)
  const capabilities = capsRaw.split(',').map(v => v.trim()).filter(Boolean)

  const doc = {
    soul_id,
    name,
    archetype,
    purpose,
    values,
    capabilities,
    memory: {
      type: 'persistent',
      backend: 'file',
      strategy: 'pointer-index',
    },
    lineage: {
      origin: `${namespace}:${slug}:${version}`,
      created_at: new Date().toISOString().split('T')[0],
    },
    runtime_hints: {
      preferred_runtime: runtime,
    },
  }

  if (ownerRaw) {
    doc.owner = { id: ownerRaw, type: ownerRaw.startsWith('did:') ? 'did' : 'github' }
  }

  await writeFile(outFile, JSON.stringify(doc, null, 2) + '\n')

  console.log(`\n  ✅ Soul Document written to ${outFile}`)
  console.log(`\n  Next steps:`)
  console.log(`    soulid publish ${outFile}   # publish to registry`)
  console.log(`    soulid resolve ${soul_id}   # verify it's live\n`)
}
