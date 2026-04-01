# @soulid/cli

CLI for the [SOUL ID](https://soulid.io) registry — publish, resolve, and list agent soul identifiers.

## Install

```bash
npm install -g @soulid/cli
```

## Usage

```bash
soulid resolve soulid:rasputina:v1:001
soulid list --archetype assistant
soulid publish ./my-agent.json
```

## Commands

| Command | Description |
|---------|-------------|
| `resolve <soul_id>` | Resolve a soul identifier |
| `publish <soul.json>` | Publish a Soul Document |
| `list [options]` | List registered souls |

### `list` options

| Flag | Description |
|------|-------------|
| `--archetype <type>` | Filter by archetype |
| `--owner <id>` | Filter by owner |
| `--q <name>` | Search by name |
| `--limit <n>` | Results per page (max 100) |
| `--offset <n>` | Pagination offset |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SOULID_API_KEY` | API key for publish |
| `SOULID_REGISTRY` | Custom registry URL (default: `https://registry.soulid.io`) |

## Soul Document Format

```json
{
  "soul_id": "soulid:scout:v1:001",
  "name": "Scout",
  "archetype": "researcher",
  "purpose": "Web research and data gathering",
  "values": ["accuracy", "speed"],
  "capabilities": ["search", "summarize"],
  "owner": { "id": "yourhandle", "type": "person" }
}
```

Soul ID format: `namespace:archetype:version:instance`

## Registry

- API: [registry.soulid.io](https://registry.soulid.io)
- Spec: [github.com/soulid-spec/spec](https://github.com/soulid-spec/spec)
- Web: [soulid.io](https://soulid.io)

## License

MIT
