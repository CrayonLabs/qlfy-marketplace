---
name: event
description: Finding people to invite to an event or dinner - seniority and topic fit, the city, a mix across companies and no job seekers. Read it with core-workflow when the user is inviting people.
---

# Event invitations

## Before the first search

- Call `overview` with `purpose: invite`. Put the city, the seniority ("VP Product, CPO") and the kind of company ("Series B-D startups", "fintechs") in the brief as requirements.
- Ask for the city if the user didn't give it, and how many seats there are.
- "No job seekers" becomes `is_working = true` in the query; intentions can't be checked.

## What fit means

- Senior in the topic of the event, now: title and level at their current company.
- Based in or near the city.
- At the kind of company the event is for. Funding stage has no filter: the overview's summary says it is checked later; check it with a claim.

## Default claims

- "Currently works at a company that has raised a Series B, C or D round" (when the stage matters)
- "Has been in their current role for at least 1 year"
- "Has spoken at an industry conference or event" (when speakers matter)
- "Has worked on <topic of the event>"

## The list

- A mix across companies: at most 2 people from one company unless the user asks otherwise. Mention when several matches share an employer.
- Name, title, company, then the evidence for each checked claim.
- For a dinner, show about twice as many people as seats, so the user can choose.
- Offer `find_contact` for the people the user picks to invite.
- Save the people the user picks with `shortlist_candidate` (a short note on why), so the list survives the conversation and comes back with `get_search`.
