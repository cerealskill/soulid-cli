#!/usr/bin/env node
import { resolve } from '../src/commands/resolve.js'
import { publish } from '../src/commands/publish.js'
import { list }    from '../src/commands/list.js'
import { help }    from '../src/commands/help.js'

const [,, cmd, ...args] = process.argv

const commands = { resolve, publish, list, help }

if (!cmd || cmd === '--help' || cmd === '-h') {
  help()
  process.exit(0)
}

if (!commands[cmd]) {
  console.error(`Unknown command: ${cmd}\nRun 'soulid help' for usage.`)
  process.exit(1)
}

try {
  await commands[cmd](args)
} catch (e) {
  console.error(`Error: ${e.message}`)
  process.exit(1)
}
