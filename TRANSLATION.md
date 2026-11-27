# Translating the site

The site can publish any page in other languages. Translated pages are real pages on kwontified.com with their own addresses (`/es/perspectives/...`), so search engines and AI assistants can find and cite them in that language.

Four languages are set up as **previews**: Spanish, French, Korean and Simplified Chinese. Each has the Perspectives index, two articles and a press release. Preview pages can be opened and reviewed but are hidden from search engines and are not linked from the English pages.

| Language | Address | Language tag |
|---|---|---|
| Spanish | `/es/perspectives` | `es` |
| French | `/fr/perspectives` | `fr` |
| Korean | `/ko/perspectives` | `ko` |
| Chinese (Simplified) | `/zh/perspectives` | `zh-Hans` |

The same four pages exist in each: the index, `/perspectives/holiday-season-starts-october`, `/perspectives/prime-big-deal-days-what-it-added` and `/perspectives/press-releases/kwontified-launches-perspectives-and-the-kwontified-briefing-newsletter`.

All four translations were written by Claude and have not been read by a native speaker. Have each reviewed before it goes live.

## English is the default, everywhere

- Every address without a language prefix is English: `kwontified.com/perspectives` is always the English page, in the United States and anywhere else.
- Nothing switches language automatically. The site does not read the browser's language or the visitor's country, and there is no redirect. A visitor sees another language only by choosing it in the language menu or by following a link to a `/es/`, `/fr/`, `/ko/` or `/zh/` address (for example from a search result in that language).
- For search engines, each translated page names the English page as the default version (`hreflang="x-default"`), so a searcher whose language has no version is sent to English.
- If you later want to offer a language to visitors outside the United States (for example a one-line "Lire en français ?" notice for a browser set to French), that is a separate, small addition. It should be an offer, never a redirect, and it should stay off for United States visitors. It is not built.

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

`code` is the short name used in the address. If browsers and search engines need a more exact name, add `tag`: Chinese uses `"code": "zh", "tag": "zh-Hans"` (Simplified); Traditional Chinese would be a second language, `"code": "zh-tw", "tag": "zh-Hant"`.

Korean, Chinese and Japanese pages get their own type settings automatically, because the site's typeface has no characters for them: the visitor's system typeface for that language (Apple SD Gothic Neo or Malgun Gothic; PingFang SC or Microsoft YaHei), no tightened letter-spacing, taller lines in headings and articles, and line breaks that follow each language's rules. Latin words and figures on those pages stay in the site's typeface.

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

## Notes for the reviewer of each language

Choices the first draft made that a native reviewer should confirm or change (edit the `t` values; nothing else depends on them):

- **Spanish:** "Guías de eventos" for Event playbooks; job titles left in English.
- **French:** "Demander une analyse" for Request a review ("audit" was avoided in case it names a separate offer); "Expertises" for Capabilities, "Réalisations" for Work, "Espace client" for Client sign-in; "Guides des temps forts" for Event playbooks; "Auteur" as the filter label (a generic masculine; "Signature" is the neutral alternative); job titles left in English; "1900 marques" written without a space because the figure check does not accept a space inside a number.
- **Korean:** "아티클" for Article (so it stays distinct from 뉴스); "검토 요청" for Request a review ("진단 요청" is a common agency alternative); "포트폴리오" for Work, "역량" for Capabilities, "글로벌" for International; Black Friday and Cyber Monday in Hangul; author links use full names.
- **Chinese (Simplified):** "大促打法" for Event playbooks ("大促策略" is the more formal alternative); "案例" for Work, "客户案例" for Case studies; "智能体电商" for Agentic commerce, "收入追回" for Revenue Recovery; card and kicker lines use " · " between parts where English uses a full stop.
- **All four:** brand, marketplace, city and people's names stay in English letters. Titles of pieces that are not translated yet stay in English, because the link opens the English page.

Two things the translators noticed in the English that are worth a look: the holiday article says "a ten-week season" for early October to late December (about twelve weeks), and the newsletter press release's search description is cut off mid-sentence ("…its articles on…").

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

1. Which language goes live first, and which Chinese. Spanish, French, Korean and Simplified Chinese are previews (decided 2026-11-27). Simplified was chosen because it reaches the most readers; say if Traditional (Taiwan, Hong Kong) is wanted as well.
2. Who reviews each language before it goes live. Machine-translated pages published at scale without review can hurt a site's standing with search engines, and job titles and names need a human decision (the Spanish and French previews leave "Co-Founder and Managing Partner" in English because titles in those languages are gendered; Korean and Chinese translate it). Brand, marketplace and city names stay in English letters in every language, including Korean and Chinese.
3. How much to translate: Perspectives only, or the main pages as well. A Spanish reader who clicks from an article to Capabilities currently lands on the English page.
