# qlfy

Find people from a plain-language brief, inside Claude: candidates to hire, guests to invite, buyers to sell to and founders to back. Describe who you need, see a free plan with how many people match, then go through 20 people a page. qlfy checks what their profiles claim against your brief, opens full profiles, finds work emails and keeps a shortlist, only for the people you pick.

## What it adds

- **The qlfy connector** at `https://mcp.qlfy.ai/mcp`. You sign in with Google the first time you use it; there is no API key.
- **`/qlfy`**: type `/qlfy` followed by who you are looking for, for example `/qlfy senior Go engineers in Dubai with fintech experience`.
- **Three skills Claude reads on its own**: `find-people` (how to run a search with you, one step per turn), `people-recipes` and `company-recipes` (how to turn a brief into a people or company query).

The plugin has no hooks, scripts or local servers.

## What it sends and where

The plugin talks to one service, the qlfy server at `mcp.qlfy.ai`, run by CrayonLabs. Claude sends it your briefs, the queries it builds, and the people you choose to check, open, look up or shortlist. Every request carries the plugin's version in the `X-Qlfy-Plugin-Version` header, so the server can tell you when an update is out. Your searches and shortlists are saved to your account so you can resume them in a new chat; nobody else sees them.

## Cost

You start with $10 of usage. The plan is always free. Credits are spent only on new people a search shows you and on emails that are found; Claude tells you before it spends. Top up with Stripe from $10, from inside the chat.

## Privacy and support

- Privacy policy: https://qlfy.ai/privacy
- Setup guide and troubleshooting: https://mcp.qlfy.ai/setup
- Support: info@crayonlabs.ai
