---
name: core-workflow
description: How to find people with these tools - the order to call them, how to keep one search in one session, how to refine and page, and the batch limits. Read it before the first search in a conversation.
---

# Core workflow

Read the persona skill that matches the user's goal too: `recruiter` (hiring), `event` (inviting people), `gtm` (selling) or `vc-founders` (investing). Pass the same goal to `overview` as `purpose`.

To write or edit a query, read `people-recipes`: how each kind of requirement becomes filters, boosts or claims. When the brief names companies or describes a kind of company, read `company-recipes` too.

## Tool order

1. `overview` with the user's brief (and `purpose` and `companies` when known). It is free: it returns a summary, about how many people match, up to 4 claims and a `query`. Show the summary, the count and the claims, and ask whether to go ahead. The summary says which parts of the brief only rank people or are left to the claims; say that to the user too.
2. `search` with that `query`, as returned. It returns 20 people per page as short cards.
3. For the people the user picks:
   - `enrich_profile` for full profiles (roles with dates, education, skills);
   - `check_claims` to check claims against them: the claims from `overview`, or ones the user writes;
   - `find_contact` for email addresses, only for people the user wants to contact.
4. To start from companies, call `search_companies` first, then pass the companies it returns to `overview` as `companies`, as they are.

## One step per turn

Go one step at a time with the user, even when the first message asks for everything ("find X and check the best 5"):

1. `overview` (free). Stop: show the summary, the count and the claims, and ask whether to search, change the brief or change the claims.
2. Once the user agrees, `search` for one page. Stop: show the cards as a short numbered list and ask who to look at more closely.
3. `enrich_profile`, `check_claims` or `find_contact` only for the people the user picked in this conversation, and only the tool they asked for. Stop after each call and show the result.

- Never pick people yourself for a paid step ("the best 5"). Suggest a few with the reason from their card, and let the user choose.
- "Yes", "go ahead" or naming people is the go-ahead for that one step, not for the steps after it.
- A next page, an enrich, a check and a contact lookup are each paid: one paid call per user turn, unless the user asked for that exact combination for people they named.

## One search, one session

- Every result carries a `session_id`. Pass it to every later call for the same search: `overview`, `search`, `enrich_profile`, `check_claims`, `find_contact` and `search_companies`.
- The session keeps everyone already shown out of later pages, also after the query changes, and serves again what it already has (a page, a profile, a verdict) without paying twice.
- Leave `session_id` out only to start a new search for a different brief.
- To continue a search from an earlier conversation, find it with `list_searches` and read it with `get_search`. Save people the user likes with `shortlist_candidate`.

## Checking the user's own list

When the user brings their own people (LinkedIn URLs or profile ids), skip `overview` and `search`:

- `check_claims` with their URLs and the claims they care about, written as facts a profile can show ("Has worked at a crypto or blockchain company", "Has spoken at a conference");
- `enrich_profile` when they want the full profiles;
- `find_contact` for the ones they want to reach.
- The first call opens a session; pass its `session_id` to the later calls about the same list.

The same person given twice, or as both a URL and an id, is looked up once. Values that aren't LinkedIn profiles come back as `VALIDATION_ERROR` listing them; ask the user for the right links.

## Reading verdicts

- `check_claims` numbers claims `claim_1` to `claim_4` in the order given; match them to `overview` claims by their text.
- The reason names the roles that count, or the roles checked when none does, or the parts of the profile it read. Quote it when you tell the user why.
- `confidence` is how sure a `true` or `false` verdict is; `not_enough_information` has none.
- `unavailable` comes with a reason (checker down, out of time, profile unreadable); offer to check those people again.

## Refining

- To change the search, edit the `query` (add, drop or change one condition) and call `search` again, or call `overview` again with a revised brief. `people-recipes` has the recipe for each kind of change.
- For the next page of the same query, pass the `page_token` from the last page and the `session_id`.

## Batch limits

- At most 20 people per `enrich_profile`, `check_claims` or `find_contact` call, and at most 4 claims.
- `search` (each page), `enrich_profile`, `check_claims` and `find_contact` cost money; `overview` does not. Ask the user before enriching, checking or contacting more than a handful of people.

## Keeping the conversation short

- After each page, keep one short line with the `session_id` and the current query's gist; you need both for the next call.
- Show people as a compact list (name, title, company, location). Don't repeat full profiles you already showed.
- Verdicts annotate people; they never hide anyone. Let the user decide who fits.
