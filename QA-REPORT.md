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
- **Meta descriptions over 160 characters (17):** capability and case study pages, cut off in results after about 155 characters. **Under 70 (2):** the two original 2026 press releases ("Kwontified to attend Amazon Accelerate 2026 in Seattle.").
- **External links:** 2,092 outside links to 699 sites could not be tested from the audit machine (network blocked). All are well formed; one uses plain http (techlicious.com). Run a live link check (for example `lychee`) in CI or after launch.
- **Leadership photographs:** done 2026-11-26 (see HANDOVER.md).
- **Resolved 2026-11-26:** careers@, legal@, security@ and support@kwontified.com all receive mail (Jordan confirmed); sales@ is no longer used anywhere.
- **Resolved 2026-11-26, homepage video:** a still frame now shows until the video plays (see HANDOVER.md). The video itself still shows people; it is kept as it is.
- **Resolved 2026-11-26, Perspectives index:** only the first page of each list is in the HTML (212 KB, down from 1.2 MB); the rest loads on demand. Lighthouse mobile 98 on four runs, TBT 0-10 ms.
- **Security headers:** Vercel adds HSTS; consider `X-Content-Type-Options: nosniff` and a `Referrer-Policy`.
- **26 template images without width and height attributes:** no measured layout shift (CLS 0), so no action needed.
- **Audit storage:** rows were not added to `seo_geo_ops` because this was a pre-launch local audit; the first live-site audit should be the baseline.

## Not checked

- Field Core Web Vitals (no live traffic yet), geo-optimizer score (see above), live status of external links, the client portal behind sign-in, form submission end to end (covered in `FORMS-SETUP.md`), and how the site renders in Safari and Firefox (Chromium only).
