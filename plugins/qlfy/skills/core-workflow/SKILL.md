---
name: core-workflow
description: How to find people with these tools - the order to call them, how to keep one search in one session, how to refine and page, and the batch limits. Read it before the first search in a conversation.
user-invocable: false
---

# Core workflow

Read the persona skill that matches the user's goal too: `recruiter` (hiring), `event` (inviting people), `gtm` (selling) or `vc-founders` (investing). Pass the same goal to `overview` as `purpose`.

To write or edit a query, read `people-recipes`: how each kind of requirement becomes filters, boosts or claims. When the brief names companies or describes a kind of company, read `company-recipes` too.

## Talking to the user

The user is not technical. These rules hold on every turn and come before any other skill's wording.

- **Keep the machinery hidden.** Never mention skills, personas, recipes, tools, queries, filters, boosts, fields, sessions, page tokens or `purpose`, and never say which skill you are reading. Say "things to check" instead of "claims", and "the search" instead of "the query".
- **Short replies.** At most three short lines of text per turn, plus the people list when there is one. No headings, no explaining how you search, no recap of the brief.
- **Ask with clickable choices.** When you have a tool that shows clickable choices or a form (AskUserQuestion in Claude Code, or the equivalent in the Claude apps), every question goes through it: never ask in prose when it is available. Use short labels, mark one option "(Recommended)" and list it first.
- **Ask only when it matters.** Ask only what changes who matches or what gets paid for. Pick a sensible default for the rest and name it in a few words ("Dubai only").
- **Search before asking.** `overview` is free, so run it on the brief as given and ask your questions after it. Ask first only when the brief doesn't say what kind of person to find.

## Tool order

1. `overview` with the user's brief (and `purpose` and `companies` when known). It is free: it returns a summary, about how many people match, up to 4 claims and a `query`. Reply as "After the overview" below says.
2. `search` with that `query`, as returned. It returns 20 people per page as short cards.
3. For the people the user picks:
   - `enrich_profile` for full profiles (roles with dates, education, skills);
   - `check_claims` to check claims against them: the claims from `overview`, or ones the user writes;
   - `find_contact` for email addresses, only for people the user wants to contact.
4. To start from companies, call `search_companies` first, then pass the companies it returns to `overview` as `companies`, as they are.

## One step per turn

Go one step at a time with the user, even when the first message asks for everything ("find X and check the best 5"):

1. `overview` (free). Stop: a short summary, then the choices ("After the overview").
2. Once the user agrees, `search` for one page. Stop: show the cards as a short numbered list (one line each), then ask the next step with clickable choices: "Check some of them" (the user types the numbers), "Show the next 20", "Change the search".
3. `enrich_profile`, `check_claims` or `find_contact` only for the people the user picked in this conversation, and only the tool they asked for. Stop after each call and show the result.

- Never pick people yourself for a paid step ("the best 5"). Suggest a few with the reason from their card, and let the user choose.
- "Yes", "go ahead" or naming people is the go-ahead for that one step, not for the steps after it.
- A next page, an enrich, a check and a contact lookup are each paid: one paid call per user turn, unless the user asked for that exact combination for people they named.

## After the overview

Keep the reply short and let the choices do the work.

1. **Two or three lines of text:** who the query finds, about how many, and that nothing has been charged. Name a default you picked in a few words ("Abu Dhabi only"). Don't list the titles, boosts, fields or the query; the user can ask.
2. **At most one caveat,** and only one that changes how far the list can be trusted. The overview summary says which parts of the brief only rank people or are left to claims: "Pharma background isn't filtered; I'll check it on the people you pick."
3. **Then the choices,** with the clickable choices tool ("Talking to the user"). AskUserQuestion takes up to 4 questions with 2 to 4 options each, and the user can always type their own answer.
   - Question 1 is the next step. Its first option is "Run the first 20 (Recommended)"; the second is "Change the search first".
   - Questions 2 to 4 are the open choices that change who matches, most important first. The persona skill lists the usual ones. Ask only what the brief leaves open and what would change the count; pick a default for the rest. Every question has one option marked "(Recommended)", listed first.
   - Keep what the user asked for. A widening or narrowing of their own words (another city, other titles) is an option, never the recommended one and never applied before they pick it. When the count is very small, you may run one more free `overview` to show the count a wider option would give.
   - If a slot is left, add a multi-select question for which things to check later, the most decisive first, each in plain words. Otherwise don't list them now; offer them when the user picks people to check.
   - Only when no such tool exists, ask questions 2 to 4 in text: a numbered list, one line each with its options and the recommended one marked, then "Reply 'go' to run the first 20 with the recommended options."
   - A precise brief with nothing open gets only question 1.
4. **Then act on the answers.** Never pay for a page on a query whose count the user hasn't seen.
   - "Run", and no answer changes the query: `search` for one page.
   - "Run", and an answer changes the query (a recommended change included): call `overview` again with the revised brief (free). If it still finds at least 20 people, say the new count in one line and `search` for one page; otherwise reply as above with the new count.
   - "Change the search first": call `overview` again with the revised brief and reply the same way.

Never show the `session_id` or the query JSON unless the user asks.

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
- When a page is thin or off and you suggest ways to widen or narrow, reply like after the overview: one or two lines on what the page showed, then the ways as clickable questions (multi-select when they combine), not paragraphs. A change the user picks gets a free `overview` count before the next paid page.
- For the next page of the same query, pass the `page_token` from the last page and the `session_id`.

## Batch limits

- At most 20 people per `enrich_profile`, `check_claims` or `find_contact` call, and at most 4 claims.
- `search` (each page), `enrich_profile`, `check_claims` and `find_contact` cost money; `overview` does not. Ask the user before enriching, checking or contacting more than a handful of people.

## Keeping the conversation short

- Keep the `session_id` and the current query for the next call, but don't show them to the user unless asked.
- Show people as a compact list (name, title, company, location). Don't repeat full profiles you already showed.
- Verdicts annotate people; they never hide anyone. Let the user decide who fits.
