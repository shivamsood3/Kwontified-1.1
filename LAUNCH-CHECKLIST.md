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

## ✅ Done

- Public site built to match the Figma 1.1.1 design (34 pages).
- Real client logos, press logos, social icons + real profile links.
- Real royalty-free category photography across the creative galleries.
- Animated hero carousel matching the prototype.
- Deployed to Vercel (`kwontified` team); Vercel Authentication disabled.
