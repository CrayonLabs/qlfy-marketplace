# CrayonLabs plugin marketplace

Claude Code plugins from CrayonLabs.

| Plugin | What it adds |
| --- | --- |
| `qlfy` | Find people from a plain-language brief: candidates to hire, guests to invite, buyers to sell to and founders to back. Adds the qlfy connector (`https://mcp.qlfy.ai/mcp`, sign in with Google) and three skills Claude reads on its own: `find-people` (how to run a search and talk to the user, for every goal) and the `people-recipes` and `company-recipes` query recipes |

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
  evals/                          eval cases, graders and qlfy server mocks
```

The skills are also the server's: `search-mcp` mounts this repository as a git submodule and serves the same files through `list_skills` and `get_skill`, for clients that do not load plugins.

## Releases

Commits on `main` follow [Conventional Commits](https://www.conventionalcommits.org). Release Please opens a release PR that bumps `plugins/qlfy/.claude-plugin/plugin.json`; merging it tags the release, and users receive the new version on their next update. The version lives only in `plugin.json`, as Claude Code expects.

Check changes with:

```bash
claude plugin validate .
claude plugin validate ./plugins/qlfy
claude plugin eval plugins/qlfy --ablation none
```

CI runs both validations on every pull request (`validate`). The `evals` workflow runs the eval suite on pull requests that touch the plugin when the `ANTHROPIC_API_KEY` secret is set; the qlfy server is replaced by the mocks in `plugins/qlfy/evals/mocks/`, so no sign-in is needed. The cases check that a first search reads one skill, never calls `get_skill`, stops after the free overview with a short reply, and that a page reply lists every person.
