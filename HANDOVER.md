# Kwontified website: handover for Claude Code

Read this first. It carries over the state of a long chat session with Jordan Taylor (Managing Partner, Kwontified) so the work can continue in this repository.

## Where things stand

- Repository: `shivamsood3/kwontified-1.1`. All changes in this handover were made on top of commit `b57b91ceaddd662586d20faf5f9301c2e9810e22` (branch `v1.2-perspectives-and-new-pages`). Check whether the branch has moved before applying.
- The work is on branch `site-fixes-archive` (pushed 2026-11-26), based on `v1.2-perspectives-and-new-pages` at `b57b91c`. It supersedes the earlier `kwontified-site-fixes.patch` and `kwontified-site-fixes-v2.patch` files.
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

## The images (done 2026-11-26)

- All 985 archive items have their own image at `site-src/assets/archive-<ID>.jpg`: JPEG, 1,400 px wide, quality 78, progressive, no metadata, 140 MB in all, committed to the repository. `build-site.mjs` uses each as the article hero and `site-archive.mjs` on the index card; the fallback panel no longer appears anywhere.
- Source: `site-src/archive/images.json` maps each ID to a Google Drive file (originals are 3840 px, in yearly subfolders of **Kwontified Article Images**). News items and press releases reuse 23 shared theme images (files named like `N18-retail-media-networks-4k.jpg`), as the sheets specify.
- How they were fetched: through the Google Drive connector in the Claude session, then resized locally. `scripts/fetch-archive-images.py` does the same job without Claude, given `GDRIVE_API_KEY` (while the folder is link-shared), `GDRIVE_SERVICE_ACCOUNT_JSON` or `GDRIVE_ACCESS_TOKEN`; it skips files already saved, so it is only needed for new or replaced images.
- Alt text: every item now has a one-sentence description of its picture in the `alt` field of `site-src/archive/Post.json`, `PostNews.json` and `PostPressRelease.json`, written by looking at each image. The article hero uses it; index cards keep `alt=""` because the linked title sits right beside them.
- Press releases: the press release template has no hero image, so their 8 images are saved but not shown.
- Review list: `site-src/archive/image-review.txt` lists 122 images flagged while saving, grouped as people (19), brands or logos (27) and other (76, mostly garbled AI lettering). Jordan's rule is photorealistic with no people. Most flags are only visible up close; the ones visible at normal size are A0347 (pedestrians in the street), A0035 (partial figure at the left edge), P0498 and A0591 (tiny figures), A0541 (two photos side by side) and A0836 (white print border). Replacing one is: save the new file under the same name and rebuild.
- Jordan may want to turn link sharing off again on **Kwontified Creative Content**.

## Checks that passed in the chat session (rerun after changes)

- All six build steps and `next build` complete.
- 36,553 internal links across 1,084 pages: none dead. Every article route has its file and is listed once on the Perspectives index.
- `next start`: article, news and press addresses return 200; an unknown article address returns the 404 page; the sitemap lists 1,080 URLs.
- Perspectives index in a simulated browser (jsdom): newest first, 9 articles and 12 news items per page, month, channel, topic and search filters work across the archive.
- Cookie banner and tag loading: nine visitor scenarios pass.
- Real browser (Chromium, second session): four imported articles with tables or numbered lists and the Perspectives index, at 1440 px and on an iPhone 13 profile. All return 200 with no sideways page scroll. Tables render cleanly on desktop; on phone they scroll sideways inside their own box. Numbered lists render correctly. Article content fades in on scroll (`.kq-r`), so a screenshot taken without scrolling shows blank space; that is expected.
- Perspectives index weight: 1.16 MB of HTML, 175 KB compressed, about 7,500 elements. On an emulated slow phone (slow 4G, 4x CPU slowdown): first content at 0.4 s, page ready at 2.6 s, fully loaded at 4.8 s. Moving the cards to a data file can wait.

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
