# Kwontified website: handover for Claude Code

Read this first. It carries over the state of a long chat session with Jordan Taylor (Managing Partner, Kwontified) so the work can continue in this repository.

## Where things stand

- Repository: `shivamsood3/kwontified-1.1`. All changes in this handover were made on top of commit `b57b91ceaddd662586d20faf5f9301c2e9810e22` (branch `v1.2-perspectives-and-new-pages`). Check whether the branch has moved before applying.
- The work is on branch `site-fixes-archive` (pushed 2026-11-26), based on `v1.2-perspectives-and-new-pages` at `b57b91c`. It supersedes the earlier `kwontified-site-fixes.patch` and `kwontified-site-fixes-v2.patch` files.
- Nothing in the patch is live. Pre-launch preview: https://kwontified-11.vercel.app (Vercel team `kwontified`).
- Build: one runner, `scripts/build-all.mjs`. Its `STEPS` list is the only place the order lives: `npm run build:site` runs it, `npm run build` runs it and then `next build`, `npm run dev` runs it and then `next dev`. To add a step, add a line to `STEPS`; never to `package.json`. `node scripts/build-all.mjs --list` prints the order. The runner stops at the first step that fails. A full build takes about three minutes, most of it the image step. Steps, in order:
  1. `build-site.mjs` (the developer's): the HTML exports in `site-src/pages` and `site-src/archive/*.json` into `public/_kq`, assets into `public/assets`, and `site-routes.json`.
  2. `site-fixes.mjs`: case study pages, link fixes, home page case finder and hero video button, article meta tags, whole-card links, narrow-screen grids, font preloads.
  3. `site-content.mjs`: Accessibility page, newsletter confirmation page, omni-channel copy, press release renames.
  4. `site-archive.mjs`: the archive on the Perspectives index, the archive hubs (`/perspectives/news`, `/perspectives/press-releases`, one per year) and the closing band of every piece.
  5. `site-errors.mjs`: the 404 and 403 pages. 6. `site-contact.mjs`: the Contact page and Thank-you page. 7. `site-about.mjs`: About and Why Kwontified. 8. `site-capchan.mjs`: capability and channel pages. 9. `site-channel-content.mjs`: their new copy. 10. `site-filters.mjs`: Work filter, creative gallery, case study labels. 11. `site-home.mjs`: the home page. 12. `site-charts.mjs`: charts, maps and tables.
  13. `site-seo.mjs`: JSON-LD, share images, titles (`SHORT_TITLES`), `site-lastmod.json` for the sitemap, job postings (`JOBS`).
  14. `site-images.mjs`: WebP copies of every photo at the widths its slot needs (400, 800, 1200, 1600 and the original; 2x and 3x for fixed-width slots), `srcset`, `sizes`, `width`/`height`, lazy loading below the first section, and a preload for the page's hero. Needs `sharp` (a dependency in `package.json`); `SKIP_IMAGES=1` skips it for a quick local build that must not be deployed. About 4,500 WebP files; `public/assets` is about 390 MB.
  15. `site-tags.mjs`: Google Tag Manager and the Google Ads tag, loaded only after cookie consent.
  16. `site-logos.mjs`: client and press logos into content-hashed SVG files. 17. `site-perspectives-ux.mjs`: reading time, kicker links, previous / next, Perspectives tabs and filters. 18. `site-perspectives.mjs`: the first page of the index in the HTML, the rest in `perspectives-more-*.json`. 19. `site-nav.mjs`: header menus, phone menu, search. 20. `site-effects.mjs`: the UX details (`kq-fx-*.js`). 21. `site-i18n.mjs`: translated previews (see `TRANSLATION.md`).
  22. `site-capchan.mjs --check`: final checks on case cards, logos, FAQ structured data and internal links.
  23. `site-llms.mjs`: `public/llms.txt` and `public/feed.xml` from the finished pages, and the structured-data, title and description gates.
  24. `site-bundle.mjs` (always last): moves the CSS and JavaScript that every earlier step writes inline into content-hashed files, and writes `site-csp.json`. See "Shared CSS and JavaScript" below.
  Steps 5 to 12, 16, 17, 19, 20 and 24 have their own sections below.
- `public/_kq` is generated and git-ignored. Do not edit files there.

## The archive import (done in the chat session)

- Source: nine workbooks, `Kwontified_Content_Archive_2018.xlsx` to `..._2026.xlsx`, exported from Google Sheets (Kwontified Creative Content folder, owner jordan@kwontified.com).
- `python3 scripts/import-archive.py <folder with the nine xlsx files>` writes `site-src/archive/` (needs `pip install openpyxl`). Its output is already in the patch, so the build works without rerunning it.
- Result: 985 new pages (847 articles, 130 news items, 8 press releases), 2018-01-02 to 2026-11-03, plus the 33 pages the site already had. Site total: 1,083 routes.
- `site-src/archive/report.txt` lists every row skipped or changed. Summary:
  - 37 Blog rows skipped: status "Needs data" (Jordan's instruction).
  - 6 press releases skipped: status "Draft only" (unconfirmed attendance, unapproved quotes, `[CITY]` placeholders).
  - 1 news item skipped: status "Draft for review".
  - 2 Blog rows skipped although marked Final, because the text still contains `[DATA NEEDED]`: A0147 and A0474.
  - 28 addresses repeated an earlier year's address and had the year added.
  - In seven press releases the media contact placeholder `[NAME], [EMAIL]` was replaced with press@kwontified.com.
- Only the Blog, News and Press releases tabs become pages. The Newsletter and Substack tabs do not.
- Articles appear under their stated dates with no "written in 2026" label (Jordan's decision).
- Addresses: `next.config.ts` serves all article, news and press pages through three pattern rewrites instead of one rewrite per page, to stay under Vercel's route limit. This relies on the file naming rule `/perspectives/news/x` -> `/_kq/perspectives--news--x.html`.

## The images (done 2026-11-26)

- All 985 archive items have their own image at `site-src/assets/archive-<ID>.jpg`: JPEG, 1,400 px wide, quality 78, progressive, no metadata, 140 MB in all, committed to the repository. `build-site.mjs` uses each as the article hero and `site-archive.mjs` on the index card; the fallback panel no longer appears anywhere.
- Source: `site-src/archive/images.json` maps each ID to a Google Drive file (originals are 3840 px, in yearly subfolders of **Kwontified Article Images**). News items and press releases reuse 23 shared theme images (files named like `N18-retail-media-networks-4k.jpg`), as the sheets specify.
- How they were fetched: through the Google Drive connector in the Claude session, then resized locally. `scripts/fetch-archive-images.py` does the same job without Claude, given `GDRIVE_API_KEY` (while the folder is link-shared), `GDRIVE_SERVICE_ACCOUNT_JSON` or `GDRIVE_ACCESS_TOKEN`; it skips files already saved, so it is only needed for new or replaced images.
- Alt text: every item now has a one-sentence description of its picture in the `alt` field of `site-src/archive/Post.json`, `PostNews.json` and `PostPressRelease.json`, written by looking at each image. The article hero uses it; index cards keep `alt=""` because the linked title sits right beside them.
- Press releases: the press release template has no hero image, so their 8 images are saved but not shown.
- Review list: `site-src/archive/image-review.txt` lists 122 images flagged while saving, grouped as people (19), brands or logos (27) and other (76, mostly garbled AI lettering). Jordan's rule is photorealistic with no people. Most flags are only visible up close; the ones visible at normal size are A0347 (pedestrians in the street), A0035 (partial figure at the left edge), P0498 and A0591 (tiny figures), A0541 (two photos side by side) and A0836 (white print border). Replacing one is: save the new file under the same name and rebuild. **Jordan reviewed the flagged images on 2026-11-26 and accepted all of them as they are; no replacements are needed.**
- Jordan may want to turn link sharing off again on **Kwontified Creative Content**.

## Checks (rerun after changes)

- Full QA pass on 2026-11-26: see `QA-REPORT.md` for what was checked, what was fixed and what is still open.
- Build, `npx tsc --noEmit` and `npm run lint` all pass.
- `next start`: every route returns 200 (1,094 English routes plus 16 translated previews as of 2026-11-27); redirects land on 200 pages; unknown addresses return the 404 page with status 404; every sitemap URL carries a real last-change date (publication date, the last commit to the page's sources, or for the Perspectives index and archive hubs the newest piece they list; never the build date).
- `npx next build --webpack` works in a git worktree; the default Turbopack build does not (symlinked `node_modules`).
- Cookie banner and tag loading: nine visitor scenarios passed in the chat session (not changed since).

## Newsletter confirmation page (rebuilt 2026-11-27)

- `/subscribe/thank-you` is built in `scripts/site-content.mjs` (section 2) from the Thank-you layout. It confirms the sign-up, says what arrives, how often, from where and how to unsubscribe, shows the three newest articles (`scripts/latest-cards.mjs`; `site-archive.mjs` refreshes them once the archive is listed) and replaces the footer sign-up form with a prompt to request a review. It is noindex, disallowed in robots.txt and not in the sitemap.
- Opt-in: **single by default** (the owner's choice): a sign-up is subscribed at once. `MAILCHIMP_DOUBLE_OPT_IN=true` switches on double opt-in. The team is emailed about each new subscriber at `NEWSLETTER_TO` (default `CONTACT_TO`; `off` stops it, recommended once the list grows). Details in `FORMS-SETUP.md`.
- With double opt-in on: `/api/subscribe` answers `confirm: true` when Mailchimp has sent a confirmation email (double opt-in on, or someone rejoining after unsubscribing). The footer form then opens the page with `?confirm=1`, and the page reads "One step left" instead of "You’re subscribed".
- `app/api/_lib/sinks.ts`: the Mailchimp call no longer sets a status on people who are already in the audience unless the sign-up changes something, so an existing subscriber is never moved back to pending. Nine cases tested against a mocked API.
- The briefing is sent from newsletter@kwontified.com (Jordan, 2026-11-27). The confirmation page names that address and `MAILCHIMP-SETUP.md` sets it as the audience's From address; it must be a mailbox or alias that receives mail. The confirmation page also sends questions about the briefing there, and `/subscribe` (quoted in the newsletter press release) redirects to the sign-up field.

## Decisions and fixes, 2026-11-27 (final QA round)

- Alexa for Shopping (Jordan): current references use it. The sleep-brand case study is "From 6 to 23 of 40 Alexa for Shopping answers" at `/work/from-6-to-23-of-40-alexa-for-shopping-answers`; the old Rufus address redirects (308). Explanations of the rename and dated archive articles keep "Rufus".
- Creative gallery: the shampoo display piece no longer carries the baby food Walmart result (no haircare case study exists); the tumbler video now carries the drinkware TikTok case it shows. The other pieces link to their case studies; links are written as `href="Work.html" data-case="<keyword>"` in `Gallery.html` and resolved by keyword in `site-fixes.mjs`, so a renamed case cannot leave a broken link.
- Value name: "We Raise the Bar Together" (recommended to Jordan; the original export had a dash).
- Search descriptions: 15 case studies get their own (146 to 158 characters, `CASE_DESC` in `site-fixes.mjs`; the build fails on any over 160); the two renamed press releases get full descriptions (`site-content.mjs`); the 404 page has one (`build-site.mjs` and `app/not-found.tsx`).
- Security headers: see "Security headers" below.

## Navigation (added 2026-11-27, `scripts/site-nav.mjs`)

A navigation review scored the site 68 out of 100 on a ten-point rubric (reach, header on laptops, wayfinding, sibling pages, search, phone menu, Back button, keyboard, consistency, recovery); after this step and the error pages it scores 98. Details and evidence in `QA-REPORT.md`.

- One list (`NAV` in the script) feeds the header panels, the phone menu and the previous / next links. Add or rename a page there. The build fails if a listed page is not a route.
- Header: Capabilities, Channels, Work and About each open a panel (hover with a mouse, the arrow button, or the keyboard: Enter, arrow keys, Escape). The label is still a link to the section page. Without JavaScript the panels open on hover and focus.
- The full header shows from 1180px. Between 1180 and 1279px the search label is hidden and the icon remains. Below 1180px the header is the Menu button, as before.
- Phone and tablet menu: sections expand to their pages (the current section starts open), the panel scrolls inside the screen, and it closes on Escape or a tap outside.
- Search: the 1,018 Perspectives titles are in `public/assets/kq-search-*.json` (123 KB, loaded the first time search opens). "/" opens search. A row under the results hands the query to `/perspectives?q=...`, which the Perspectives search now reads.
- Capability and channel pages (16) end with previous / next links, placed before the closing section (`id="review"`).
- Lists with a pager remember their page in `sessionStorage` and return to it on Back when the browser has not kept the page in memory.
- The client sign-in page keeps its own plain header by design and is skipped.

## Error pages (added 2026-11-27, `scripts/site-errors.mjs`)

- 404: every unknown address is answered by `app/[...missing]/route.ts` with status 404 and the built `404.html` as it is (a missing file under `/assets` gets a short plain-text 404 instead). `app/not-found.tsx` is only a fallback for a "not found" Next.js raises itself. Search is the main action; a script offers up to three pages whose address or title is closest to the address asked for (useful for old links into the archive); six starting points; the three newest articles; a "tell us" link that carries the broken address.
- 403: served at `/403` by `app/403/route.ts` with status 403 and noindex. Nothing on the public site refuses a visitor today. Point the client portal or a host rule at `/403` when a request is turned away. `next.config.ts` makes sure the built file ships with the route.
- Images (replaced 2026-11-27): both heroes are original and **AI-generated** (Higgsfield, model GPT Image 2.6, 21:9, 2K, high quality), made to match the site's still-life photography. They are not photographs of a real place or product. Files: `site-src/assets/error-404-e1d78729.jpg` (three stone plinths, the middle one empty) and `site-src/assets/error-403-0ee5006a.jpg` (a closed navy door, a key on a hook beside it). 2000 x 848, about 160 KB each.
  - Workspace: Kwontified Team. Spend: 14 credits (8 drafts at 0.75, 4 finals at 2); the balance went from 14,667.5 to 14,653.5. Approved limit was 22.
  - Style references, imported from the preview site: `5922b4a5b9e8.jpg` (media `3a350c4b-fcbf-4e74-8e00-8a29639a0e64`) and `a6b3196d384b.jpg` (media `bf4db439-fa55-455f-a6f4-36729b3611eb`); each final also used its chosen draft as the composition reference.
  - 404: draft job `a0eb9a74-d26b-4c98-89c0-9cdceb67e197`, final job `49bd2b3d-1125-4702-8a8b-f5c6d0437776`. Prompt: "Editorial still-life photograph. Keep the composition of the first reference image: three pale travertine display plinths of different heights standing in a row in the right third of an ultra-wide 21:9 frame; the left and right plinths each hold one plain kraft cardboard parcel tied with natural string, and the middle plinth is conspicuously empty, a shaft of sunlight falling on its bare top. Wall: dusty steel blue (#8FA3B8) matte painted plaster with fine texture. Hard low afternoon sunlight from the left throws crisp window-frame shadows diagonally across the wall and long shadows of the plinths on a pale polished concrete floor; restrained palette, soft film grain, straight-on eye-level view, 50mm lens, deep depth of field, in the same photographic style as the second reference image. The left half of the frame is an empty stretch of wall and floor with only light and shadow. No people, no text, no lettering, no logos, no labels."
  - 403: draft job `e5cf1b24-04bb-4e3e-9405-44b15f14d52d`, final job `3bb6cf98-6bad-418a-abde-d9516a15ee8e`. Prompt: "Editorial still-life photograph. Keep the composition of the first reference image: at the far right of an ultra-wide 21:9 frame, a closed interior panelled door painted deep navy blue (#102A4C) with a brass lever handle, firmly shut, in a pale stone-blue matte plaster wall (#C9D4DF) with a simple painted door frame; to the left of the door a pale oak bench with one closed plain kraft carton on it. Add one clear detail: on the wall between the bench and the door, at eye level, a small brass hook holding a single brass key on a short tan leather loop. Hard low afternoon sunlight from the left throws crisp window-frame shadows diagonally across the wall; pale polished concrete floor; restrained palette, soft film grain, straight-on eye-level view, 50mm lens, deep depth of field, in the same photographic style as the second reference image. The left half of the frame is an empty stretch of wall and floor with only light and shadow. No people, no text, no numbers, no lettering, no logos."
  - Unused finals: jobs `05fc8fb4-a161-41c2-bb96-941da1b2ff0a` and `089763fb-c82f-4fa7-be98-c5f82644cfd2`. The other six drafts are in the Higgsfield workspace history.
- Lighthouse cannot audit a page that answers 404 or 403; audit `/_kq/404.html` and `/_kq/403.html` instead.

## Home page (rebuilt 2026-11-27, `scripts/site-home.mjs`)

Reviewed at 64/100 and approved by Jordan (82/100 after, on the same measures). Order: hero (video unchanged, by decision), client logos, three results with the Dr. Brandt quote, one team with the six capabilities by house name, ten channels each linked to its page, four pieces read from `/work/creative`, press logos with the Vilebrequin quote, case finder, Perspectives, five questions, closing request. Phone length went from 25.1 to 19.0 screens and the review button now sits on the first phone screen. The step fails if a section is renamed or reshaped, if a gallery piece or its caption changes, if the finder is not byte-identical after the move, if either logo list loses its 15 inline logos, if "agile omni-channel strategy" appears more than three times, or if a body link is not a route. To change the creative pieces edit `PIECES` (image id and width/height ratio); channels are `CHANNELS`; questions are `KEEP` and `CUT`; the categories answer is rewritten to the same broad list as Why Kwontified. Phone rules are in its `<style data-kq-home>`: 2.39:1 hero picture, three-column logo lists, 30px section headings, swipe rows for capabilities and creative. `site-effects.mjs` still needs `#results` to hold exactly three headline figures. Tests: `scratchpad/home-work/t.js <port>`.

## Capabilities and Channels (rebuilt 2026-11-27, `scripts/site-capchan.mjs`)

Approved by Jordan. Helper's scores on the review's rubrics: capabilities 58 to 83, channels 59 to 79. Decisions: no client quotes on these pages (logos only); Temu is a marketplace (its own group, breadcrumb, structured data, menu position after Target Plus, the index chip now reads "Marketplaces"); every channel keeps its own page.

- All 34 case-study cards open their own case study (matched by title; two more became featured cases). `node scripts/site-capchan.mjs --check`, run at the end of the build, fails if a matched card stops opening its case study, if a logo band is empty, if questions and their structured data differ, or if an internal link is not a route.
- The review button sits on the phone's first screen on all 18 pages; 16 hero figures link to their case study.
- The "Where this applies" rows and the capability-by-channel table on `/capabilities` are built from each channel page's capability cards (`#capabilities`): edit those cards, not the script.
- Folded rows on the seven thin channel pages are in `FOLD`; the build stops if a page's feature or problem headings change.
- Amazon and Walmart keep a short section on their AI assistants that links to Agentic Commerce, the single home for Alexa for Shopping and Walmart Sparky.
- The two omni-channel questions that the home page and `/channels` both copied are now answered once, on Why Kwontified.
- A step that wants the client logos leaves `<!--kq-logos:clients-->`; `site-logos.mjs` fills it on any page. `npm run dev` does not run `site-logos`, so logo bands are empty there.
- Left for Jordan: the Retail Media platform list differs between the page body, the "Where this applies" row and the FAQ; the Revenue Recovery wording on when the audit starts.

## Charts (added 2026-11-27, `scripts/site-charts.mjs`)

Jordan asked for the charts and graphs across the site to be improved. An audit scored the 11 chart families at 70/100 on average (phone legibility cost the most: text inside charts rendered at 5 to 9px); after this step about 86.

- Nine data charts (Walmart, Creative Studio, the four Work carousel slides, the shortage-claims case page, the Retail Media and Marketplace Operations share bars) are one component, `figure.kq-chart`: HTML bars from zero on one baseline, real text labels never under 13px at 320, and a visually hidden table with every value for screen readers. Each chart is found by its own `aria-label` and checked against a spec in `CHARTS`/`LINES`: every printed figure and every bar height must match, or the build stops. Never change the step to accept a different figure; if the export's words or figures change, update the spec.
- One motion rule: the export's scroll-linked bar animation is removed; bars grow together, once, through the export's own "exhibits draw" script, and stay still under reduced motion. The rolling figures settle without gaps (each digit column takes its own digit's width).
- Line illustrations on Analytics carry their words in HTML with a legend, a "Today" label and axis labels (the viral-spike baseline reads "0"). The Channels hub and the data-flow diagram get an HTML phone layout below 500px; the Agentic Commerce illustration is HTML at every width.
- Maps (Amazon, International): legend; channel countries at 3:1 or better against land, sea and the selected colour; the United States outlined on International; a button-toggled list of the 56 country notes for keyboard users (a button, not `<details>`, because the FAQ check counts every `<details>`).
- Perspectives: all 286 tables are focusable scroll regions named from the nearest heading; number columns are right-aligned.
- Decisions applied as defaults (Jordan, 2026-11-27): the International "1x to 2x" chart is removed (it repeated the figure above it); the shortage chart reads "H1 2024 / H1 2025" everywhere; Creative Studio's two pairs are indexed to 100 before, with the dollar labels kept; no periods are added where the site states none.
- The client portal's chart script (32 KB) is dropped from every page that has no `.pt` element (none today).

## Capability and channel content (added 2026-11-27, `scripts/site-channel-content.mjs`)

Jordan asked for the content each page needs, with special attention to the seven thin channel pages (Amazon brand programs, Target Plus, Zalando, Mercado Libre, Temu, TikTok Shop, Instagram Shop). Helper's scores on its 100-point rubric: capability pages averaged 69 before and 80 after, channel pages 60 and 80 (thin pages 52 to 61 before, 73 to 86 after).

- Facts blocks on the six thin marketplace pages ("How Zalando works" and so on) and "What Amazon requires" on brand programs. Each fact was confirmed against search results quoting the marketplace's own pages on 2026-11-27 (the marketplace sites cannot be opened from the build environment); sources and dates are listed in the step's header comment. Recheck a fact before editing it, and leave out anything that cannot be confirmed (commission rates, Temu's current terms and TikTok Shop markets outside the US and Europe were left out for that reason).
- "How we work" on the seven thin pages runs from launch to running the account, with a linked result beside the step it proves; each page has at most eight questions and its FAQ structured data follows.
- "How we measure it" on Marketplace Operations, Analytics and Forecasting, and Revenue Recovery.
- Related reading on 15 pages (Agentic Commerce keeps its own block) and "Choosing between channels" on `/channels`: picked at build time from the Perspectives archive by tag and date, newest first, never more than two years older than the newest article; a page with fewer than three matches gets no block. It changes as articles are published (Jordan's default, 2026-11-27).
- Decisions applied as defaults: Zalando is "25 markets" everywhere (Zalando's own figure); nothing is said about Temu's fully managed model for US brands; Instagram says "plan for checkout on your own website" and does not name Stories; the Revenue Recovery "current window" wording is unchanged; the Mercado Libre page no longer implies Mercado Pago and Mercado Envios run in all 18 countries.
- To confirm with Jordan: the "From you" and "We report" lines on Zalando, Mercado Libre, Temu and Instagram Shop, and whether the International map should shade exactly Zalando's 25 markets (it shades 27 countries today).
- The step stops the build if the copy `site-capchan.mjs` writes changes.

## Filters (added 2026-11-27, `scripts/site-filters.mjs`)

Approved by Jordan. Scores on the helper's rubric: Work 70 to 93, gallery 45 to 90, finder 60 to 94.

- Work: the export's filter and pager are skipped for this list (through `data-ready` and `data-pg-ready`) and replaced by one script that filters and pages together, so the count, the pages and the "1–12 of N" line follow the filter (before, matches on page 2 stayed hidden). Several options per facet; the address holds them (`/work#channel=amazon,walmart&industry=food&capability=retail&q=…`); old single values and `social`, `tiktok`, `instagram`, `intl` still work; a link to `/work#…` followed while on `/work` applies it. Temu is its own channel (its two case studies were tagged International; the Temu-and-Amazon case is tagged both, so Amazon shows 10). The capability facet uses the house names. The featured carousel moved below the list, so the filter bar starts under the introduction; on phones the bar stays in view and shrinks to the facet buttons and the result line.
- Case study pages: their category, channel and capability labels link to the filtered list (75 links).
- Gallery (`/work/creative`): chips with counts, a polite result line ("3 of 11 pieces"), `#kind=<chip>` in the address (a bare `#video` works), a sticky single scrolling row on phones. Creative Studio's six services link to their gallery view.
- Case finder: now uses the contact form's label and four bands ("Annual e-commerce revenue": Under $5M, $5M to $15M, $15M to $50M, $50M+; `FINDER` in `site-fixes.mjs`), and every band selects the matching option on the contact form (`FINDER_REV` in `site-contact.mjs`). Vendor Central, Walmart and Target Plus have two case studies each, so two bands share a result there; the band assignments are judgement except for the skincare case, whose sales are stated.
- Tests: `scratchpad/filters-work/test-filters.js <port>` (432 checks).

## About and Why Kwontified (rebuilt 2026-11-27, `scripts/site-about.mjs`)

Reviewed (About 53 / 100, Why Kwontified 48 / 100) and approved by Jordan the same day. Decisions that bound the work: **no company figures** (team size, brands served, sales or spend managed); client names, the 15 client logos and the two client quotes may be used; the client portal is shown as an **illustrative example**; nothing about fees or minimum terms; the current imagery stays.

- About answers "who are these people?": hero, a page menu, Who we are (four facts already public on the site: founded 2016, eight marketplaces, three offices, 1P and 3P; the six capabilities by their own names, linked), Our story (three short paragraphs and three dates), Leadership, the eight values (moved from Why Kwontified), Selected clients (logos), What clients say (the two quotes, on navy), three results, credentials (the two Amazon partner statuses first), press (the six pieces plus the outlet logos, press@ and press releases), Offices (the three city photographs with addresses, phone and email), questions.
- Why Kwontified answers "why hire them over the alternatives?": hero, a page menu, who it suits and a comparison with an in-house team and with several specialist agencies, the four differences (operators, cause before fix, the omni-channel strategy in four short paragraphs, your data) with the two quoted results now linked to their case studies, Selected clients, What clients say (the two quotes on navy, ending in the mid-page review button), the portal picture, Data and AI and the first 50 days (both moved from About), three commitments drawn from the values, and eight questions (the three about the omni-channel strategy are one).
- Not carried over: About's "Our approach" (it repeated Why Kwontified) and Why Kwontified's "Service built for premium brands" (its points are in the portal section, the third commitment and the question "Who works on our account?").
- The comparison table describes the alternatives in general terms ("How the three usually differ") and names no competitor. The portal picture is drawn to match the Overview screen of the **Kwontified Client Portal Mockups** (Jordan's design artifact, https://claude.ai/artifact/4Fau4NpFZQrvPX5Y3auZP9, file `project/ClientPortal.dc.html`): the same sidebar, type sizes, colours, pills and sample skincare brand, with that mockup's own sample figures (Jordan asked for this on 2026-11-27, replacing a first version that showed layout only). It is static HTML and CSS built in `site-about.mjs` (`PT` holds the content, `spark()` draws the four weekly lines). It carries an "Illustrative example" tag and a caption saying it is a sample brand, is one labelled image for assistive technology (`role="img"`), and is marked `data-nosnippet` so the sample figures are not quoted in search results. If the mockups change, update `PT`.
- The logo lists are placed by `scripts/site-logos.mjs`: `site-about.mjs` leaves `<!--kq-logos:clients-->` and `<!--kq-logos:press-->` markers because the logo files do not exist until that later step has written them. The build fails if a marker is left.
- Client names and client quotes are two sections on purpose (Jordan asked for contrast between them): logos on the lightest ground, quotes on navy with a gold rule over each.
- Each page's FAQ structured data is rebuilt from the questions on the page.
- Careers has the eight value names with a link to About; 41 capability, channel and case study pages have "Why brands choose Kwontified" under their review button.
- Section spacing on these two pages is tighter than the export's default, and on phones the still lifes beside each argument are hidden, because both pages carry more sections than before.

## Contact page (rebuilt 2026-11-27, `scripts/site-contact.mjs`, `app/api/contact/route.ts`)

Reviewed and approved by Jordan the same day. Decisions: a personal email address is accepted; the phone number is shown as a secondary route; the copy says "A senior team member reads your request" (never "managing partner", except as a founder's job title); no booking link yet (planned).

- Layout: headline and three assurances on the left, the form in a card on the right, "What happens next" beside it and three linked results under it. On a phone: headline, form, what happens next, results. Below: "Other ways to reach us" (email and phone, existing clients, press, careers, the three offices) and the four questions.
- Fields: first name, last name, work email, company, website and "What do you want to achieve?" are required. Job title, channels, revenue (no default) and "What you need help with" (several allowed, named after the capabilities) are in a closed "Add detail" block. A personal address shows a one-line nudge and is accepted. The website field accepts `brand.com` with or without `https://`.
- **Delivery changed.** The form used to be sent as a fire-and-forget beacon and the Thank-you page opened whatever happened. Now `window.kqContact` (defined on the Contact page, called by the form hook `build-site.mjs` adds to every page) posts to `/api/contact` and opens the Thank-you page only on `{ ok: true }`. The endpoint answers `ok` only if the team email was sent or the Google Sheet row was written; otherwise 502, and the page shows "That did not send", keeps the answers, and offers the same request as a pre-filled email.
- **Go-live check: `RESEND_API_KEY` must be set in Vercel (and the sending domain verified in Resend).** Without it, and with no sheet connected, every visitor now sees the "did not send" message. Before this change the same situation looked like success and the request was lost.
- Spam: a hidden field (`contact_me_by_fax_only`), a two-second minimum on the page, a same-site check on the `Origin` header, and five requests per ten minutes per address (per server instance, so a brake and not a wall). The first two are answered with success and dropped.
- The visitor gets a short receipt by email ("We received your marketplace review request"). It repeats nothing they typed, so the form cannot be used to send a message to someone else. `CONTACT_CONFIRMATION=off` turns it off. The Thank-you page says "We have sent a confirmation to your inbox" only when it was sent.
- Carried in: the home page case finder's links (`/contact#ch=wm&rev=m`) tick the channel, open the optional block and show what was carried; the page the visitor came from is sent as `from`. The finder's three revenue bands do not line up with the form's five, so only "under $5M" selects an option; the others arrive as words in the `finder` field. Aligning the bands is part of the filter plan (not yet approved).
- Without scripts the form posts to `/api/contact` and is redirected to the Thank-you page, or back to `/contact?sent=0#send-failed`.
- Measurement: after a delivered request the Thank-you page pushes `{ event: "generate_lead", form_id: "contact" }` to `dataLayer`, once. Google Tag Manager needs a trigger on that event; tags still load only after cookie consent.
- The words the script shows (the failure message, the nudge, the carried-answers line) are in the page's markup, hidden until needed, so the translation step can reach them.

## Perspectives reading and filters (added 2026-11-27, `scripts/site-perspectives-ux.mjs`)

- Reading time: the 875 articles now say "N-minute read" in the byline (word count / 220, at least 1), as the news items already did; every index card shows it too. Article structured data carries `wordCount` and `timeRequired`.
- Moving between pieces: the kicker on each piece links to the index filtered to that type, topic or channel; the breadcrumb's "News" and "Press releases" are links; a previous / next strip (older / newer of the same type, plus "All articles") sits above the review band.
- Index filters: a row of tabs (All, Articles, News, Press releases, with counts) replaces the Type menu; Month became Year plus Month, and a year can be used on its own; every option shows how many pieces it has; each active filter is a chip that removes it; the address carries the filters (`/perspectives?type=news&topic=...&year=2025`), so a filtered list can be bookmarked, shared and reached with Back.
- How it fits the export: the export's own filter script is untouched and still reads `#ps-ty` and `#ps-m`, which are now hidden fields this step's script (`public/assets/kq-px-*.js`) sets. That script runs a second pass two timer turns after any form event or count change, because the export's pager ignores changes until the turn after its own redraw. The second pass applies the year, counts the featured article as a result, and rewrites the count, chips, tabs and address.
- The site search's "all results" link and the kicker links use the same addresses.

## Translation (added 2026-11-27)

See `TRANSLATION.md` for how it works, the commands and the decisions still open. In short: `scripts/i18n.mjs` extracts a page's text into `site-i18n/<language>/pages/*.json`; `scripts/site-i18n.mjs` builds translated copies at `/<language>/...`; four rewrite patterns in `next.config.ts` serve every language. Spanish, French, Korean and Simplified Chinese are previews (`"live": false`): four pages each, noindex, not in the sitemap, not linked from English pages.

Things a developer should know:

- Translated pages are made from the finished English pages, so every other build step applies to them automatically.
- Scripts and styles that find elements by `aria-label` or by a link's address keep working after translation: each labelled element and internal link also carries the English value (`data-kq-label`, `data-kq-href`), and the translated page's inline code and its copies of the two shared scripts (`*.i18n.js`) look for those.
- Words the shared scripts show are written `T('...')`; a translated page supplies them in `window.kqT`.
- English is the default for every visitor, including in the United States: addresses without a language prefix are English, and nothing reads the browser language or the country or redirects. Do not add an automatic language redirect.
- A language can carry a `tag` in the config for `<html lang>`, `hreflang`, the sitemap and structured data when it differs from the address code (Chinese: code `zh`, tag `zh-Hans`).
- Korean, Chinese and Japanese pages get a `<style data-kq-script>` block: system typefaces after the site's own, no negative letter-spacing, taller heading and article lines, and the language's line-breaking rule.
- Longer words can overflow the header, so translated pages (and English pages once they show the language menu) run a small fit script: tighten the gaps, hide the sign-in link, shrink search to its icon, then fall back to the Menu button.

## UX effects (added 2026-11-27, `scripts/site-effects.mjs`)

Jordan approved ten enhancements after a review of what the site already did. The inner pages' motion came with the export; this step fills gaps with the same timings and easing, and all movement is off under reduced motion.

1. Home page motion. The home page is a separate export and had none of the inner pages' motion. It now has the headline reveal, the hero text rising in, sections rising in on scroll, a count-up on the three results and the page cross-fade. The home page also lacked the timing tokens (`--ease-out`, `--t-ui`) its own FAQ rules refer to, so its FAQ now opens and closes smoothly like the others. The reveal marks are removed from each block once shown, so buttons keep their own hover transitions.
2. Hover feedback on links that had none: FAQ questions, footer social icons and legal links, breadcrumbs, text links with an inline colour, the case finder and gallery filter buttons. The rules match on the export's inline styles; classed links (buttons, cards) keep the export's own transitions.
3. Faster page changes. Speculation rules fetch a same-site page when the pointer rests on its link (Chrome, Edge). It is fetch only, not prerender, so the next page's scripts, video and tags do not run until the visitor goes there. Firefox gets a prefetch link and Safari a plain request from the shared script. `/api/*` and `/subscribe` are excluded.
4. Form feedback. The button reads "Sending…" or "Subscribing…" while the request runs and is restored on failure and on Back. A field with an error is outlined and explains itself below (contact) or under the form (newsletter); the browser's own bubble is suppressed for these two forms only.
5. "Skip to main content" link, first in the tab order; `<main>` now has `id="main" tabindex="-1"`.
6. Back-to-top button on pages longer than three screens, after two screens of scrolling. At 1200px and wider it stays (it sits in the page margin). Narrower, it shows when the visitor scrolls back up or reaches the end, so it never covers text being read. It lifts above the footer's legal row and hides while the phone menu is open.
7. Reading progress line (gold, 3px, bottom edge of the header) on the 1,018 articles, news items and press releases.
8. Phones: "Request a review" stays in the header while scrolling, as it already did on tablets and desktop. The wordmark shortens to the K to make room (the logo link keeps its 44px touch target). At the top of a page the full wordmark shows as before. Fits a 320px screen.
9. Tap highlight in the brand colours (navy tint on light, gold tint on navy) and a press state on the home page buttons.
10. A 280ms fade when a filter, search or pager changes a list (Work, Perspectives, creative gallery, Channels, home case finder). It runs only after a real interaction, not when the Perspectives archive finishes loading.

Not done on purpose: parallax, scroll-jacking, auto-rotating carousels, custom cursors, loading screens, pop-ups.

## Whole-card links (checked and completed 2026-11-27)

- Every article, news item and press release opens from anywhere on its card or row: picture, title, summary and date line. This works through one link per item whose click area covers the item (`data-kq-row` on the item, class `kq-sl` on its link; `scripts/site-fixes.mjs` section 6 and the rows written by `scripts/site-archive.mjs`).
- On 2026-11-27 the rule was widened to cards without a picture (the article lists on the two leadership profiles), hovering a card now underlines its title, and `scripts/site-perspectives.mjs` stops the build if any of the 1,018 index items is not clickable as a whole.
- Tested in a browser at desktop and phone widths: the Perspectives index on its first and later pages, with a type filter and with a search; the home page; profile pages; related blocks on article, news and press release pages.

## The copy pass (done 2026-11-26)

- All site copy was scored, refined and rescored; see `COPY-PASS.md` for the rubric, the before and after scores, what changed and five questions for Jordan.
- Core pages: 29 of 42 templates edited (consistency, fragments made into sentences, repeated clauses, careers page mechanics, meta descriptions). No facts changed; each page passed the voice-pass fact gate.
- Archive: 66 edits in 34 older articles, kept in `site-src/archive/copy-edits.json`; `scripts/import-archive.py` re-applies them on every import, keeps alt text and applies house spellings (e-commerce, A+ Content). The Google Sheets were not edited.
- `scripts/site-content.mjs` and `scripts/build-site.mjs` quote page sentences. If page copy changes again, the build stops with the sentence it could not find; update the quoted text there.
- The published text differs from `site-src/pages` in about 30 sentences that `site-content.mjs` rewrites for the "one agile omni-channel strategy" wording. Read `public/_kq` after a build to see the final text.

## Security headers (`next.config.ts`, `proxy.ts`)

- Every response: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy` (no camera, microphone, location, payment, USB), `Strict-Transport-Security: max-age=63072000` (add `includeSubDomains` only once every subdomain, `clients.kwontified.com` included, is HTTPS).
- Content-Security-Policy: **report-only** until the owner has checked the Google Tag Manager container against it (owner decision, 2026-11-27). The policy sent now is the one that would be enforced: `script-src 'self'`, the sha256 of each script still inline, and the Google hosts for GA4 and Google Ads; no `'unsafe-inline'` for scripts (`style-src` keeps it, for style attributes); `frame-ancestors 'none'`; reports go to `/api/csp-report`, which logs one `[csp-report]` line per violation in the Vercel logs.
- How the hashes stay right: `scripts/site-bundle.mjs` (last build step) moves the site's scripts into `/assets` files and writes the sha256 of every script left inline (four small single-page scripts and the speculation rules today) to `site-csp.json` (generated, git-ignored), which `next.config.ts` reads on every build. A step that adds an inline script needs no manual change. The build fails if a page has an inline event handler (`onclick=`) or a `javascript:` link, which the policy would block.
- **To enforce:** in `next.config.ts` set `const CSP_ENFORCE = true;` (one line). The header becomes `Content-Security-Policy` and `upgrade-insecure-requests` is added. Before that: (1) read two weeks of `[csp-report]` lines with consent granted and refused, (2) in the GTM container, check each tag: GA4 and Google Ads tags load from hosts already listed; a **Custom HTML tag or a Custom JavaScript variable will be blocked** (they need `'unsafe-inline'` / `'unsafe-eval'`, which defeats the policy) and should be replaced with a template tag, or its script moved into the site; a tag that loads from another host needs that host added to `google` in `next.config.ts`; GTM Preview mode needs `https://tagmanager.google.com` and `https://www.gstatic.com` while it is used.
- `app/not-found.tsx` (a fallback only) is rendered by React with Next.js's own inline scripts; under an enforced policy it still shows, without them.
- Pages answer GET and HEAD only: `proxy.ts` answers any other method on a page address with 405 (`Allow: GET, HEAD`). No form posts to a page: the contact form posts to `/api/contact`, the footer form to `/api/subscribe`. `proxy.ts` also sends any address with a capital letter to its lower-case form (308).
- Caching: files under `/assets` whose name carries a 12-hex content hash (`kq-css-…`, `kq-js-…`, `kq-fx-…`, `abc123def456-800.webp`) are `immutable` for a year; every other file there (`archive-A0002-1200.webp`, `leadership-*.jpg`, `*.i18n.js`) revalidates daily.

## Shared CSS and JavaScript (added 2026-11-27, `scripts/site-bundle.mjs`)

- Every earlier step writes its CSS and JavaScript into the pages inline. The last step moves them into content-hashed files: the `<style>` blocks in `<head>` become `<link rel="stylesheet">` to `/assets/kq-css-<hash>.css` (neighbouring blocks that are almost always on the same pages share a file, so an article loads two CSS files), and every inline script that is on more than one page or is 1 KB or more becomes `<script src="/assets/kq-js-<hash>.js">` at the same place, without `defer`, so it runs at the same moment and in the same order. Smaller single-page code stays inline.
- Result (2026-11-27): 64 CSS and 33 JS files; average page 177 KB to 96 KB raw (52 to 31 KB gzipped); at most 2.9 KB of inline CSS and JS left on any page. The second article a visitor opens costs 31 KB gzipped instead of 52. Screenshots of 13 routes at 1440px and iPhone 13 were pixel-identical before and after, axe found no violations, no script errors.
- The step checks each page: same markup once code is taken out, same code in the same order once each file is read back. It stops the build on a difference, on more than 10 KB of inline code left on a page, or if run twice on the same pages (run the whole build).
- Do not edit the files in `public/assets`; change the step that writes the code. Read a page's code in `public/_kq` before this step by running the build without it (`node scripts/<step>.mjs` one by one) or in the step's source.

## Old addresses and redirects

- `site-src/redirects.json`: permanent (308) redirects from the live kwontified.com this site replaces (`paths`, section `patterns`, other `domains`). **OWNER TODO:** add every URL from the live-site export (old sitemap, Search Console, GA4 landing pages, Squarespace URL mappings, backlinks) to `paths`, then check them against a running server: `node scripts/check-redirects.mjs <base-url> <file with one URL per line>` (also within 48 hours of launch).
- `site-src/archive/moved.json`: old to new Perspectives addresses where an article's slug changed (written by the archive import). `next.config.ts` reads both files and the `moved` list in it; the build fails if a destination is not a route, a key is a live page, one key has two destinations, or redirects loop. Chains are followed so every visitor gets one hop.

## Decisions Jordan has made (do not undo)

- Google Tag Manager `GTM-NCKGHDXW` and Google Ads `AW-857530176` load only after cookie consent, through the existing banner. The Ads tag uses the `gtag/js` path, not `gtm.js`.
- Share image: Concept A with the white K mark and wordmark, no tagline (`public/og/default.jpg`).
- Press releases on the site do not name Corey Brown, Priyanka Shah or Dennis Wong. The press kit block is removed for now.
- Public copy says "one agile omni-channel strategy"; budgets move between channels only with client approval.
- Headquarters is written as Atlanta, Georgia (address 7000 Central Parkway, Suite 1100, Atlanta, GA 30328; Atlanta and Sandy Springs are interchangeable for 30328). Changed from Sandy Springs everywhere on the site on 2026-11-26; press datelines read "ATLANTA —". The archive sheets still say Sandy Springs in press datelines; the importer accepts both.
- Contact address is contact@kwontified.com; press is press@kwontified.com; phone 404.873.9148. sales@kwontified.com is not used: every reference in the archive and on the site was changed to contact@ (2026-11-26).

## Open items

- FAQ additions: Jordan is approving the 33 questions in `kwontified-faq-additions.xlsx` five at a time in the Claude session instead of filling in the workbook. Progress and placement are in `FAQ-ADDITIONS.md`. All batches reviewed 2026-11-27: 24 questions live, 9 omitted, the duplicate Zalando entry removed. Jordan's decision (2026-11-27): the FAQs do not state Kwontified's fees, so the two fee entries were removed and fee wording was taken out of two other answers.
- Forms: the Google Sheet webhooks (`FORMS-SETUP.md`) and Mailchimp (`MAILCHIMP-SETUP.md`, step-by-step guide written 2026-11-26) are not set up yet. The Mailchimp code was corrected the same day: tags now go through Mailchimp's tags endpoint (the add-or-update call ignores them), a newsletter sign-up subscribes someone who first used the contact form, and `MAILCHIMP_DOUBLE_OPT_IN=true` is available.
- Leadership photographs: done 2026-11-26. All seven placeholders (About, Leadership, both profile pages, the Perspectives author avatar) now show portraits made from the headshots Jordan supplied; Elaine's was redone from her RSR-Chanlogic headshot on 2026-11-26 at Jordan's request, on the same eye line and face scale. Background removed locally with rembg (BiRefNet portrait model) and set on a light blue-grey studio background; both aligned on the same eye line and face scale. Resolution: EDSR 2x super-resolution (a fidelity model, not generative) for edges, with the original photo's own colour and fine detail restored on top, tuned so skin texture matches the original at display size (no smoothing, no retouching, no added sharpening). Files in `site-src/assets`: `leadership-<name>.jpg` (1440x1800 master), `leadership-<name>-{400,600,800,1080,1440}.webp`, `leadership-<name>-square.jpg` and `-square-{112,168,240,480}.webp`; each <img> has a srcset and a sizes value matching its slot. The masters are also in each Person's JSON-LD.
- Leadership profiles: rebuilt 2026-11-26 (Author.html, AuthorJordan.html; summaries on Leadership and About). Header with remit line, three-paragraph bio and a credential strip; new "What <name> leads" and "Background" (experience, education and training, speaking) sections; topics and press intro re-aligned. Sources: Jordan's direction (remits; KeyBanc AI speaking; Elaine featured in BoF, NYT, WSJ); the 2018 Allison+Partners biography PDFs (education, earlier roles); Elaine's 2025 unBoxed speaker bio (McMaster-Carr, Amazon, Convoy); her 2016 panel bio (University of Pennsylvania); Global Alumni emails (MIT Professional Education Applied Agentic AI, completed by both, 2026); press lists already on the site. LinkedIn was not reachable from the build environment. Person JSON-LD carries alumniOf, hasCredential and knowsAbout. Degrees confirmed by Jordan (2026-11-26): Jordan, BA Cornell University and JD University of Notre Dame; Elaine, BA University of Pennsylvania (also in the Person JSON-LD as degree credentials). Confirmed by Jordan (2026-11-26): Elaine was a panelist at Amazon Ads unBoxed 2025; the New York Times reference and Convoy are omitted (no source link for the former). Gucci, Versace and Salvatore Ferragamo confirmed by Jordan: Elaine advised them as a Vendor Manager in Amazon's watches and jewelry category. Elaine's languages are not listed (Jordan's decision, 2026-11-26). CNBC (Jun 29, 2017) added to Elaine's press: LinkedIn's news-mention alert of that day quotes the article naming and quoting her.
- Perspectives index: done 2026-11-26. First page in the HTML (212 KB instead of 1.2 MB), the rest of the archive on demand (build step 8). Lighthouse mobile 98 on four runs (LCP 2.3-2.5 s, TBT 0-10 ms, CLS 0). Every item stays discoverable through the sitemap, llms.txt and the related-article links on each article. Visitors without JavaScript see the first nine articles and twelve news items only.
- From the QA pass (details in `QA-REPORT.md`): robots.txt change approved and applied 2026-11-26; careers@, legal@, security@ and support@ confirmed to receive mail. Still to do: run geo-optimizer and a live external-link check where the site is reachable.
- Homepage hero: done 2026-11-26. A still frame of the parcel conveyor (frame at 26.2 s of the desktop video: no people, navy wall behind the headline) shows until the video is actually playing, then the video fades in over 0.8 s. Files `site-src/assets/home-hero-still{,-960,-1440,-1920}` (WebP 17-47 KB, JPEG fallback); it is also the video's poster and the page's LCP image. Since the 2026-11-27 QA fixes (`scripts/site-home.mjs`) the `<video>` has no sources or autoplay in the HTML: a script adds them only when the visitor has no reduced-motion preference and Save-Data is off, so reduced-motion visitors download no video at all; with Save-Data the still stays and the button offers Play, which loads the video. Phones up to 760px get `968e153cd060.mp4` (the desktop file cropped to the 2.39:1 phone band, 1152x482, 2.0 MB, ffmpeg CRF 26), tablets keep `53d76f5a7f45.mp4` and desktops `8ae56daa0556.mp4`. The pause button sits on a navy disc (3:1 or better on every frame). If the browser refuses autoplay (iOS Low Power Mode) the still stays and the button offers Play. The two old first-frame background images (`11948d288a83.jpg`, `e57c7576b74e.jpg`) are no longer referenced.
- Leadership profiles: approved by Jordan on 2026-11-27 (after the second polish).
- Owner items from the 2026-11-27 QA (WS3), not decided here:
  - Decided (owner, 2026-11-27): no further gallery images or video will be supplied. The "Main image set, travel luggage" piece stays out of the gallery via `HIDDEN_PIECES` in `scripts/site-filters.mjs` (its picture repeated another piece); its source file is kept.
  - Decided (owner, 2026-11-27): the gallery's three video pieces stay as stills, captioned "Shown here as a still"; the pet-supplements piece uses its case study's own still.
  - Decided (owner, 2026-11-27): no pay ranges or posting dates are published; the roles are filled on a rolling basis in the US and abroad. Pay-transparency laws (e.g. Colorado, California, Washington, New York) can apply to remote roles open to people in those states; confirm with counsel before advertising the roles there.
  - Job pages carry no JobPosting structured data (it needs a posting date). If dates are ever published, set them in `JOBS` in `scripts/site-seo.mjs`; never the build date.
- Owner items open after the QA fixes (2026-11-27), none decided in the code:
  - Content-Security-Policy: review the GTM container, then enforce (see "Security headers").
  - The live-site URL export for `site-src/redirects.json` (see "Old addresses and redirects").
  - Newsletter: single opt-in is the default (`MAILCHIMP_DOUBLE_OPT_IN=true` for double); whether to keep the per-subscriber team email (`NEWSLETTER_TO=off` to stop it).
  - The basis for the summary figures and the case-study detail (records or a labelled version); Mexico "nearly 2x", Mercado Libre +33% period, Temu 99% period; the Zalando map's countries.
  - Wording: "eight channels: six marketplaces and two social commerce channels" (llms.txt fails the build on "eight marketplaces"); the GeekWire wording.
  - Legal: cookie wording and the privacy policy's retention sentence.
- Google Ads conversions: after go-live (Jordan's decision).
- Contact form, before go-live: confirm `RESEND_API_KEY` is set in Vercel and send one real request from the deployed site (the team email, the visitor's receipt and the Thank-you page). The form now reports a failed send instead of hiding it, so a missing key is visible to visitors. A booking link on the Thank-you page is planned for later (Jordan, 2026-11-27).
- Jordan is handling: link sharing on the Google Drive folders, and the 2019 and 2020 archive sheets.
- The six draft press releases and the two `[DATA NEEDED]` articles can be imported once the sheets are completed and marked Final.
