# Site QA, SEO and GEO audit: 2026-11-26

Branch `site-fixes-archive`, pre-launch. Audited the production build served locally with `next start`, which is the code Vercel deploys. The live site and the staging deployment cannot be reached from the audit machine, except staging headers, which were read through the Vercel connector. Checks follow the Kwontified site-audit order: reachability and indexability, AI crawler access, snippet controls, structured data, content structure, speed, then llms.txt.

## Headline

Lighthouse 13.6.0, mobile, lab data, on twelve template pages:

| Page | Performance before → after | LCP before → after | CLS before → after | Accessibility | Best practices | SEO |
|---|---|---|---|---|---|---|
| Home | 92 → 94 (95 with the loading still) | 3.2 → 3.1 s | 0.008 → 0 | 98 → 100 | 100 | 100 |
| Perspectives index | 66 → 88 → 98 | 8.1 → 3.0 → 2.5 s | 0.022 → 0 | 100 | 100 | 100 |
| Capabilities | 85 → 99 | 4.1 → 2.2 s | 0.091 → 0 | 100 | 100 | 100 |
| Work | 83 → 98 | 4.4 → 2.3 s | 0.091 → 0 | 100 | 100 | 100 |
| Why Kwontified | 86 → 99 | 3.9 → 2.2 s | 0.091 → 0 | 100 | 100 | 100 |
| Amazon channel | 92 → 99 | 3.0 → 2.1 s | 0.092 → 0 | 100 | 100 | 100 |
| Article | 96 → 99 | 2.4 → 2.0 s | 0.096 → 0 | 100 | 100 | 100 |
| News item | 93 → 99 | 2.9 → 2.0 s | 0.096 → 0 | 100 | 100 | 100 |
| Case study, Careers, Contact, Leadership profile | 90-98 → 99-100 | 0.9-3.3 → 1.0-2.0 s | ~0.09 → 0 | 100 | 100 | 100 |

Lab numbers only. Confirm with field data in Search Console's Core Web Vitals report after launch before calling any page fast or slow.

geo-optimizer 4.19.7 was installed at its pinned version but refuses to audit a local address (a built-in safety guard), so it has no score here. Run `scripts/run_audit.sh` from the site-audit skill against the staging URL from Cloud Shell or CI, and again within 48 hours of launch.

## Fixed in this pass

Critical and high:

