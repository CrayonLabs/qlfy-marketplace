---
name: people-recipes
description: How to write each kind of requirement as a people query - titles, employers, kind of company, location, experience, education, skills, languages, founders, recent moves, free text and small local businesses - with the groups that tie facts to one job or one entry, and what to leave to claims. Read it before editing a query, and when the overview's query misses part of the brief.
---

# People query recipes

One recipe per kind of requirement: which fields to use, how they match, where they fail silently, and what to turn into a claim instead. Read core-workflow first; this skill is about the `query` itself.

## The query

The query is the JSON from `overview`:

- `filters`: a tree of groups, at most 20 items per group and 4 levels deep. Each condition is `{"field", "type", "value"}`; lists hold at most 20 values.
- `boosts`: up to 8 conditions that rank people higher without excluding anyone.
- `companies` / `exclude_companies`: current employers to keep or rule out (up to 200 each).
- `employer_near`: `{"lat", "lon", "km"}`, people whose current employer is headquartered within that radius (recipe 9).

Groups:

| Group | Meaning |
| --- | --- |
| `{"op": "and", "conditions": [...]}` | All must match |
| `{"op": "or", "conditions": [...]}` | At least one must match; add `"min_match": 3` for "at least 3 of these" |
| `{"op": "not", "conditions": [<one item>]}` | Rules out everyone the item matches |
| `{"op": "same", "of": "job", "when": "current" \| "past" \| "any", "conditions": [...]}` | All conditions describe one job; `when` defaults to `any` |
| `{"op": "same", "of": "education" \| "language" \| "certification" \| "function_tenure" \| "level_tenure", "conditions": [...]}` | All conditions describe one entry of that section |

A `same` group holds conditions only, and only the fields of its kind:

| Kind | Fields |
| --- | --- |
| `job` | `past_title`, `past_company_name`, `past_seniority`, `role_description`, `job_started_since`, every `company_*` field |
| `education` | `school`, `degree`, `school_country` |
| `language` | `language`, `language_level` |
| `certification` | `certification`, `certification_issuer` |
| `function_tenure` | `tenure_function`, `tenure_function_years` |
| `level_tenure` | `tenure_level`, `tenure_level_years` |

Without a `same` group, each condition is checked on its own: `past_title` "Associate" and `past_company_name` "Linklaters" can be met by two different jobs.

## How the fields match

A wrong value doesn't fail: it returns nobody, or almost nobody.

**Phrase fields.** `current_title`, `past_title`, `past_company_name`, `school`, `degree`, `language`, `language_level`, `certification`, `certification_issuer`, `skills`, `headline`, `summary`, `role_description`, `current_role_description`, `company_keywords`, `company_hq_city`, `location_city`, `location_text`, and `contains` on any field.

- Case doesn't matter, and the phrase may sit inside a longer text: "Product Manager" also matches "Senior Product Manager"; "Associate" also matches "Associate Director"; "Meta" also matches "Metabase".
- No stemming and no synonyms: "salon" doesn't match "salons", "data centre" doesn't match "data center", "AWS" doesn't match "Amazon Web Services". List every form you want.

**Exact-value fields.** `in`, `not_in`, `=` and `!=` on `current_company_name`, `company_industry`, `company_type`, `current_function`, `current_seniority`, `past_seniority`, `tenure_function`, `tenure_level`, `location_country`, `location_state`, `company_hq_country` and `school_country` need the stored value exactly, capitals included: "Talabat" is not "talabat", "Germany" is not "germany", "Bavaria" is not "Bayern". `school_country` takes upper-case codes ("GB"). `current_company_domain` is the bare lower-case domain ("celonis.com").

**Current job or any job.** `current_*` and `company_*` fields describe the current job; the `company_*` fields and `current_company_name`, when required together in one `and` group, hold for the same job. `current_title`, `current_function`, `current_seniority` and `current_company_domain` describe the main current job only. `past_*`, `role_description` and `job_started_since` mean any job, the current one included, unless a `same` job group pins them.

