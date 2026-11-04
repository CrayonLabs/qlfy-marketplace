# qlfy-marketplace

Public Claude Code marketplace for CrayonLabs. No server code and no secrets here.

- Skills in `plugins/qlfy/skills/` are the single source for both the plugin and the search-mcp server (git submodule at `search-mcp/marketplace/`). A skill change reaches plugin users on release, and the server when search-mcp bumps the submodule pointer.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`); Release Please derives the version from them.
- Set `version` only in `plugins/qlfy/.claude-plugin/plugin.json`, never in the marketplace entry.
- Run `claude plugin validate .` and `claude plugin validate ./plugins/qlfy` before pushing. After a skill change, also run `claude plugin eval plugins/qlfy --ablation none` (paid; mocks stand in for the qlfy server) and add a case under `plugins/qlfy/evals/` for any behaviour you fix.
- Mocks in `plugins/qlfy/evals/mocks/qlfy/` mirror the server's structured results; update them when search-mcp changes a tool's output.
