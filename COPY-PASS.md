# Site copy pass: 2026-11-26

Every page's copy was scored, refined and rescored. This file records the method, the scores, what changed and the questions left for Jordan.

## Scope

| Part of the site | Volume | How it was handled |
|---|---|---|
| Core pages (42 templates, 66 built pages) | about 47,000 words | Read in full, scored by hand, edited, checked by the fact gate |
| Perspectives archive (847 articles, 130 news items, 8 press releases) and the 28 original articles | about 1 million words | Every item checked mechanically for AI-writing tells; a sample read; the 34 flagged items fixed |
| Privacy Policy and Terms of Use | about 8,600 words | Not edited and not scored: legal text needs counsel, not a copy edit |

## Rubric (100 points)

Accuracy and proof 20, clarity 20, executive voice 15, reader value and specificity 15, structure 10, concision 10, consistency and mechanics 10. Scores are editorial judgment against this rubric. The mechanical checks are objective: the Kwontified voice-pass linter for AI-writing tells, and its fact gate, which compares each edited page with its previous text and blocks any changed or added fact.

## Scores

| Section | Before | After |
|---|---|---|
| Home | 94 | 96 |
| Capabilities (hub and six pages) | 93 | 96 |
| Channels (hub and ten pages) | 91 | 95 to 96 |
| Work, case studies and creative gallery | 95 | 95 to 96 |
| Why Kwontified | 93 | 96 |
| About and Leadership | 93 to 95 | 96 |
| Leadership profiles | 99 | 99 |
| Careers hub | 94 | 95 |
| Careers role pages (five) | 87 | 96 |
| Perspectives index (interface copy) | 90 | 96 |
| Contact, thank-you pages, sign-in, 404, Accessibility | 94 | 96 |
| Header, footer, cookie banner, newsletter block | 96 | 96 |
| Titles and meta descriptions | 91 | 96 |
| Perspectives archive | 951 of 985 items free of strong tells | 985 of 985; sample read at 95 |

## What changed

- Channel pages: answers under "Problems we solve" that were sentence fragments are now full sentences beginning "We ...". Section introductions that repeated the hero paragraph were replaced (Brand Programs, Target Plus).
- One call-to-action label per page (Capabilities, Channels, Retail Media, Marketplace Operations).
- Perspectives index: the introduction and description said the page held white papers and the newsletter. It holds articles, news and press releases, so the copy now says that, and says the newsletter goes out by email.
- Careers role pages: sentence-case headings like the rest of the site, em dashes replaced, serial commas removed from short lists, and three meta descriptions rewritten (one had been cut off at "lead the Sr.").
- Repeated clauses removed on Retail Media, Creative Studio, Agentic Commerce, Revenue Recovery, Marketplace Operations and Zalando.
- Spelling made consistent: e-commerce, tentpole, A+ Content, Storefront.
- Two meta descriptions shortened to under 160 characters (Retail Media, Agentic Commerce).
- Archive: 66 small edits in 34 older articles, recorded in `site-src/archive/copy-edits.json`. Sentences that only announced the next one ("Here is the counterintuitive part.") were cut, "There is a fair objection:" became "A fair objection is that", and examples labelled "hypothetical" are labelled "illustrative". "ecommerce" and "A+ content" were normalised in article text (never in links or quotations).

No figure, name, date, requirement or claim was changed. Each of the 29 edited pages passed the fact gate; deliberate rewordings are listed with reasons in the gate's accept files (kept with the session notes, not in the repository).

## How the edits are kept

- Page copy lives in `site-src/pages/*.html`, as before.
- Two build scripts quote page text and were updated to match: `scripts/build-site.mjs` and `scripts/site-content.mjs` (thank-you wording, one Instagram Shop sentence).
- `scripts/import-archive.py` now re-applies `copy-edits.json`, keeps image descriptions (alt text) and applies the house spellings whenever the archive is re-imported. An edit whose original sentence has changed in the sheet is listed in `report.txt` instead of being applied.
- The Google Sheets workbooks were not edited. The 34 articles differ from their sheets by the 66 edits above.

## Questions for Jordan

1. **Rufus or Alexa for Shopping.** The home page channel list says "AI shopping assistants: Rufus, ChatGPT, Gemini and Claude". Everywhere else the site says Amazon combined Rufus and Alexa+ into Alexa for Shopping in the US in May 2026. Jordan's profile also says "Amazon Rufus". Left as is, because it is a naming fact.
2. **A value's name.** "We Raise the Bar — Together" is now "We Raise the Bar, Together" (the site uses no em dashes in prose). Say if the dash is part of the official name.
3. **White papers.** Removed from the Perspectives introduction because none are published there yet. They can go back when the first one is.
4. **Creative gallery caption.** "Display creative, haircare" sits on the baby food supplier's Walmart result. One of the two labels is wrong.
5. **omni-channel and omnichannel.** The approved phrase "one agile omni-channel strategy" is hyphenated; the metric "omnichannel ROAS" (seven uses) is not. Left as is.