**Missing data.**

- About a quarter of current employers have no company record (no industry, headcount, founding year), and most small local businesses don't. A required `company_*` condition drops everyone who works at one. To exclude big employers, wrap `company_employees >= 1000` in `not` rather than requiring a small size: `not` keeps people whose employer has no headcount.
- Certifications, languages, summaries and role descriptions are often empty. A missing entry is not evidence the person lacks it. Filter only on scarce, decisive facts; put the rest in `boosts`.

## 1. Someone doing this job, at this kind of employer, in this place

Example: associate lawyers in Singapore at law firms, not partners, counsel or trainees.

```json
{"version": "0.1",
 "filters": {"op": "and", "conditions": [
   {"field": "current_title", "type": "in", "value": ["Associate", "Senior Associate", "Solicitor", "Lawyer"]},
   {"field": "company_industry", "type": "in", "value": ["Law Practice"]},
   {"field": "location_country", "type": "in", "value": ["Singapore"]},
   {"field": "is_working", "type": "=", "value": true},
   {"field": "years_experience", "type": "between", "value": [3, 8]},
   {"field": "current_title", "type": "not_contains", "value": "Partner"},
   {"field": "current_title", "type": "not_contains", "value": "Counsel"},
   {"field": "current_title", "type": "not_contains", "value": "Trainee"},
   {"field": "current_title", "type": "not_contains", "value": "Paralegal"}]},
 "boosts": []}
```

- "Law Practice" and "Legal Services" are separate industries; add "Legal Services" for in-house teams.
- A short title phrase catches longer titles. Add `not_contains` for the ones you don't want rather than making the positive phrase precise.
- `years_experience` counts the whole career. For years in the profession, see recipe 4.

## 2. Worked at, or held a title at, a named employer

- "Ex-Google": `past_company_name` `in` the names (it includes the current job).
- "At Google now": `current_company_domain` `in` ["google.com"], or `current_company_name` `in` the exact names.
- Alumni ("worked at X, not now"): `past_company_name` `in` [X] plus `current_company_name` `not_in` [X].
- "Was an Associate at a top-tier firm": a `same` job group, so title and firm describe one job.

```json
{"op": "same", "of": "job", "when": "any", "conditions": [
  {"field": "past_title", "type": "contains", "value": "Associate"},
  {"field": "past_company_name", "type": "in", "value": ["Linklaters", "Clifford Chance", "Freshfields", "Allen & Gledhill", "Rajah & Tann"]}]}
```

- `past_company_name` is a phrase match: "Google" also matches "Google Developer Groups" chapters. Use the full company name and check a few cards.

## 3. Exclusions

| To leave out | Write |
| --- | --- |
| A title | `current_title` `not_contains` "Head of Operations" (one condition per phrase) |
| Seniority levels | `not` around `current_seniority` `in` ["Director", "C-Level", "Owner"] |
| A department | `current_function` `not_in` ["Sales"] |
| Industries of the current employer | `not` around `company_industry` `in` ["Staffing and Recruiting", "Restaurants"] |
| Big employers | `not` around `company_employees` `>=` 1000 |
| A named current employer | `current_company_domain` `not_in`, `current_company_name` `not_in`, or `exclude_companies` |
| A country | `location_country` `not_in`, or `company_hq_country` `not_in` for the employer |
| A live role anywhere (side companies included) | `not` around a `same` job group `when: current` |

```json
{"op": "not", "conditions": [
  {"field": "company_industry", "type": "in", "value": ["Staffing and Recruiting", "Restaurants", "Food and Beverage Services"]}]}
```

- A `not` around a current-employer condition reads "no current job matches", so someone who waited tables ten years ago stays in.
- Level and industry exclusions do the real work; title exclusions barely move the count.
- Some exclusions only exist in prose ("not pure retail area management"). Don't force them into the query; tell the user or write a claim.

## 4. Years of experience: total, or in one function or level

