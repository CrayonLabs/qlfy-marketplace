---
name: company-recipes
description: How to start from companies - naming a known company, firmographics, what a company sells, funding and investors, growth and hiring, technology, executive moves, talent flow, workforce, traffic and news, location by distance - and how to get from the companies to their people. Read it when the brief names companies or describes a kind of company.
---

# Company recipes

Read core-workflow and people-recipes first. This skill covers briefs that describe companies: target accounts, "people at Series B fintechs", "ex-Stripe", "companies that just hired a CFO".

## Two routes to people at a kind of company

**One step: `company_*` fields in the people query.** For what the employer record holds: industry, keywords, headcount, growth, founding year, type, B2B, last round date and size, revenue, HQ country or city (people-recipes, recipe 11). No company limit, and the count comes from `overview`.

**Two steps: `search_companies`, then `overview` with `companies`.** For everything else the company search reads (below), or when the user wants to see and edit the account list first.

- `search_companies` returns at most 20 companies per call; `overview` and `search` take up to 200 in `companies`. For more, call `search_companies` again with narrower briefs (one per segment, region or stage) in the same session and pass them together.
- Pass the companies as they come back. A person matches when any of a company's name, domain or LinkedIn URL matches their current job.
- Both routes combine: `companies` plus `company_*` filters.

## What a `search_companies` brief can say

Write the brief in plain words; the search turns it into filters. It reads:

| Topic | Say it like |
| --- | --- |
| What they sell | "card issuing platforms", "HR software for mid-size companies" (their own words, not "fintechs worth talking to") |
| Where | HQ country, city or region ("DACH", "Western Europe"); "within 25 km of Munich"; "outside Munich"; "with an office near Munich" |
| Size and age | "50 to 500 employees", "founded since 2020" |
| Type and model | "privately held", "B2B", "SaaS", "listed" ("public" from IPO or ticker data, not the LinkedIn label) |
| Revenue | "over $100M revenue" (often missing) |
| Funding | "latest round Series A or B", "raised in the last 12 months", "a Series B in the last year of at least $20M", "backed by Sequoia (also Peak XV)", "Sequoia led a round" |
| Growth and attrition | "headcount up 30% in a year", "shrank by 30%", "high attrition last month" |
| Hiring | "hiring data engineers now", "10+ open jobs" |
| Technology | "uses Snowflake and Kubernetes", "uses AWS or GCP", "not using HubSpot", "seen in the last 6 months" |
| Executive moves | "hired a CFO since May", "lost their CTO and hasn't replaced them" (about the last six months only) |
| Talent flow | "hires from Google", "loses people to OpenAI" (by domain; only a company's ten biggest sources count) |
| Competitors | "lists Stripe as a competitor" (companies naming Stripe, not Stripe's own list) |
| Workforce | "engineering is 40% of staff", "at least 20 salespeople", "100+ people in Germany" |
| Traffic and reviews | "100k+ monthly visits, growing", "employee rating 4+" |
| News and posts | "in the news for layoffs since August", "posted about a Series A" |
| Leave out | "excluding getmoss.com and circula.com" |

- A brief without "what they sell" is fine ("German companies of 50-500 people using Snowflake"): the search runs on the filters alone, and each company's reason reads "Matches: the filters".
- Third-party signals (traffic, reviews, salaries, news, technologies, funding) are missing for many companies, the biggest names included. Use them only when the brief asks for them, and tell the user a missing signal isn't a "no".
- Funding data covers few companies. "Not VC-backed" or "bootstrapped" can't be searched: missing data looks the same. Use a claim.
- A radius narrows sharply (an account list fell from 44 companies to 9 within 25 km of Munich). The summary states the centre and radius: check them with the user.

## 1. A company the user names

- Give `overview` the domain or the LinkedIn URL, not only the name: `{"name": "Stripe", "domain": "stripe.com", "linkedin_url": "https://www.linkedin.com/company/stripe"}`. Names collide and name matching is exact.
- In a query, `current_company_domain` `in` ["stripe.com"] is the cleanest "works there now".
- Use the registrable domain ("personio.com", not "www.personio.com"). Ask when a company has several domains or brands.

## 2. Firmographics

- **Size:** a headcount range. "Startup" or "scale-up" is not a size: ask, or use funding stage or founding year. Headcount counts LinkedIn profiles, so it undercounts firms whose staff don't use LinkedIn.
- **Industry:** LinkedIn's 2022 names, exactly: "Software Development", "IT Services and IT Consulting" (also the old "Information Technology & Services"), "Technology, Information and Internet", "Financial Services", "Banking", "Insurance", "Hospitals and Health Care", "Pharmaceutical Manufacturing", "Biotechnology Research", "Higher Education", "E-Learning Providers", "Retail", "Manufacturing", "Real Estate", "Venture Capital and Private Equity Principals". Name an industry only when the brief names a whole industry; otherwise describe what the companies do.
- **Universities:** "Higher Education" plus a headcount floor.
- **Type:** "Public Company" is self-declared on LinkedIn; say "listed" for real public companies.

## 3. "Companies like X"

Describe X's product and customers in the brief rather than naming X, and add "lists X as a competitor" for companies in X's market. Competitor lists aren't symmetric: X's own list isn't searchable.

## 4. From companies to the people who work there

- `overview` with the `companies` and the people part of the brief (titles, function, seniority, place). `companies` means the person works there now.
- Alumni ("has worked at one of these"): put the names in `past_company_name` `in` (20 per list; an `or` group holds several lists).
- More than 200 companies near a place ("engineers at companies around Munich"): skip the list and use `employer_near` in the people query (people-recipes, recipe 9). It takes up to 1,000 of the largest companies in the radius.
- The employer's HQ is not where the person sits. Add `location_country` or a city list when the user means people who are nearby.
- Pick the roles per account as the persona says (gtm: the buyer and two or three people around them).

## 5. Signals through people

Some company signals read better as people:

| The brief asks for | People query |
| --- | --- |
| The new CFOs themselves | `current_title` `in` CFO variants + a current `same` job group with `job_started_since` `>=` six months ago |
| Ex-employees of X now elsewhere | `past_company_name` `in` [X] + `current_company_name` `not_in` [X] |
| People in a country at companies headquartered elsewhere | `location_country` `in` [Germany] + `company_hq_country` `not_in` [Germany] |
| People at growing or recently funded employers | `company_growth_yoy`, `company_last_round_since` |

## 6. A full account list

Example: B2B SaaS companies in Germany, Austria or Switzerland with 50-500 employees, a round in the last 24 months, 10%+ headcount growth, hiring engineers and running Kubernetes, excluding three customers; then engineering leaders there.

1. `search_companies`: "B2B SaaS companies headquartered in Germany, Austria or Switzerland, 50 to 500 employees, raised a round in the last 24 months, headcount up at least 10% in a year, hiring software engineers, using Kubernetes, excluding getmoss.com, circula.com and pliant.io".
2. Show the list and its summary; if it returns 20, offer narrower briefs for more.
3. `overview` with `purpose: target`, the companies, and "Heads of Engineering, VPs of Engineering and CTOs".

Expect small numbers: in the source data this list came to about 44 companies and 116 engineering leaders. Loosen in this order: the technology, then the size band, then the growth floor.
