---
name: gtm
description: Finding buyers at target accounts for sales or partnerships - the ideal customer profile, why now, and 2 to 4 contacts per account. Read it with core-workflow when the user is selling.
---

# Go-to-market

## Before the first search

- Ask what they sell and who buys it (the title and the team), and the ideal customer profile: industry, size, region.
- Start from accounts when the user has them or describes them: `search_companies` with the profile, then `overview` with `purpose: target` and the companies as `companies`.
- Otherwise call `overview` with `purpose: target` and put the buyer's title, the region and the kind of company in the brief as requirements.

## What fit means

- The buyer or the people who influence the purchase: the owner of the problem the product solves, one level above and one below.
- At a company that matches the ideal customer profile.
- A reason to reach out now: recently started in the role, the company is hiring for that team, or a recent funding round.

## Default claims

- "Is responsible for <the problem the product solves>"
- "Has at least N years working in <the buyer's function>"
- "Started their current role within the last 12 months" (a new leader often buys)
- "Currently works at a <kind of company>"

## The list

- Group people by company, 2 to 4 per account: the decision maker first, then the people around them.
- One line on why now when a verdict or card shows it.
- Offer `find_contact` for the accounts the user picks; ask before looking up more than a handful.
- Save the people the user picks with `shortlist_candidate` (a short note on why), so the list survives the conversation and comes back with `get_search`.