- Total career: `years_experience` `between` [3, 10] gives floor and ceiling in one condition.
- Years in one function ("3+ years in finance"): a `function_tenure` group. It sums months in that department across all jobs.

```json
{"op": "same", "of": "function_tenure", "conditions": [
  {"field": "tenure_function", "type": "=", "value": "Finance & Accounting"},
  {"field": "tenure_function_years", "type": ">=", "value": 3}]}
```

- Years at a level ("3+ years at Director level"): a `level_tenure` group with `tenure_level` and `tenure_level_years`.
- Departments use the `current_function` names ("Finance & Accounting", "Engineering and Technical"); levels use the `current_seniority` names.
- Years in a narrow kind of work ("8 years in poultry operations", "5 years in card issuing") still has no field: use the nearest function as a filter and a claim for the real requirement.

## 5. Degrees and schools

- `degree` `in` every common form: ["MBA", "M.B.A.", "Master of Business Administration", "Executive MBA"].
- A degree from a country or school: an `education` group, so both describe one degree.

```json
{"op": "same", "of": "education", "conditions": [
  {"field": "degree", "type": "in", "value": ["LLB", "Bachelor of Laws"]},
  {"field": "school_country", "type": "in", "value": ["GB", "IE"]}]}
```

- "A top university": `school_rank` `>=` 90 (0 to 100). Raise or lower it to size the pool, and say the cut-off to the user.
- A bachelor's requirement has too many forms (BA, BS, BSc, B.Tech, Bachelor of Engineering): leave it to a claim. Bar admission and honours are claims too.

## 6. Certifications

- `certification` `contains` one phrase; a credential and its awarding body together go in a `certification` group:

```json
{"op": "or", "conditions": [
  {"op": "same", "of": "certification", "conditions": [
    {"field": "certification", "type": "contains", "value": "Chartered Engineer"},
    {"field": "certification_issuer", "type": "contains", "value": "IMechE"}]},
  {"field": "certification", "type": "contains", "value": "NEBOSH"},
  {"field": "skills", "type": "contains", "value": "NEBOSH"}]}
```

- People record the same credential as a certification, a skill or in their summary: an `or` across them catches more.
- Certifications are among the least filled sections. A nice-to-have credential goes in `boosts`.

## 7. Languages

- "Speaks Swedish and fluent English": `language` `=` "Swedish", plus a `language` group for English at a fluent level.

```json
{"op": "same", "of": "language", "conditions": [
  {"field": "language", "type": "=", "value": "English"},
  {"field": "language_level", "type": "in", "value": ["Native or bilingual", "Full professional", "Professional working"]}]}
```

- Levels: "Native or bilingual", "Full professional", "Professional working", "Limited working", "Elementary".
- The language section is sparse: requiring English drops most people who obviously speak it. Require the scarce local language and put English in `boosts`.
- Languages are written several ways ("Arabic", "Arabic (Modern Standard)", "العربية"): use `in` with the forms that matter.

## 8. Skills and stack

- One required `skills` condition per must-have (spellings in `in`), and the broad stack as an `or` group with `min_match`:

```json
{"op": "and", "conditions": [
  {"field": "skills", "type": "in", "value": ["Java", "Kotlin"]},
  {"op": "or", "min_match": 3, "conditions": [
    {"field": "skills", "type": "contains", "value": "Spring Boot"},
    {"field": "skills", "type": "contains", "value": "Microservices"},
    {"field": "skills", "type": "in", "value": ["Amazon Web Services", "AWS"]},
    {"field": "skills", "type": "contains", "value": "Kafka"},
    {"field": "skills", "type": "contains", "value": "Kubernetes"}]}]}
```

- Lower `min_match` first when the pool is too small; stack requirements are the most brittle part of an engineering search.
- Skills stay on a profile for years. "Still hands-on" is closer to `current_role_description` `contains` the stack words (they write about it in the current role) than to `skills`; confirm with a claim.

## 9. Location: cities, states, regions, a radius

