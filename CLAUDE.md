# qlfy-marketplace

Public Claude Code marketplace for CrayonLabs. No server code and no secrets here.

- Skills in `plugins/qlfy/skills/` are the single source for both the plugin and the search-mcp server (git submodule at `search-mcp/marketplace/`). A skill change reaches plugin users on release, and the server when search-mcp bumps the submodule pointer.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`); Release Please derives the version from them.
- Set `version` only in `plugins/qlfy/.claude-plugin/plugin.json`, never in the marketplace entry.
- Run `claude plugin validate .` and `claude plugin validate ./plugins/qlfy` before pushing. Run `node --test` after changing `plugins/qlfy/hooks/`. CI runs all three on every pull request.
- The `PostToolUse` hook on `search` shows each page to the user as a numbered list (`systemMessage`) and tells Claude it was shown, because in Claude Code, Claude kept summarising pages despite every instruction to list them. It needs `node`; without it the hook does nothing and the find-people skill asks Claude to list the page.
