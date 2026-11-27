# Kwontified website: handover for Claude Code

Read this first. It carries over the state of a long chat session with Jordan Taylor (Managing Partner, Kwontified) so the work can continue in this repository.

## Where things stand

- Repository: `shivamsood3/kwontified-1.1`. All changes in this handover were made on top of commit `b57b91ceaddd662586d20faf5f9301c2e9810e22` (branch `v1.2-perspectives-and-new-pages`). Check whether the branch has moved before applying.
- The work is on branch `site-fixes-archive` (pushed 2026-11-26), based on `v1.2-perspectives-and-new-pages` at `b57b91c`. It supersedes the earlier `kwontified-site-fixes.patch` and `kwontified-site-fixes-v2.patch` files.
- Nothing in the patch is live. Pre-launch preview: https://kwontified-11.vercel.app (Vercel team `kwontified`).
- Build: `npm run build:site` runs these steps in order (`npm run build` adds `next build` at the end):
  1. `scripts/build-site.mjs` (the developer's): turns the HTML exports in `site-src/pages` into `public/_kq` and writes `site-routes.json`. Now also merges `site-src/archive/*.json`.
  2. `scripts/site-fixes.mjs`: case study pages, link fixes, homepage finder and video button, article meta tags; since the QA pass also narrow-screen grid columns, font preloads and the home page `<main>`.
  3. `scripts/site-content.mjs`: Accessibility page, newsletter confirmation page, omni-channel copy, press release renames.
  4. `scripts/site-archive.mjs`: lists the imported archive on the Perspectives index.
  5. `scripts/site-errors.mjs` (added 2026-11-27): builds the 404 and 403 pages from the 404 shell `build-site.mjs` makes. See "Error pages" below.
  6. `scripts/site-seo.mjs`: JSON-LD on every page, article share images, title length, `site-lastmod.json` for the sitemap.
  7. `scripts/site-images.mjs`: 800 px WebP copies and `srcset` for phones (needs `sharp`, which Next.js installs; skips itself if missing).
  8. `scripts/site-tags.mjs`: Google Tag Manager and Google Ads tag, loaded only after cookie consent.
  9. `scripts/site-logos.mjs` (added 2026-11-27): moves the 30 home page client and press logos out of the HTML into content-hashed SVG files with the list colour written in (the page went from 545 KB to 165 KB). Fails the build if a list, its logo count or its colour changes.
  10. `scripts/site-perspectives-ux.mjs` (added 2026-11-27): reading time, linked type / topic / channel, previous / next between pieces, and the Perspectives index's tabs, year and month filters, filter chips and shareable addresses. Runs before the next step so the cards it moves already carry the reading time. See "Perspectives reading and filters" below.
  11. `scripts/site-perspectives.mjs`: keeps the first page of Articles (9) and News (12) in the Perspectives index HTML and moves the rest to a content-hashed `public/assets/perspectives-more-*.json`, which the page loads when the lists come near the screen, on first use of search, filters or pager, or four seconds after load. It also lets the site script re-read the lists, so paging, filters and search cover the whole archive. If the developer's site script changes, this step stops the build with a clear message rather than leaving the page broken.
  12. `scripts/site-nav.mjs` (added 2026-11-27): header menus, the full header from 1180px, the phone menu's sections, search over the archive, previous / next links. See "Navigation" below.
  13. `scripts/site-effects.mjs` (added 2026-11-27): the interaction details from the UX review, added to every page as one small style block, one shared script (`public/assets/kq-fx-*.js`, deferred, content-hashed) and a speculation-rules block. See "UX effects" below. Fails the build if a page lacks its wrapper or `<main>`, if the home page hero or its three results change shape, or if the articles lose `data-art="body"`.
  14. `scripts/site-i18n.mjs` (added 2026-11-27): translated copies of the pages that have a translation file. See `TRANSLATION.md`.
  15. `next build`.
  The full build takes about a minute; most of it is the site-images step making the WebP copies.
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
- `next start`: all 1,083 routes return 200; the 21 redirects land on 200 pages; unknown addresses return the 404 page; the sitemap lists 1,080 URLs (1,018 with a real publication date).
- Cookie banner and tag loading: nine visitor scenarios passed in the chat session (not changed since).

## Newsletter confirmation page (rebuilt 2026-11-27)

- `/subscribe/thank-you` is built in `scripts/site-content.mjs` (section 2) from the Thank-you layout. It confirms the sign-up, says what arrives, how often, from where and how to unsubscribe, shows the three newest articles (`scripts/latest-cards.mjs`; `site-archive.mjs` refreshes them once the archive is listed) and replaces the footer sign-up form with a prompt to request a review. It is noindex, disallowed in robots.txt and not in the sitemap.
- Double opt-in: `/api/subscribe` answers `confirm: true` when Mailchimp has sent a confirmation email (double opt-in on, or someone rejoining after unsubscribing). The footer form then opens the page with `?confirm=1`, and the page reads "One step left" instead of "You’re subscribed".
- `app/api/_lib/sinks.ts`: the Mailchimp call no longer sets a status on people who are already in the audience unless the sign-up changes something, so an existing subscriber is never moved back to pending. Nine cases tested against a mocked API.
- The briefing is sent from newsletter@kwontified.com (Jordan, 2026-11-27). The confirmation page names that address and `MAILCHIMP-SETUP.md` sets it as the audience's From address; it must be a mailbox or alias that receives mail. The confirmation page also sends questions about the briefing there, and `/subscribe` (quoted in the newsletter press release) redirects to the sign-up field.

## Decisions and fixes, 2026-11-27 (final QA round)

- Alexa for Shopping (Jordan): current references use it. The sleep-brand case study is "From 6 to 23 of 40 Alexa for Shopping answers" at `/work/from-6-to-23-of-40-alexa-for-shopping-answers`; the old Rufus address redirects (308). Explanations of the rename and dated archive articles keep "Rufus".
- Creative gallery: the shampoo display piece no longer carries the baby food Walmart result (no haircare case study exists); the tumbler video now carries the drinkware TikTok case it shows. The other pieces link to their case studies; links are written as `href="Work.html" data-case="<keyword>"` in `Gallery.html` and resolved by keyword in `site-fixes.mjs`, so a renamed case cannot leave a broken link.
- Value name: "We Raise the Bar Together" (recommended to Jordan; the original export had a dash).
- Search descriptions: 15 case studies get their own (146 to 158 characters, `CASE_DESC` in `site-fixes.mjs`; the build fails on any over 160); the two renamed press releases get full descriptions (`site-content.mjs`); the 404 page has one (`build-site.mjs` and `app/not-found.tsx`).
- Security headers on every response: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` (`next.config.ts`).

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

- 404: served by `app/not-found.tsx` with status 404. Search is the main action; a script offers up to three pages whose address or title is closest to the address asked for (useful for old links into the archive); six starting points; the three newest articles; a "tell us" link that carries the broken address.
- 403: served at `/403` by `app/403/route.ts` with status 403 and noindex. Nothing on the public site refuses a visitor today. Point the client portal or a host rule at `/403` when a request is turned away. `next.config.ts` makes sure the built file ships with the route.
- Images (replaced 2026-11-27): both heroes are original and **AI-generated** (Higgsfield, model GPT Image 2.6, 21:9, 2K, high quality), made to match the site's still-life photography. They are not photographs of a real place or product. Files: `site-src/assets/error-404-e1d78729.jpg` (three stone plinths, the middle one empty) and `site-src/assets/error-403-0ee5006a.jpg` (a closed navy door, a key on a hook beside it). 2000 x 848, about 160 KB each.
  - Workspace: Kwontified Team. Spend: 14 credits (8 drafts at 0.75, 4 finals at 2); the balance went from 14,667.5 to 14,653.5. Approved limit was 22.
  - Style references, imported from the preview site: `5922b4a5b9e8.jpg` (media `3a350c4b-fcbf-4e74-8e00-8a29639a0e64`) and `a6b3196d384b.jpg` (media `bf4db439-fa55-455f-a6f4-36729b3611eb`); each final also used its chosen draft as the composition reference.
  - 404: draft job `a0eb9a74-d26b-4c98-89c0-9cdceb67e197`, final job `49bd2b3d-1125-4702-8a8b-f5c6d0437776`. Prompt: "Editorial still-life photograph. Keep the composition of the first reference image: three pale travertine display plinths of different heights standing in a row in the right third of an ultra-wide 21:9 frame; the left and right plinths each hold one plain kraft cardboard parcel tied with natural string, and the middle plinth is conspicuously empty, a shaft of sunlight falling on its bare top. Wall: dusty steel blue (#8FA3B8) matte painted plaster with fine texture. Hard low afternoon sunlight from the left throws crisp window-frame shadows diagonally across the wall and long shadows of the plinths on a pale polished concrete floor; restrained palette, soft film grain, straight-on eye-level view, 50mm lens, deep depth of field, in the same photographic style as the second reference image. The left half of the frame is an empty stretch of wall and floor with only light and shadow. No people, no text, no lettering, no logos, no labels."
  - 403: draft job `e5cf1b24-04bb-4e3e-9405-44b15f14d52d`, final job `3bb6cf98-6bad-418a-abde-d9516a15ee8e`. Prompt: "Editorial still-life photograph. Keep the composition of the first reference image: at the far right of an ultra-wide 21:9 frame, a closed interior panelled door painted deep navy blue (#102A4C) with a brass lever handle, firmly shut, in a pale stone-blue matte plaster wall (#C9D4DF) with a simple painted door frame; to the left of the door a pale oak bench with one closed plain kraft carton on it. Add one clear detail: on the wall between the bench and the door, at eye level, a small brass hook holding a single brass key on a short tan leather loop. Hard low afternoon sunlight from the left throws crisp window-frame shadows diagonally across the wall; pale polished concrete floor; restrained palette, soft film grain, straight-on eye-level view, 50mm lens, deep depth of field, in the same photographic style as the second reference image. The left half of the frame is an empty stretch of wall and floor with only light and shadow. No people, no text, no numbers, no lettering, no logos."
  - Unused finals: jobs `05fc8fb4-a161-41c2-bb96-941da1b2ff0a` and `089763fb-c82f-4fa7-be98-c5f82644cfd2`. The other six drafts are in the Higgsfield workspace history.
- Lighthouse cannot audit a page that answers 404 or 403; audit `/_kq/404.html` and `/_kq/403.html` instead.

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
- Homepage hero: done 2026-11-26. A still frame of the parcel conveyor (frame at 26.2 s of the desktop video: no people, navy wall behind the headline) shows until the video is actually playing, then the video fades in over 0.8 s. Files `site-src/assets/home-hero-still{,-960,-1440,-1920}` (WebP 17-47 KB, JPEG fallback); it is also the video's poster and the page's LCP image. Visitors who prefer reduced motion get the still and the video is paused (not downloaded further); if the browser refuses autoplay (iOS Low Power Mode, data saver) the still stays and the button offers Play. The two old first-frame background images (`11948d288a83.jpg`, `e57c7576b74e.jpg`) are no longer referenced.
- Leadership profiles: approved by Jordan on 2026-11-27 (after the second polish).
- Google Ads conversions: after go-live (Jordan's decision).
- Jordan is handling: link sharing on the Google Drive folders, and the 2019 and 2020 archive sheets.
- The six draft press releases and the two `[DATA NEEDED]` articles can be imported once the sheets are completed and marked Final.
