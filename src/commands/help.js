export function help() {
  console.log(`
  soulid — SOUL ID Registry CLI

  COMMANDS
    resolve <soul_id>          Resolve a soul identifier
    publish <soul.json>        Publish a Soul Document to the registry
    list [options]             List registered souls

  LIST OPTIONS
    --archetype <type>         Filter by archetype
    --owner <id>               Filter by owner
    --q <name>                 Search by name
    --limit <n>                Results per page (default 20, max 100)
    --offset <n>               Pagination offset

  ENVIRONMENT
    SOULID_API_KEY             API key for publish (required for publish)
    SOULID_REGISTRY            Registry base URL (default: https://registry.soulid.io)

  EXAMPLES
    soulid resolve soulid:rasputina:v1:001
    soulid list --archetype assistant
    soulid publish ./rasputina.json
  `)
}
