# Kwontified website: handover for Claude Code

Read this first. It carries over the state of a long chat session with Jordan Taylor (Managing Partner, Kwontified) so the work can continue in this repository.

## Where things stand

- Repository: `shivamsood3/kwontified-1.1`. All changes in this handover were made on top of commit `b57b91ceaddd662586d20faf5f9301c2e9810e22` (branch `v1.2-perspectives-and-new-pages`). Check whether the branch has moved before applying.
- Everything is delivered as one patch, `kwontified-site-fixes-v2.patch`, which replaces the earlier `kwontified-site-fixes.patch` (it adds `scripts/fetch-archive-images.py` and this updated file). Apply with `git am kwontified-site-fixes-v2.patch` to keep the two commits, or `git apply` for the changes alone (it contains a binary image and the archive data, about 10 MB).
- Second session, 2026-11-26: the patch was applied to an unchanged `b57b91c` and the full build passed. That session could not push to the repository, so the developers apply the patch themselves.
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
- The originals are 3840 px JPEGs of about 0.8 to 1.5 MB each, named `<ID>-3840.jpg`, in yearly subfolders (`kwontified-2018-hero-images` and so on) of one Drive folder, **Kwontified Article Images**, owned by jordan@kwontified.com.
- `scripts/fetch-archive-images.py` downloads each one through the Drive API, resizes it to 1,400 px wide at JPEG quality 78 (progressive, no metadata), and saves it under the name above. It skips files already saved, so it can be stopped and rerun, and lists any failures at the end. Options: `--only P0002,P0003`, `--limit N`, `--width`, `--quality`, `--workers`.
- Credential: a Google Cloud service account with the Drive API enabled, and **Kwontified Article Images** shared with its email as Viewer. Jordan is setting this up and will send the JSON key securely. Then:
  ```
  pip install pillow cryptography
  GDRIVE_SERVICE_ACCOUNT_JSON=/path/to/key.json python3 scripts/fetch-archive-images.py --limit 5   # try a few first
  GDRIVE_SERVICE_ACCOUNT_JSON=/path/to/key.json python3 scripts/fetch-archive-images.py
  npm run build:site
  ```
  `GDRIVE_ACCESS_TOKEN` (an OAuth token with drive.readonly scope) also works for a short run.
- Simpler alternative, now available: on 2026-11-26 Jordan shared the parent folder **Kwontified Creative Content** as "Anyone with the link". While that holds, a plain Google Cloud API key with the Drive API enabled is enough: run the same commands with `GDRIVE_API_KEY=<key>` in place of `GDRIVE_SERVICE_ACCOUNT_JSON`. After the images are saved, Jordan may want to turn link sharing off again.
- Tested so far: the resize step on a synthetic 4K image, and the clean failure when no credential is set. Not yet tested: a real download.
- Expected total about 150 MB. Agree with Jordan whether to commit the images to the repository or use object storage (for example Vercel Blob, which would need the two image lookups in `build-site.mjs` and `site-archive.mjs` changed to the storage URL).
- Imported images have empty alt text (the sheets hold none). Decide with Jordan whether to write alt text.
- Jordan's image rules: photorealistic, no people in site imagery.

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