- Country: `location_country` with English names ("United Arab Emirates").
- State: `location_state` `in` exact English names ("Virginia", "Maryland", "District of Columbia"; "Bavaria").
- Cities: `location_city` `in` English names with accents kept ("Munich", "Unterföhring"). Pair them with `location_text` for metro labels:

```json
{"op": "or", "conditions": [
  {"field": "location_city", "type": "in", "value": ["Munich", "Unterföhring", "Ismaning", "Unterschleißheim", "Freising", "Dachau"]},
  {"field": "location_text", "type": "contains", "value": "Greater Munich"}]}
```

- A radius around where people live: list the towns inside it, largest first, in `location_city` lists (20 per list) inside an `or` group. Leave out a big city on the edge unless the user wants it: London on the edge of a 50-mile Cambridge ring has five times more CFOs than the ring itself.
- A radius around where they work: `employer_near` `{"lat": 48.137, "lon": 11.576, "km": 25}`. It keeps people whose current employer is headquartered inside, wherever they live: a third of engineers at Munich-area companies lived outside Germany. Add a person location filter when the user means people nearby. It misses the local office of a company headquartered elsewhere.
- Commuting intent and willingness to relocate aren't in the data.

## 10. Named employer sets

- "Has worked at Careem, talabat, noon...": `past_company_name` `in` the list.
- "Currently at" or "not currently at": domains first (`current_company_domain` `in` / `not_in`), then `companies` / `exclude_companies` with domains or LinkedIn URLs, then exact names.
- "Companies such as X, Y and Z" usually means the kind of company: describe it with the `company_*` fields (recipe 11) or find peers with `search_companies` (company-recipes), and use the names to make sure the obvious ones are in.

## 11. The kind of company, now or in the past

| Need | Field |
| --- | --- |
| Industry | `company_industry` `in` exact LinkedIn names, or `contains` a word |
| What it does, in its own words | `company_keywords` `contains` ("SaaS", "salon") |
| Size | `company_employees` `between` [30, 500] |
| Growing | `company_growth_yoy` `>=` 20 (percent), with a size floor |
| Funded recently | `company_last_round_since` `>=` "2024-10"; round size `company_last_round_raised_usd` |
| Revenue | `company_revenue_usd` `>=` 100000000 (often missing) |
| Age | `company_founded_year` `>=` 2020 |
| Sells to businesses | `company_is_b2b` `=` true |
| Legal form | `company_type` `in` "Privately Held", "Public Company", "Self-Employed", "Self-Owned", "Partnership", "Nonprofit", "Educational", "Government Agency" |
| HQ | `company_hq_country` `in` English names; `company_hq_city` `in` city names |

- These fields describe the current employer. "Comes from B2B SaaS" (any past job) is a `same` job group with the same fields, `when: any` (or `past` for "used to be at"):

```json
{"op": "same", "of": "job", "when": "any", "conditions": [
  {"field": "company_is_b2b", "type": "=", "value": true},
  {"field": "company_industry", "type": "in", "value": ["Software Development"]},
  {"field": "company_employees", "type": "between", "value": [30, 500]}]}
```

- Industry names follow LinkedIn's 2022 list: "Computer Software" and "Hospital & Health Care" match nothing. IT services sit under both "IT Services and IT Consulting" and the old "Information Technology & Services".
- "Public Company" is self-declared. Company attributes are today's values, not those at the time of the job; founding year and funding dates hold up better than size.
- Funding stage ("Series B") and investors aren't people fields: use `search_companies` (company-recipes) and pass the companies, or a claim.

## 12. Founders: before, now and exits

- Founded before, not founding now (side companies included):

```json
{"op": "and", "conditions": [
  {"op": "same", "of": "job", "when": "past", "conditions": [
    {"field": "past_title", "type": "contains", "value": "Founder"}]},
  {"op": "not", "conditions": [
    {"op": "same", "of": "job", "when": "current", "conditions": [
      {"field": "past_title", "type": "contains", "value": "Founder"}]}]}]}
```

