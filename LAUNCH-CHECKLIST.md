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
