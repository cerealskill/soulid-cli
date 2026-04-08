import { createInterface } from 'readline'
import { writeFileSync, existsSync } from 'fs'
import { createSoulId, generateInstance } from '@soulid/core'

function ask(rl, question, defaultValue = '') {
  return new Promise(resolve => {
    const hint = defaultValue ? ` (${defaultValue})` : ''
    rl.question(`${question}${hint}: `, answer => {
      resolve(answer.trim() || defaultValue)
    })
  })
}

function askList(rl, question, defaultValue = '') {
  return new Promise(resolve => {
    const hint = defaultValue ? ` (${defaultValue})` : ''
    rl.question(`${question}${hint}: `, answer => {
      const raw = answer.trim() || defaultValue
      resolve(raw.split(',').map(s => s.trim()).filter(Boolean))
    })
  })
}

export async function init([outputArg]) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })

  console.log('\n✨ SOUL ID — init\n')
  console.log('Creates a new Soul Document (soul.json).')
  console.log('Press Enter to accept defaults.\n')

  const namespace = await ask(rl, 'Namespace', 'soulid')
  const archetype = await ask(rl, 'Archetype (e.g. assistant, scout, engineer)')
  if (!archetype) {
    console.error('\nArchetype is required.')
    rl.close()
    process.exit(1)
  }

  const version   = await ask(rl, 'Version', 'v1')
  const instance  = await ask(rl, 'Instance (leave blank to auto-generate)', generateInstance())
  const soul_id   = createSoulId(namespace, archetype, version, instance)

  const name        = await ask(rl, 'Name (display name)', archetype)
  const purpose     = await ask(rl, 'Purpose (one sentence)')
  const values      = await askList(rl, 'Values (comma-separated, e.g. honesty,speed)', 'helpfulness')
  const capabilities = await askList(rl, 'Capabilities (comma-separated, e.g. code,search)', '')
  const memoryType  = await ask(rl, 'Memory type (persistent / ephemeral / none)', 'persistent')
  const memBackend  = memoryType === 'persistent'
    ? await ask(rl, 'Memory backend (file / git / s3)', 'file')
    : undefined

  const ownerIdRaw  = await ask(rl, 'Owner (GitHub username or DID, optional)', '')
  const runtime     = await ask(rl, 'Preferred runtime (openclaw / claude-code / any)', 'openclaw')

  rl.close()

  // Build Soul Document
  const doc = {
    soul_id,
    name: name || archetype,
    archetype,
    purpose: purpose || `${archetype} agent`,
    values,
    capabilities,
    memory: {
      type: memoryType,
      ...(memBackend ? { backend: memBackend } : {}),
    },
    lineage: {
      origin: `${namespace}:${archetype}:${version}`,
      created_at: new Date().toISOString().split('T')[0],
    },
    ...(ownerIdRaw ? {
      owner: {
        id: ownerIdRaw,
        type: ownerIdRaw.startsWith('did:') ? 'individual' : 'individual',
      }
    } : {}),
    runtime_hints: {
      preferred_runtime: runtime,
      soul_file: 'SOUL.md',
      memory_strategy: 'pointer-index',
    },
  }

  const outPath = outputArg || 'soul.json'

  if (existsSync(outPath)) {
    const overwriteRl = createInterface({ input: process.stdin, output: process.stdout })
    await new Promise(resolve => {
      overwriteRl.question(`\n⚠  ${outPath} already exists. Overwrite? (y/N): `, answer => {
        overwriteRl.close()
        if (answer.trim().toLowerCase() !== 'y') {
          console.log('Aborted.')
          process.exit(0)
        }
        resolve()
      })
    })
  }

  writeFileSync(outPath, JSON.stringify(doc, null, 2) + '\n')
  console.log(`\n✓ Created ${outPath}`)
  console.log(`  soul_id: ${soul_id}`)
  console.log('\nNext steps:')
  console.log(`  SOULID_API_KEY=<key> soulid publish ${outPath}`)
  console.log(`  soulid resolve ${soul_id}`)
}
