export function help() {
  console.log(`
  soulid — SOUL ID Registry CLI

  COMMANDS
    init [soul.json]           Create a new Soul Document interactively
    resolve <soul_id>          Resolve a soul identifier from the registry
    publish <soul.json>        Validate + publish a Soul Document to the registry
    list [options]             List registered souls

  LIST OPTIONS
    --archetype <type>         Filter by archetype
    --owner <id>               Filter by owner
    --q <name>                 Search by name
    --limit <n>                Results per page (default 20, max 100)
    --offset <n>               Pagination offset

  ENVIRONMENT
    SOULID_API_KEY             API key (required for publish)
    SOULID_REGISTRY            Registry base URL (default: https://registry.soulid.io)

  EXAMPLES
    soulid init                                      # interactive setup
    soulid resolve soulid:rasputina:v1:001
    soulid list --archetype assistant
    soulid publish ./soul.json
  `)
}
