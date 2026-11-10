# Kwontified 1.1 — Pre-launch checklist

Items to resolve before taking the site live.

## ⏳ Pending

- [ ] **Wire contact + newsletter forms to the real inbox (`hello@kwontified.com`).**
  The forms submit to `/api/contact` and `/api/subscribe`, which currently log
  server-side and forward to a webhook **only if** `CONTACT_WEBHOOK_URL` /
  `NEWSLETTER_WEBHOOK_URL` are set in Vercel. Decide delivery:
  - **Option A (recommended):** send directly from the API routes via an email
    provider (Resend / SendGrid / SMTP) using a key in Vercel env vars.
  - **Option B (quick):** set both env vars to
    `https://formsubmit.co/ajax/hello@kwontified.com` (needs a one-time
    activation click in that inbox; routes through a third party).

- [ ] **Confirm all figures with client-approved numbers.** Stats and
  case-study results across the site (ROAS, revenue, growth %) are
  representative examples from the Figma design and should be replaced with
  signed-off client numbers before launch.
- [ ] **(Optional) Swap in client brand photography.** All imagery is
  top-notch royalty-free (CC0) stock chosen per category; replace with the
  client's own product/creative photography if/when available.

- [ ] **Verify in Search Console / Bing + submit sitemap.** Add the
  verification meta tag (or DNS record) for `kwontified.com`, then submit
  `https://kwontified.com/sitemap.xml`. (Needs the client's accounts.)

## ✅ Done — Round 2 (AntiAlias QA, 9 Nov 2026)

**P0**
- Hero CTAs use the standard blue `primary` button (secondary = transparent/white-border); white button kept only on the blue CTA band, hover → ink-100. No light-blue button fills anywhere.
- Mega-menu: fixed the hover dead zone (single hover container, full-height trigger, `pt-2` bridge, 120ms open / 200ms close intent, instant switch), keyboard + Esc + outside-click + touch support, square popover with ink-300 border and shadow-pop at full container width, plus a featured case-study rail.
- Results numbers corrected: Walmart $2.83M→$3.38M; account-health shows Stats ($6.2M restored, +68%) not bars. All three cards now derive from a single source (`lib/data/metrics.ts`) so they can't drift from the case studies.
- Logo replaced with the exact prototype wordmark SVG (header, footer, favicon `app/icon.svg`, OG image, apple-touch-icon all regenerated).
- No square-bracket placeholders render anywhere; testimonial shows without attribution; a build step (`scripts/check-placeholders.mjs`) fails the build if any `[Name]`-style placeholder reaches rendered HTML.
- Invented Perspectives authors/read-times removed (only the DSP guide keeps its byline).

**P1**
- New `/work/vendor-central-recovery` case study (ResultFinder + work grid point to it).
- Three Perspectives posts created as "full article coming soon" pages; `/thank-you`, `/work/gallery`, and `/perspectives/authors/[priyanka-shah|jordan-taylor]` added and in the sitemap.
- Footer social icons are monochrome (ink-700 → blue-600), no brand colours.
- Creative grid row equalised (no dead space), swimwear crop fixed, metric chips no longer wrap.
- Perspectives featured visual is now an on-palette lift-study chart, not the duplicated photo.
- All six hero slides are charcoal with dark chart panels.
- Capability "other capabilities" cards show labelled metrics; the case-study panel upgraded to a Stat + summary + before/after chart.
- Mega-menu descriptors now match site copy word-for-word.

**P2**
- Client/press logos normalised into a uniform responsive box (32×120 mobile / 40×150 desktop, object-contain).
- Channels: 11th item spans both columns as a highlighted row; list arrows darkened to ink-500.
- Hero H1 is always "Measured growth. Beautiful work." (home slide visible; other slides keep it as an sr-only H1 and use H2 for their titles).
- Major homepage sections use 120px desktop section padding.
- Font: no web-font loads (so no layout shift); Neue Haas remains a `TODO(licence)`.

## ✅ Done

- Public site built to match the Figma 1.1.1 design (34 pages).
- Technical SEO / AEO / GEO: JSON-LD structured data (Organization, WebSite,
  BreadcrumbList, FAQPage, Article, Person, Service), per-page canonicals,
  Open Graph + Twitter cards, sitemap.xml, robots.txt (AI crawlers explicitly
  allowed), `llms.txt`, web manifest, and rich-result robots directives.
- Real client logos, press logos, social icons + real profile links.
- Real royalty-free category photography across the creative galleries.
- Animated hero carousel matching the prototype.
- **Final Build Brief (§3–§11) executed:** design-token palette + square
  geometry + weight-400 headings applied site-wide; component library (§4)
  with IconTile, Chip, Callout, Quote, Stat, BeforeAfterBars, Card, ListRow,
  Field, LogoMarquee/Grid; styleguide at `/styleguide`.
- Hero carousel (§7.2): exactly one `<h1>` in the DOM on every slide, tab
  progress bars, IconTiles on slide 1, slide-6 "incremental lift" overflow
  fixed; auto-rotation + reduced-motion handling.
- Header (§7.1): mega-menu with IconTiles, sticky shrink-on-scroll.
- Footer (§7.12): phone/email/office icons (MapPin), social links hidden
  without a URL, Accessibility link → `/accessibility`.
- Case-study detail template wired (`/work/[slug]`): Walmart, International,
  account-health — linked from the homepage results, ResultFinder and the
  `/work` grid (previously 404 / linked to `/work`).
- `/accessibility` statement page (WCAG 2.2 AA commitment).
- Inner-page parity (§8): IconTiles on capability + channel templates; full
  32-client logo grid on `/about` and `/work`; sitemap updated.
- QA (§10): verified one `<h1>` per page and no horizontal scroll at 375px
  across home, work, case study, capability, channel, about, accessibility;
  production build clean (47 routes).
- Deployed to Vercel (`kwontified` team); Vercel Authentication disabled.
