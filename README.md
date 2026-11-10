# CrayonLabs plugin marketplace

Claude Code plugins from CrayonLabs.

| Plugin | What it adds |
| --- | --- |
| `qlfy` | Find people from a plain-language brief: candidates to hire, guests to invite, buyers to sell to and founders to back. Adds the qlfy connector (`https://mcp.qlfy.ai/mcp`, sign in with Google) the `/qlfy` command (`/qlfy` followed by who you are looking for), and three skills Claude reads on its own: `find-people` (how to run a search and talk to the user, for every goal) and the `people-recipes` and `company-recipes` query recipes |

## Install

In Claude Code:

```text
/plugin marketplace add CrayonLabs/qlfy-marketplace
/plugin install qlfy@crayonlabs
```

Then run `/mcp`, pick `qlfy` and sign in. To start a search, type `/qlfy` followed by who you are looking for, for example `/qlfy senior Go engineers in Dubai with fintech experience` (`/qlfy:qlfy` if another command already uses the name). On a machine without a GitHub SSH key, set `CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1` before adding the marketplace.

## Updates

Auto-update is off for third-party marketplaces until you turn it on: `/plugin` → **Marketplaces** → `crayonlabs` → **Enable auto-update**. Without it, run `/plugin marketplace update crayonlabs`. The connector sends the plugin's version in the `X-Qlfy-Plugin-Version` header, and when it is older than the latest release the server's `overview` result reminds you to update.

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
  .mcp.json                       the connector URL and the X-Qlfy-Plugin-Version header
  skills/<name>/SKILL.md          the skills
```

The skills are also the server's: `search-mcp` mounts this repository as a git submodule and serves the same files through `list_skills` and `get_skill`, for clients that do not load plugins. The `qlfy` skill is the exception: it is a command for people (`disable-model-invocation: true`), and the server leaves it out.

## Releases

Commits on `main` follow [Conventional Commits](https://www.conventionalcommits.org). Release Please opens a release PR that bumps `plugins/qlfy/.claude-plugin/plugin.json` and the `X-Qlfy-Plugin-Version` header in `plugins/qlfy/.mcp.json`; merging it tags the release, and users receive the new version on their next update. Set the version by hand only in `plugin.json`, as Claude Code expects; Release Please keeps the header in step, and CI fails if the two differ. The server learns the latest version when `search-mcp` bumps its `marketplace` submodule, and from then on tells older plugins to update.

Check changes with:

```bash
claude plugin validate .
claude plugin validate ./plugins/qlfy
```

CI runs both on every pull request (`validate`).