- People often leave a dormant company on their profile as current, so the `not` over-excludes a little. Say so when the pool looks small.
- "Founder" also matches "Founding Engineer" and "Founder's Associate"; add `current_title` `not_contains` for those when it matters.
- Founding something new: a `same` job group `when: current` with `past_title` "Founder" and `job_started_since` (recipe 13).
- `exited_company` `=` true: an exit recorded; thin coverage. How a company ended is a claim.

## 13. Recent moves and stealth founders

- Started any job recently: `started_new_job_since` `>=` "2026-05". Left one: `left_job_since` `>=` "2026-05". Both cover only the last several months.
- Left a job this year and founded something this year:

```json
{"op": "and", "conditions": [
  {"field": "left_job_since", "type": ">=", "value": "2026-01"},
  {"op": "same", "of": "job", "when": "current", "conditions": [
    {"field": "past_title", "type": "contains", "value": "Founder"},
    {"field": "job_started_since", "type": ">=", "value": "2026-01"}]}]}
```

- Stealth: a current `same` job group with `past_company_name` `in` ["Stealth", "Stealth Startup", "Stealth Mode"] and `job_started_since`. Stealth pages are a naming habit, so expect misses.
- "Two or more employer changes in three years" is a claim. Dates are month-level at best.

## 14. Management scope and progression

- Level now: `current_seniority` `in` exact values ("Manager", "Head", "Director", "President/Vice President", "C-Level", "Owner", "Partner", "Senior", "Specialist", "Intern"; the index also holds "Founder").
- A level held before: `past_seniority`; in a `same` job group, the level of that job.
- Management history: `months_in_management` `>=` 60; time at a level: a `level_tenure` group (recipe 4).
- A hands-on manager, not a manager of managers: `current_seniority` `=` "Manager".
- Progression: `recently_promoted` `=` true; time in the current role: `months_in_current_role` `between` [12, 36].
- `is_decision_maker` separates leaders from individual contributors, not senior from middle management: a floor or a boost.
- Team size and direct reports have no field: claims ("Has managed a team of at least 20 engineers").

## 15. Evidence that only lives in prose

Deal types, duties, process stages and achievements live in sentences.

- `current_role_description`, `role_description` (any job), `headline` and `summary` `contains` a phrase. Combine them in an `or` group and spell every variant ("data centre" / "data center").
- Prose tied to a kind of employer ("described project finance work while at a law firm"): a `same` job group with `role_description` and `company_industry`.
- Keep prose in `boosts` unless it is the point of the search: terse profiles fail every text condition. Prose alone can be rare: "data centre or fibre" with "project finance" matched about 800 people worldwide, so drop other filters when prose is required.

## 16. Title variants: no synonym expansion runs

Write the variants yourself, up to 20 per `in` (an `or` group holds more): spelling and word order ("Solutions Architect", "Solution Architect"), abbreviations ("VP Engineering", "Vice President of Engineering", "CFO", "Chief Financial Officer"), translations when the location suggests them ("Lösungsarchitekt"), and adjacent roles the brief includes ("Solutions Engineer", "Sales Engineer", "Presales"). Seniority prefixes are not needed: "Solutions Architect" already matches "Senior Solutions Architect".

## 17. Small local businesses (salons, tailors, gyms, dental labs)

Industry codes don't identify them: only 0.3% of UAE salon employers sit under "Personal Care Services", and most have no company record at all. Match the employer's name, or its own keywords with a quorum, and rule out big employers and adjacent industries:

