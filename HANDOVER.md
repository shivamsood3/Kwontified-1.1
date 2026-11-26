# Kwontified website: handover for Claude Code

Read this first. It carries over the state of a long chat session with Jordan Taylor (Managing Partner, Kwontified) so the work can continue in this repository.

## Where things stand

- Repository: `shivamsood3/kwontified-1.1`. All changes in this handover were made on top of commit `b57b91ceaddd662586d20faf5f9301c2e9810e22` (branch `v1.2-perspectives-and-new-pages`). Check whether the branch has moved before applying.
- Everything is delivered as one patch, `kwontified-site-fixes.patch`. Apply with `git apply kwontified-site-fixes.patch` (it contains a binary image and the archive data, about 10 MB).
- Nothing in the patch is live. Pre-launch preview: https://kwontified-11.vercel.app (Vercel team `kwontified`).
- Build: `npm run build:site` runs six steps in order, then `next build`:
  1. `scripts/build-site.mjs` (the developer's): turns the HTML exports in `site-src/pages` into `public/_kq` and writes `site-routes.json`. Now also merges `site-src/archive/*.json`.
  2. `scripts/site-fixes.mjs`: case study pages, link fixes, homepage finder and video button, article meta tags.
  3. `scripts/site-content.mjs`: Accessibility page, newsletter confirmation page, omni-channel copy, press release renames.
  4. `scripts/site-archive.mjs`: lists the imported archive on the Perspectives index.
  5. `scripts/site-tags.mjs`: Google Tag Manager and Google Ads tag, loaded only after cookie consent.
  6. `next build`.
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

## Next job: the images

Every imported article currently shows a stand-in panel (`site-src/assets/kq-archive-fallback.svg`) as its hero and on its index card.

- `site-src/archive/images.json` maps each article ID to its Google Drive file ID and the file name the build looks for: `site-src/assets/archive-<ID>.jpg`.
- When that file exists, `build-site.mjs` uses it as the article hero and `site-archive.mjs` uses it on the index card. No other change is needed: add the files and rebuild.
- To do: download each Drive file (the originals are large, many upscaled to 4K), resize to web size, and save under that name. Suggested: JPEG, 1,400 px wide, quality about 78, which should land near 150 KB each and about 150 MB for all 985. Raise the size question with Jordan or the developer before committing that much to the repository; object storage is the alternative.
- Drive access must be set up on this machine (for example rclone with a Drive remote, or the Drive API with OAuth). The chat session could not reach Drive, so this step is untested.
- Imported images have empty alt text (the sheets hold none). Decide with Jordan whether to write alt text.
- Jordan's image rules: photorealistic, no people in site imagery.

## Checks that passed in the chat session (rerun after changes)

- All six build steps and `next build` complete.
- 36,553 internal links across 1,084 pages: none dead. Every article route has its file and is listed once on the Perspectives index.
- `next start`: article, news and press addresses return 200; an unknown article address returns the 404 page; the sitemap lists 1,080 URLs.
- Perspectives index in a simulated browser (jsdom): newest first, 9 articles and 12 news items per page, month, channel, topic and search filters work across the archive.
- Cookie banner and tag loading: nine visitor scenarios pass.
- Not checked: how imported articles look in a real browser. Look at several with tables and numbered lists (284 articles contain tables), on desktop and phone.

## Decisions Jordan has made (do not undo)

- Google Tag Manager `GTM-NCKGHDXW` and Google Ads `AW-857530176` load only after cookie consent, through the existing banner. The Ads tag uses the `gtag/js` path, not `gtm.js`.
- Share image: Concept A with the white K mark and wordmark, no tagline (`public/og/default.jpg`).
- Press releases on the site do not name Corey Brown, Priyanka Shah or Dennis Wong. The press kit block is removed for now.
- Public copy says "one agile omni-channel strategy"; budgets move between channels only with client approval.
- Contact address is contact@kwontified.com; press is press@kwontified.com; phone 404.873.9148.

## Open items

- FAQ additions: Jordan is filling in `kwontified-faq-additions.xlsx` (33 recommended questions). Draft the entries and matching FAQ markup when he returns it.
- Forms: the Google Sheet webhooks and Mailchimp audiences described in `FORMS-SETUP.md` are not set up yet.
- Google Ads conversions: no conversion labels yet for the contact and newsletter thank-you pages.
- Leadership photographs: placeholders remain on About, Leadership and Perspectives.
- The Perspectives index page is about 1.1 MB of HTML with the full archive. If that proves slow, move the cards to a data file loaded on demand.
- The six draft press releases and the two `[DATA NEEDED]` articles can be imported once the sheets are completed and marked Final.
