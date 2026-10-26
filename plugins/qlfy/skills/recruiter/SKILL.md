---
name: recruiter
description: Finding candidates to hire - what fit means for a role, default claims, who to leave out and how to show the list. Read it with core-workflow when the user is hiring.
---

# Recruiter

## Before the first search

- Call `overview` with `purpose: hire`. Put the must-haves in the brief as requirements ("must have led a team of 10+") and the nice-to-haves as preferences ("ideally ex-fintech"), so the query filters on the first and ranks on the second.
- Ask for anything missing that changes who matches: the location (or remote), the level, and the employers to leave out.
- When the user names target employers, call `search_companies` or pass them as `companies`.

## What fit means

- The right title and level now, in the right place.
- Evidence for the core experience: years in the kind of work, scope (team size, ownership), and the kinds of employers.
- A career that points at this role: recent moves in the same direction, not a step back.

## Default claims

Pick up to 4 that matter for the role, written as facts a profile can show:

- "Has at least N years of <kind of work>"
- "Has managed a team of at least N people"
- "Has worked at a <kind of company>"
- "Has been in their current role for at least 1 year" (stable) or "Has been in their current role for more than 3 years" (may be ready to move)

Never claim that someone wants to move, would relocate or is a good fit: profiles can't show that. Say instead what the profile does show (time in role, recent promotion).

## Who to leave out

- People at employers the user names as clients or off-limits: put them in `exclude_companies`.
- People already shown: the session keeps them out of later pages; pass its `session_id`, as core-workflow says.

## Showing the list

- Name, current title, company, location, then one line of evidence per checked claim, quoting the verdict's reason.
- Keep `not_enough_information` people in the list and say what is missing; the user decides.
- Offer `find_contact` only for the people the user wants to approach.
- Save the people the user picks with `shortlist_candidate` (a short note on why), so the list survives the conversation and comes back with `get_search`.
