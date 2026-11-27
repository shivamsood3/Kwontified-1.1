# Translating the site

The site can publish any page in other languages. Translated pages are real pages on kwontified.com with their own addresses (`/es/perspectives/...`), so search engines and AI assistants can find and cite them in that language.

Spanish is set up as a **preview**: the Perspectives index, two articles and a press release. Preview pages can be opened and reviewed but are hidden from search engines and are not linked from the English pages.

- `/es/perspectives`
- `/es/perspectives/holiday-season-starts-october`
- `/es/perspectives/prime-big-deal-days-what-it-added`
- `/es/perspectives/press-releases/kwontified-launches-perspectives-and-the-kwontified-briefing-newsletter`

The Spanish in the preview was written by Claude and has not been read by a native speaker. Have it reviewed before it goes live.

## How it works

1. The English site is built as usual.
2. For each language, the last build step (`scripts/site-i18n.mjs`) makes a copy of every page that has a translation file and replaces its words. Layout, pictures, menus, search and forms are the same code as the English page, so a change to the site reaches every language on the next build.
3. Translations live in the project as plain files, one per page, in `site-i18n/<language>/pages/`. Text every page shares (menus, footer, cookie notice, search, form messages) is in `site-i18n/<language>/_site.json` and is translated once.

Each entry has the English (`src`) and the translation (`t`):

```json
{ "k": "5a0f…", "src": "Read <1>the case study</1>.", "t": "Lea <1>el caso de estudio</1>." }
```

`<1>…</1>` marks a link or other formatting. It moves with the words; the translator never touches the site's code.

A translated page gets its own address, `<html lang>`, structured data in that language and, once the language is live, links between the language versions (`hreflang`) and an entry in the sitemap. Links inside a translated page stay in that language where the target page is translated and go to the English page where it is not. The Perspectives index in each language lists only what exists in that language.

## Adding pages or a language

```bash
npm run build:site
```

```bash
node scripts/i18n.mjs extract es --newest 25
```

That starts the 25 newest Perspectives items that are not translated yet and says how many words there are. To start named pages:

```bash
node scripts/i18n.mjs extract es /about /capabilities/retail-media
```

Then fill in the empty `t` values, check them and build:

```bash
node scripts/i18n.mjs check es
```

```bash
npm run build
```

`check` (and the build) refuse a translation that has lost a link marker, a figure or a protected name such as Amazon or Kwontified. The protected names are listed under `keep` in `site-i18n/config.json`.

To add a language, add it to `site-i18n/config.json` (`{ "code": "de", "name": "Deutsch", "english": "German", "live": false }`) and run `extract de ...`. A new language needs no code or routing change.

```bash
node scripts/i18n.mjs status es
```

shows what is translated, what is missing and which English text has changed since it was translated.

## Who does the translating

Three ways, which can be mixed:

- **Claude, in a session like this one.** Ask: "Translate the 50 newest Perspectives articles into Spanish." Claude runs the steps above and fills in the files. This uses your existing subscription and no extra service. It was the method used for the preview.
- **A translation service or agency.** The files are simple JSON and can be sent out and returned.
- **A person,** editing the `t` values directly. This is also how a reviewer corrects a translation.

An unattended option (translate each new article automatically when it is published, through the Claude API) is not built. It needs an API key and a decision on review.

## Going live

In `site-i18n/config.json`, set `"live": true` for the language and rebuild. The English pages that have a translation then show a language menu (footer, phone menu, and header on wide screens), both versions link to each other for search engines, and the translated pages join the sitemap.

## The size of the job

| | Words | Entries |
|---|---|---|
| Text every page shares | about 400 | 89 |
| Perspectives index | about 700 | 166 |
| One article | about 1,000 | 40 to 50 |
| The whole archive (1,018 items) | about 1 million | about 45,000 |
| The 66 main pages | about 60,000 | about 6,000 |

## What is not translated yet

- Text that scripts write while the page is used: search results in the site search (page titles stay in English), the "1–9 of 874" pager counts, and the home page's case finder results. Form messages, button states and the skip and back-to-top labels are translated.
- Words inside photographs and charts.
- The address itself (`/es/perspectives/holiday-season-starts-october` keeps the English words).
- The contact form's emails and the newsletter, which are separate from the site.

## Decisions for Jordan

1. Which languages, and in what order. Spanish is the preview only because Kwontified already works in Mercado Libre and Amazon Mexico.
2. Who reviews each language before it goes live. Machine-translated pages published at scale without review can hurt a site's standing with search engines, and job titles and names need a human decision (the preview leaves "Co-Founder and Managing Partner" in English because Spanish titles are gendered).
3. How much to translate: Perspectives only, or the main pages as well. A Spanish reader who clicks from an article to Capabilities currently lands on the English page.
