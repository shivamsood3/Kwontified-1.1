# Kwontified website: handover for Claude Code

Read this first. It carries over the state of a long chat session with Jordan Taylor (Managing Partner, Kwontified) so the work can continue in this repository.

## Where things stand

- Repository: `shivamsood3/kwontified-1.1`. All changes in this handover were made on top of commit `b57b91ceaddd662586d20faf5f9301c2e9810e22` (branch `v1.2-perspectives-and-new-pages`). Check whether the branch has moved before applying.
- The work is on branch `site-fixes-archive` (pushed 2026-11-26), based on `v1.2-perspectives-and-new-pages` at `b57b91c`. It supersedes the earlier `kwontified-site-fixes.patch` and `kwontified-site-fixes-v2.patch` files.
- Nothing in the patch is live. Pre-launch preview: https://kwontified-11.vercel.app (Vercel team `kwontified`).
- Build: `npm run build:site` runs eight steps in order (`npm run build` then runs `next build`):
  1. `scripts/build-site.mjs` (the developer's): turns the HTML exports in `site-src/pages` into `public/_kq` and writes `site-routes.json`. Now also merges `site-src/archive/*.json`.
  2. `scripts/site-fixes.mjs`: case study pages, link fixes, homepage finder and video button, article meta tags; since the QA pass also narrow-screen grid columns, font preloads and the home page `<main>`.
  3. `scripts/site-content.mjs`: Accessibility page, newsletter confirmation page, omni-channel copy, press release renames.
  4. `scripts/site-archive.mjs`: lists the imported archive on the Perspectives index.
  5. `scripts/site-seo.mjs`: JSON-LD on every page, article share images, title length, `site-lastmod.json` for the sitemap.
  6. `scripts/site-images.mjs`: 800 px WebP copies and `srcset` for phones (needs `sharp`, which Next.js installs; skips itself if missing).
  7. `scripts/site-tags.mjs`: Google Tag Manager and Google Ads tag, loaded only after cookie consent.
  8. `next build`.
  The full build takes about a minute; most of it is step 6 making the WebP copies.
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

## Decisions Jordan has made (do not undo)

- Google Tag Manager `GTM-NCKGHDXW` and Google Ads `AW-857530176` load only after cookie consent, through the existing banner. The Ads tag uses the `gtag/js` path, not `gtm.js`.
- Share image: Concept A with the white K mark and wordmark, no tagline (`public/og/default.jpg`).
- Press releases on the site do not name Corey Brown, Priyanka Shah or Dennis Wong. The press kit block is removed for now.
- Public copy says "one agile omni-channel strategy"; budgets move between channels only with client approval.
- Headquarters is written as Atlanta, Georgia (address 7000 Central Parkway, Suite 1100, Atlanta, GA 30328; Atlanta and Sandy Springs are interchangeable for 30328). Changed from Sandy Springs everywhere on the site on 2026-11-26; press datelines read "ATLANTA —". The archive sheets still say Sandy Springs in press datelines; the importer accepts both.
- Contact address is contact@kwontified.com; press is press@kwontified.com; phone 404.873.9148. sales@kwontified.com is not used: every reference in the archive and on the site was changed to contact@ (2026-11-26).

## Open items

- FAQ additions: Jordan is filling in `kwontified-faq-additions.xlsx` (33 recommended questions). Draft the entries and matching FAQ markup when Jordan returns it.
- Forms: the Google Sheet webhooks and Mailchimp audiences described in `FORMS-SETUP.md` are not set up yet.
- Google Ads conversions: no conversion labels yet for the contact and newsletter thank-you pages.
- Leadership photographs: done 2026-11-26. All seven placeholders (About, Leadership, both profile pages, the Perspectives author avatar) now show portraits made from the headshots Jordan supplied. Background removed locally with rembg (BiRefNet portrait model) and set on a light blue-grey studio background; both aligned on the same eye line and face scale. Resolution: EDSR 2x super-resolution (a fidelity model, not generative) for edges, with the original photo's own colour and fine detail restored on top, tuned so skin texture matches the original at display size (no smoothing, no retouching, no added sharpening). Files in `site-src/assets`: `leadership-<name>.jpg` (1440x1800 master), `leadership-<name>-{400,600,800,1080,1440}.webp`, `leadership-<name>-square.jpg` and `-square-{112,168,240,480}.webp`; each <img> has a srcset and a sizes value matching its slot. The masters are also in each Person's JSON-LD.
- Leadership profiles: rebuilt 2026-11-26 (Author.html, AuthorJordan.html; summaries on Leadership and About). Header with remit line, three-paragraph bio and a credential strip; new "What <name> leads" and "Background" (experience, education and training, speaking) sections; topics and press intro re-aligned. Sources: Jordan's direction (remits; KeyBanc AI speaking; Elaine featured in BoF, NYT, WSJ); the 2018 Allison+Partners biography PDFs (education, earlier roles); Elaine's 2025 unBoxed speaker bio (McMaster-Carr, Amazon, Convoy); her 2016 panel bio (University of Pennsylvania); Global Alumni emails (MIT Professional Education Applied Agentic AI, completed by both, 2026); press lists already on the site. LinkedIn was not reachable from the build environment. Person JSON-LD carries alumniOf, hasCredential, knowsAbout and (Elaine) knowsLanguage. Degrees confirmed by Jordan (2026-11-26): Jordan, BA Cornell University and JD University of Notre Dame; Elaine, BA University of Pennsylvania (also in the Person JSON-LD as degree credentials). Confirmed by Jordan (2026-11-26): Elaine was a panelist at Amazon Ads unBoxed 2025; the New York Times reference and Convoy are omitted (no source link for the former). Still to confirm: naming Gucci, Versace and Salvatore Ferragamo, Elaine's languages, and whether CNBC (Jun 2017) belongs in Elaine's press line.
- The Perspectives index page is about 1.1 MB of HTML with the full archive. After the image work it scores 88 on Lighthouse mobile (LCP 3.0 s, TBT 370 ms); moving the cards to a data file loaded on demand would bring it in line with the other pages.
- From the QA pass (details in `QA-REPORT.md`): a robots.txt change and an llms.txt wording change await Jordan's approval; confirm the careers@, legal@, security@ and support@ mailboxes exist; run geo-optimizer and a live external-link check where the site is reachable; decide on the homepage video (no poster image, and it shows people).
- The six draft press releases and the two `[DATA NEEDED]` articles can be imported once the sheets are completed and marked Final.