1. **Broken meta descriptions and titles (52 descriptions, 11 titles).** Article text containing a dollar amount ("under $10") was inserted with a JavaScript string replacement, which reads `$1` as a pattern. The description was cut off and the page's own tag text was pasted into it. Fixed in `scripts/build-site.mjs` (and the same pattern hardened in `site-content.mjs` and `site-fixes.mjs`) by inserting text literally.
2. **Staging could be indexed.** `kwontified-11.vercel.app` sent no `X-Robots-Tag: noindex`. `next.config.ts` now sends noindex on any `*.vercel.app` host; kwontified.com is unaffected (tested with both host names).
3. **No structured data on 1,059 of 1,083 pages.** New step `scripts/site-seo.mjs` adds JSON-LD built only from what each page shows: BlogPosting (875 articles, author linked to the partner's profile), NewsArticle (143 news items and press releases), ProfilePage (2 leadership pages), WebPage (59), and BreadcrumbList on every page except home, using the page's visible breadcrumb labels. The home Organization gained `@id`, logo, telephone, postcode (shown on the contact page) and founders, plus a WebSite entry. All 1,080 indexable pages validate as JSON and every breadcrumb URL resolves.
4. **Pages scrolled sideways on phones (WCAG 1.4.10).** Grid columns of `minmax(340px, 1fr)` were wider than a 375 px phone on /capabilities and than a 320 px screen on four more pages. Capped with `min(Npx, 100%)` in `site-fixes.mjs`. Re-checked: none of 212 page views (all 65 non-article pages and 41 sampled articles at 320 and 375 px) scroll sideways.
5. **Layout shift of ~0.09 on most pages.** The fonts were not preloaded, so text reflowed when they arrived and the bottom-anchored cookie banner moved. Regular and medium weights are now preloaded; CLS is 0 on every page tested.
6. **Oversized images on phones (0.8-2 MB avoidable per page).** New step `scripts/site-images.mjs` writes an 800 px WebP beside each photo wider than 900 px and adds `srcset`; phones load the WebP, desktops the original (checked in the browser).

Medium:

7. **Descriptions cut at abbreviations or datelines (27 news and press items).** "an annual U.S.", "SANDY SPRINGS, Ga." and four identical press descriptions. The importer's sentence splitter (`scripts/import-archive.py`) now skips abbreviations and datelines and starts press releases with what they announce; the stored data was regenerated with the same code.
8. **Article share images.** Articles shared the site-wide default image; 1,008 now use their own picture and its alt text for `og:image` and `twitter:image`.
9. **Sitemap dates.** Every URL carried the build time as `lastmod`, which crawlers learn to ignore. Dated pages now carry their publication date (1,018 URLs); undated pages carry none.
10. **Long titles.** " | Kwontified" is dropped where it would push a title past 60 characters (982 pages); `og:title` keeps the full form.
11. **Home page had no `<main>` landmark.** Added; accessibility 98 → 100.
12. **`npm run lint` failed** (Next.js 16 removed `next lint`, and the old FlatCompat config was circular). Now runs ESLint directly with the Next.js 16 flat configs; lint and TypeScript pass.

## Checked and passing

- All 1,083 routes return 200; the 21 redirects land on 200 pages; unknown addresses return the 404 page with a 404 status; built files under `/_kq/` send noindex.
- No broken internal links, images, anchors, scripts or stylesheets across 1,083 pages; every link points at a final URL (none at a redirect).
- Every page: one H1, no skipped heading levels, no duplicate IDs, `lang`, viewport, charset, canonical matching the URL, Open Graph and Twitter tags, no duplicate titles or descriptions.
- No `noindex` or snippet limits except the client sign-in and two thank-you pages, which are meant to be hidden.
- Images: every content image has alt text except the Perspectives index cards (empty on purpose, the linked title sits beside them).
- Homepage video: autoplays muted with `playsinline`, has a 44 px pause button, a text description and is hidden for visitors who prefer reduced motion.
- No script errors and no failed requests on 30 template pages at four widths (1440, 768, 375, 320); spacing and gutters consistent across templates.
- Sitemap: 1,080 URLs, no duplicates, nothing missing, nothing extra.

## AI crawler access (robots.txt as built)

| Crawler | Purpose | Status |
|---|---|---|
| OAI-SearchBot, ChatGPT-User | ChatGPT search, user fetch | Allowed |
| PerplexityBot | Perplexity answers | Allowed |
| Perplexity-User, Claude-SearchBot, Claude-User, DuckAssistBot, MistralAI-User | Answers, user fetch | Allowed (through `*`) |
| Googlebot, Bingbot, Applebot | Search index | Allowed (through `*`) |
| Amazonbot | Alexa answers | Allowed |
| GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended | Model training | Allowed (business decision; allowing helps models know the brand) |
| Bytespider, Meta-ExternalAgent | Training | Allowed (through `*`) |

## Decisions from Jordan (applied 2026-11-26)

1. **robots.txt.** Approved and applied 2026-11-26, including the optional updates (Claude-SearchBot, Claude-User and Perplexity-User added; Claude-Web and anthropic-ai dropped). The issue was: the AI crawler group repeats only `Allow: /`. A named group replaces the `*` group for those bots, so they are not told to skip the thank-you pages, sign-in, `/api/` and `/_kq/`. Proposed change to `app/robots.ts`, giving the AI group the same disallows:

   ```diff
          userAgent: [ "GPTBot", ..., "CCBot" ],
          allow: "/",
   +      disallow: ["/contact/thank-you", "/subscribe/thank-you", "/client-sign-in", "/api/", "/_kq/"],
   ```

   Low risk either way: those pages carry noindex. Optional at the same time: add Claude-SearchBot, Claude-User and Perplexity-User to the named group, and drop the retired `Claude-Web` and `anthropic-ai` tokens.
2. **Headquarters wording.** Resolved 2026-11-26: Jordan chose Atlanta. Every page, the structured data, the press datelines ("ATLANTA —") and the importer now say Atlanta, with the 30328 postcode kept, matching the footer heading and llms.txt.

## Still open (low)

- **Titles over 60 characters (497):** the article headlines themselves. Google truncates rather than penalises; shorten in the sheets if any underperform in Search Console.
- **Resolved 2026-11-27, meta descriptions:** none over 160 or under 70 characters on core pages, case studies and press releases.
- **External links:** 2,092 outside links to 699 sites could not be tested from the audit machine (network blocked). All are well formed; one uses plain http (techlicious.com). Run a live link check (for example `lychee`) in CI or after launch.
- **Leadership photographs:** done 2026-11-26 (see HANDOVER.md).
- **Resolved 2026-11-26:** careers@, legal@, security@ and support@kwontified.com all receive mail (Jordan confirmed); sales@ is no longer used anywhere.
- **Resolved 2026-11-26, homepage video:** a still frame now shows until the video plays (see HANDOVER.md). The video itself still shows people; it is kept as it is.
- **Resolved 2026-11-26, Perspectives index:** only the first page of each list is in the HTML (212 KB, down from 1.2 MB); the rest loads on demand. Lighthouse mobile 98 on four runs, TBT 0-10 ms.
- **Resolved 2026-11-27, security headers:** `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin` on every response; Vercel adds HSTS.
- **26 template images without width and height attributes:** no measured layout shift (CLS 0), so no action needed.
- **Audit storage:** rows were not added to `seo_geo_ops` because this was a pre-launch local audit; the first live-site audit should be the baseline.

## Final QA (2026-11-27)

Build, `npx tsc --noEmit` and `npm run lint` pass. Served with `next start`: all 1,083 routes return 200; all 19 redirects (including the renamed sleep-brand case study and `/subscribe`) land on 200 pages; sitemap (1,080 URLs), robots.txt and llms.txt serve. Across 1,084 built pages: no broken internal links, no invalid JSON-LD, and every FAQ's visible questions match its FAQPage data. No strong AI-writing tells on any core page. Every article, news and press listing tested opens its item from picture, title, summary or date line; every linked gallery piece opens its case study.

Lighthouse 13.6.0, mobile, lab data:

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home (three runs) | 98–99 | 100 | 100 | 100 | 2.1–2.3 s | 0 ms | 0 |
| Perspectives index | 98 | 100 | 100 | 100 | 2.5 s | 20 ms | 0 |
| Creative gallery | 98 | 100 | 100 | 100 | 2.3 s | 0 ms | 0 |
| Case study (sleep brand) | 99 | 100 | 100 | 100 | 2.0 s | 0 ms | 0 |
| Contact | 99 | 100 | 100 | 100 | 2.0 s | 30 ms | 0 |
| Why Kwontified | 99 | 100 | 100 | 100 | 2.2 s | 0 ms | 0 |
| Capabilities | 99 | 100 | 100 | 100 | 2.3 s | 20 ms | 0 |
| Amazon | 99 | 100 | 100 | 100 | 2.1 s | 10 ms | 0 |
| International | 99 | 100 | 100 | 100 | 2.1 s | 10 ms | 0 |
| Article | 99 | 100 | 100 | 100 | 2.0 s | 0 ms | 0 |

Home page: the 30 client and press logos were inline SVG (373 KB of the 545 KB page). `scripts/site-logos.mjs` moves each to its own file with the list colour written in, lazy-loaded, brand name as alt text; the page is now 165 KB and Lighthouse performance went from 94 to 98–99. Screenshots before and after at 2x match in position (zero offset); the only pixel differences are anti-aliasing at logo edges.

Patch scores (rubric: correctness, completeness, accuracy against sources, consistency with the rest of the site, regression safety):

| Patch | Score | Evidence |
|---|---|---|
| Alexa for Shopping | 99 | No current-tense "Rufus" left; history kept; old case address redirects (308) |
| Creative gallery | 99 | 2 captions corrected against their images; 10 links resolve by keyword, build fails if one cannot |
| Value name | 99 | Matches the other seven value names; one-line change if Jordan prefers the original dash |
| Search descriptions | 99 | 18 pages now 141–158 characters; meta, Open Graph and JSON-LD agree; build fails above 160 |
| Security headers | 100 | Served on pages and assets |
| Home logos | 99 | 30 of 30 load; visual match; performance 94 to 98–99 |

## UX effects (2026-11-27)

Ten enhancements added by `scripts/site-effects.mjs` (list and reasoning in `HANDOVER.md`). Tested in Chromium at 1440, 1100, 390, 360 and 320px wide, with and without reduced motion.

Lighthouse, mobile, after the change:

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home | 97–99 | 100 | 100 | 100 | 2.1–2.3 s | 10–100 ms | 0 |
| Perspectives index | 97–98 | 100 | 100 | 100 | 2.4–2.5 s | 0–20 ms | 0 |
| Creative gallery | 99 | 100 | 100 | 100 | 2.3 s | 0 ms | 0 |
| Case study | 99 | 100 | 100 | 100 | 2.0 s | 0 ms | 0 |
| Contact | 99 | 100 | 100 | 100 | 2.0 s | 0 ms | 0 |
| Why Kwontified | 99 | 100 | 100 | 100 | 2.2 s | 0 ms | 0 |
| Capabilities | 99 | 100 | 100 | 100 | 2.3 s | 10 ms | 0 |
| Amazon | 99 | 100 | 100 | 100 | 2.0 s | 20 ms | 0 |
| International | 99 | 100 | 100 | 100 | 2.1 s | 30 ms | 0 |
| Article | 99 | 100 | 100 | 100 | 2.0 s | 20 ms | 0 |
| About | 99 | 100 | 100 | 100 | 2.2 s | 0 ms | 0 |

The Perspectives index measured 98, 98 with the effects removed and 98, 98 with them in back-to-back runs, so the 97 readings are run-to-run variation. The shared script is 8.1 KB, deferred and cached for a year.

| Effect | Score | Evidence |
|---|---|---|
| 1 Home page motion | 99 | 75 blocks reveal and none stays hidden after a full scroll; results count to +64%, 6.8x, $781K and screen readers get the final figure throughout; CLS 0; off under reduced motion |
| 2 Hover feedback | 99 | Hover audit on 17 page types: every link and button changes on hover except the current-page link, form labels, native selects and disabled pager buttons; card and button transitions from the export unchanged |
| 3 Faster page changes | 98 | Chrome prefetches on hover (request seen with `Sec-Purpose: prefetch`); Firefox and Safari fallbacks exercised by simulation only, not in those browsers |
| 4 Form feedback | 99 | Empty, mistyped, corrected, sending, failed and Back-button cases pass on contact and newsletter, desktop and phone |
| 5 Skip link | 100 | First tab stop; Enter moves focus to main; next Tab lands in the page content |
| 6 Back to top | 99 | Correct at 390, 1100 and 1440px; hidden on short pages and while the phone menu is open; keyboard use returns focus to the logo |
| 7 Reading progress | 99 | 0, 30, 60 and 100% of the article body map to the same share of the line |
| 8 Phone header button | 99 | Fits at 320, 360 and 390px with no sideways scroll; header 64–66px tall while scrolling (the home header was 90px) |
| 9 Tap feedback | 98 | Highlight colours and the pressed states of cards, FAQ questions and buttons confirmed under phone emulation; not seen on a physical phone |
| 10 List fade | 99 | Fires on search, filters and pagers on five pages; does not fire when the archive loads or on scroll reveals |

All 1,083 routes return 200, the redirects and 404 page work, and build, type check and lint pass.

## Navigation review (2026-11-27)

Measured with a link-graph analysis of all 1,083 pages and browser tests at 320 to 1536px. Scores are out of 10 per line, on our own rubric.

| | Before | After | What changed |
|---|---|---|---|
| Reaching pages from the header | 6 | 10 | 21 pages below Capabilities, Channels, Work and About are one step from the header; before, only from the section page or footer |
| Header on laptop screens | 5 | 9.5 | Full header from 1180px (was 1340px, so a 1280px laptop got the Menu button); 1024 to 1179px still uses Menu |
| Knowing where you are | 8.5 | 9.5 | Current page marked in panels and phone menu; Perspectives and the three legal pages still have no breadcrumb line |
| Moving between sibling pages | 5 | 10 | Previous / next on 16 capability and channel pages (they linked to 0 or 1 of their siblings) |
| Search | 7 | 10 | Finds the 1,018 archive items as well as 63 pages; "/" opens it; hands a query to the archive search |
| Phone menu | 5 | 10 | Sections expand; panel scrolls (last items were cut off on a 568px-tall phone); Escape and outside tap close it |
| Back button keeps your place | 7 | 10 | Pager page restored when the browser has not kept the page; Work filters already did |
| Keyboard | 9 | 10 | Skip link, arrow keys and Escape in panels, focus returns to the button |
| Same behaviour on home and inner pages | 8 | 9.5 | Same menus and behaviour; the home header's logo and Menu button still look slightly different |
| Recovering from a dead end | 7 | 10 | 404 with search and closest-page suggestions; 403 page |
| **Total** | **68** | **98** | |

Every page is within two clicks of the home page (unchanged). Lighthouse after the change: performance 97 to 99, accessibility, best practices and SEO 100 on home, About, Perspectives and Walmart.

## Error pages (2026-11-27)

- `/no-such-page` returns 404 and `/403` returns 403; both render the full site header and footer.
- A mistyped article address (`/perspectives/prime-day-2026-result`) offers three matching articles; a meaningless address offers none and still shows search and six starting points.
- Lighthouse on the built files: performance 99, accessibility 100, best practices 100 (SEO is marked down only because the pages are noindex, as intended).

## Translation (2026-11-27)

- All 1,085 built pages can be split into text entries and reassembled byte for byte, and an "identity" translation reproduces every page.
- Spanish preview: 358 entries in 5 files, all translated, 0 problems from the placeholder, figure and protected-name checks. Four pages build and load at `/es/...`; `/es/about` (not translated) returns 404.
- On the Spanish pages: language, canonical address, structured data and internal links are correct; menus, search, filters, pager, forms, reading progress and back-to-top work; form messages appear in Spanish; the header fits at 320, 390, 1024, 1180, 1280 and 1440px.
- Preview mode: noindex, absent from the sitemap, no language menu on English pages. Live mode was switched on for one build to check it: hreflang links on both versions, sitemap entries with alternates, language menu on the four English pages; then switched back.
- Lighthouse on a Spanish article: performance 99, accessibility 100, best practices 100.
- Not checked: the Spanish wording by a native speaker; Safari and Firefox.

## Copy pass (2026-11-26)

All copy scored, refined and rescored; details in `COPY-PASS.md`. Built core pages: 66, none with a strong AI-writing tell (the two press-release datelines keep their dash). Archive: 1,013 items, none with a strong tell after 66 edits in 34 articles. All 1,083 routes return 200 after the changes.

## Not checked

- Field Core Web Vitals (no live traffic yet), geo-optimizer score (see above), live status of external links, the client portal behind sign-in, form submission end to end (covered in `FORMS-SETUP.md`), and how the site renders in Safari and Firefox (Chromium only; this includes the Safari and Firefox prefetch fallbacks and the tap highlight on a physical phone).