```json
{"op": "and", "conditions": [
  {"field": "location_country", "type": "in", "value": ["United Arab Emirates"]},
  {"field": "current_title", "type": "in", "value": ["Operations Manager", "Operations Supervisor", "Head of Operations"]},
  {"op": "or", "conditions": [
    {"op": "or", "conditions": [
      {"field": "current_company_name", "type": "contains", "value": "salon"},
      {"field": "current_company_name", "type": "contains", "value": "salons"},
      {"field": "current_company_name", "type": "contains", "value": "barbershop"},
      {"field": "current_company_name", "type": "contains", "value": "beauty lounge"},
      {"field": "current_company_name", "type": "contains", "value": "nail bar"}]},
    {"op": "or", "min_match": 3, "conditions": [
      {"field": "company_keywords", "type": "contains", "value": "salon"},
      {"field": "company_keywords", "type": "contains", "value": "manicure"},
      {"field": "company_keywords", "type": "contains", "value": "hairdressing"},
      {"field": "company_keywords", "type": "contains", "value": "waxing"},
      {"field": "company_keywords", "type": "contains", "value": "lashes"},
      {"field": "company_keywords", "type": "contains", "value": "grooming"}]}]},
  {"op": "not", "conditions": [{"field": "company_employees", "type": ">=", "value": 1000}]},
  {"op": "not", "conditions": [
    {"field": "company_industry", "type": "in", "value": ["Personal Care Product Manufacturing", "Pharmaceutical Manufacturing", "Retail Pharmacies"]}]}]}
```

- Avoid single common words ("beauty", "spa", "boutique", "bespoke"): they match supermarkets and hotels by the thousand. Keep near-duplicate spellings out of the quorum list, or one company clears it alone.
- The name leg carries most small shops (many have a name and nothing else); the keyword leg finds those with a company page.
- Put the country on the person, not the employer. Businesses the words don't separate (a gym, a med-spa and a salon) still pass: the last cut is the user's.

## 18. A full query

Example: Head of Engineering in Germany; Head, VP or CTO level; comes from B2B software companies of 30-500 people; Java/Kotlin stack; not currently at SAP, Microsoft or Celonis.

```json
{"version": "0.1",
 "filters": {"op": "and", "conditions": [
   {"field": "current_title", "type": "in", "value": ["Head of Engineering", "VP Engineering", "Vice President of Engineering", "Director of Engineering", "Chief Technology Officer", "CTO"]},
   {"field": "location_country", "type": "in", "value": ["Germany"]},
   {"field": "months_in_management", "type": ">=", "value": 36},
   {"op": "same", "of": "job", "when": "any", "conditions": [
     {"field": "company_is_b2b", "type": "=", "value": true},
     {"field": "company_industry", "type": "in", "value": ["Software Development"]},
     {"field": "company_employees", "type": "between", "value": [30, 500]}]},
   {"op": "or", "min_match": 3, "conditions": [
     {"field": "skills", "type": "contains", "value": "Java"},
     {"field": "skills", "type": "contains", "value": "Kotlin"},
     {"field": "skills", "type": "contains", "value": "Spring Boot"},
     {"field": "skills", "type": "contains", "value": "Microservices"},
     {"field": "skills", "type": "in", "value": ["Amazon Web Services", "AWS"]}]},
   {"field": "current_company_domain", "type": "not_in", "value": ["sap.com", "microsoft.com", "celonis.com"]}]},
 "boosts": [{"field": "location_city", "type": "in", "value": ["Munich"]}]}
```

Claims: "Has led an engineering organisation of at least 20 people".

- Whether the kind of company means now (`company_*` filters) or ever (a `same` job group) is often the difference between the right pool and the wrong one.
- A tight pool is normal for briefs like this: about 40 people in all of Germany. Loosen in this order: lower `min_match`; widen the size band; add title variants; widen the place.

## Getting the pool right

- `overview` is free and gives a count; `search` pages are paid. To compare versions, call `overview` again with the brief changed in words and read the count, before running `search` on an edited query.
- Change one condition at a time. A count that collapses after an edit usually means a wrong exact value, not that nobody exists.
- The first page shows the best-ranked people, who look better than the pool as a whole. Read it for misfits that reveal a loose condition (a noisy title phrase, a namesake town, a common word) and fix the condition.

## Not in the data

Work authorisation, salary or salary expectations, notice period, willingness to relocate or travel, open to work, nationality, gender, age and soft qualities (leadership presence, culture fit) have no field and can't be claimed. Say so plainly and offer what the profile does show (location, time in role, recent moves).
