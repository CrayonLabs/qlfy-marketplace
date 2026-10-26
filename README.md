# CrayonLabs plugin marketplace

Claude Code plugins from CrayonLabs.

| Plugin | What it adds |
| --- | --- |
| `qlfy` | The qlfy people-search connector (`https://mcp.qlfy.ai/mcp`, sign in with Google) and its skills: `system-rules`, `core-workflow` and the `recruiter`, `event`, `gtm` and `vc-founders` personas |

## Install

In Claude Code:

```text
/plugin marketplace add CrayonLabs/qlfy-marketplace
/plugin install qlfy@crayonlabs
```

Then run `/mcp`, pick `qlfy` and sign in. On a machine without a GitHub SSH key, set `CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1` before adding the marketplace.

## Updates

Auto-update is off for third-party marketplaces until you turn it on: `/plugin` → **Marketplaces** → `crayonlabs` → **Enable auto-update**. Without it, run `/plugin marketplace update crayonlabs`.

To turn it on for a team, add this to `.claude/settings.json` (per repository) or managed settings (per organization):

```json
{
  "extraKnownMarketplaces": {
    "crayonlabs": {
      "source": { "source": "github", "repo": "CrayonLabs/qlfy-marketplace" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": {
    "qlfy@crayonlabs": true
  }
}
```

## Layout

```text
.claude-plugin/marketplace.json   the catalog
plugins/qlfy/
  .claude-plugin/plugin.json      name, version, description
  .mcp.json                       the connector URL
  skills/<name>/SKILL.md          the skills
```

The skills are also the server's: `search-mcp` mounts this repository as a git submodule and serves the same files through `list_skills` and `get_skill`, for clients that do not load plugins.

## Releases

Commits on `main` follow [Conventional Commits](https://www.conventionalcommits.org). Release Please opens a release PR that bumps `plugins/qlfy/.claude-plugin/plugin.json`; merging it tags the release, and users receive the new version on their next update. The version lives only in `plugin.json`, as Claude Code expects.

Check changes with:

```bash
claude plugin validate .
claude plugin validate ./plugins/qlfy
```
