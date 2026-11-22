import Link from "next/link";
import type { Metadata } from "next";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/site/Button";
import { LogoGrid } from "@/components/ui/LogoMarquee";
import { ResultFinder } from "@/components/sections/ResultFinder";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { clientLogos, pressLogos } from "@/lib/logos";
import { budgetChannelIcons, ui } from "@/lib/icons";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const results = [
  { stat: "+64%", body: "Growth in total Amazon sales for a clinical skincare brand, from $2.90M to $4.76M, after it entered Premium Beauty.", link: "Read the Amazon case study", href: "/work" },
  { stat: "6.8x", body: "Omnichannel return on Walmart display advertising for a baby food supplier, with 62% of attributed sales made in stores.", link: "Read the Walmart case study", href: "/work" },
  { stat: "$781K", body: "Shortage claims recovered for a kitchen appliance vendor on Amazon Vendor Central, with its shortage rate cut 72%.", link: "Read the revenue recovery case study", href: "/capabilities/revenue-recovery" },
];

const pillars = [
  { k: "Measured", img: "home12-pillar-measured", body: "Sponsored ads, DSP, Walmart Connect and Roundel, managed on incremental return and new-to-brand growth, with TACoS held to the plan.", link: "Retail media", href: "/capabilities/retail-media" },
  { k: "Made", img: "home12-pillar-made", body: "Product photography, image editing, AI image and video, A+ Content and Storefronts, finished to your brand’s own standard.", link: "Creative Studio", href: "/capabilities/creative-studio" },
  { k: "Run", img: "home12-pillar-run", body: "Catalog, inventory, 1P and 3P operations, promotions and account health, in every market you sell in.", link: "Marketplace operations", href: "/capabilities/marketplace-operations" },
  { k: "Found", img: "home12-pillar-found", body: "Complete, structured product data, so Claude, ChatGPT, Alexa for Shopping, Walmart Sparky and Google Gemini can recommend your products accurately.", link: "Agentic commerce", href: "/capabilities/ai-commerce" },
  { k: "Reported", img: "home12-pillar-reported", body: "Dashboards and sales, budget and inventory forecasts in conservative, standard and reach scenarios: one version of the numbers for brand managers and the board.", link: "Analytics", href: "/capabilities/analytics" },
  { k: "Recovered", img: "home12-pillar-recovered", body: "Vendor Central shortages, chargebacks and accruals, and Seller Central FBA reimbursements, audited, filed and followed inside Amazon’s claim windows.", link: "Revenue recovery", href: "/capabilities/revenue-recovery" },
];

const oneTeamBullets = [
  "One named team and one inbox for every channel you sell in.",
  "One plan, with sales, margin, advertising and inventory targets you approve.",
  "A weekly update, plus monthly and quarterly business reviews against that plan.",
  "Senior leaders who stay involved long after onboarding.",
];

const channelList = [
  { label: "Amazon Seller Central", sub: "Advertising, content and FBA for 3P sellers", href: "/channels/amazon" },
  { label: "Amazon Vendor Central", sub: "1P margin, fill rates and shortage recovery", href: "/channels/amazon" },
  { label: "Walmart", sub: "Marketplace sellers and suppliers, with Walmart Connect", href: "/channels/walmart" },
  { label: "Target Plus", sub: "Run to Target’s standards, with Roundel", href: "/channels/target-plus" },
  { label: "International", sub: "Amazon in 20+ countries, plus Zalando, Mercado Libre and Temu", href: "/channels/international" },
  { label: "Zalando", sub: "Fashion across Europe’s markets and seasons", href: "/channels/zalando" },
  { label: "Mercado Libre", sub: "Latin America, set up country by country", href: "/channels/mercado-libre" },
  { label: "Temu", sub: "On your brand’s terms, with price floors", href: "/channels/temu" },
  { label: "TikTok Shop", sub: "Creators, shoppable video and GMV Max", href: "/channels/tiktok-shop" },
  { label: "Instagram Shop", sub: "Shoppable content and Meta advertising", href: "/channels/instagram-shop" },
  { label: "AI shopping assistants", sub: "Rufus, ChatGPT, Gemini and Claude", href: "/capabilities/ai-commerce" },
];

const creative = [
  { img: "home12-creative-1", lead: "Cashmere label, Amazon.", rest: " 71% of its first-season allocation sold at full price." },
  { img: "home12-creative-2", lead: "Cosmetics brand, Mercado Libre.", rest: " Infringing listings cut from 312 to 12." },
  { img: "home12-creative-3", lead: "Travel luggage brand, Amazon UK.", rest: " Conversion doubled after its pages were localized." },
  { img: "home12-creative-4", lead: "Outerwear brand, Zalando.", rest: " 78% of winter stock sold with shallower markdowns." },
  { img: "home12-creative-5", lead: "Clinical skincare brand, Amazon US.", rest: " Sales up 64% after entering Premium Beauty." },
];

const posts = [
  { slug: "prime-big-deal-days-what-it-added", img: "art-prime-big-deal-days-what-it-added", meta: "Event playbooks. Amazon. Jordan Taylor. Nov 3, 2026", title: "What Prime Big Deal Days 2026 actually added for brands" },
  { slug: "unauthorized-resellers-distribution-decisions", img: "art-unauthorized-resellers-distribution-decisions", meta: "Operations. All channels. Elaine Kwon. Oct 29, 2026", title: "Unauthorized resellers and the distribution decisions behind them" },
  { slug: "amazon-ad-benchmarks-cheaper-clicks", img: "art-amazon-ad-benchmarks-cheaper-clicks", meta: "Retail media. Amazon. Jordan Taylor. Oct 28, 2026", title: "Amazon ad benchmarks, Q3 2026: cheaper clicks, weaker conversion" },
];

const testimonials = [
  { quote: "The Kwontified Team is incredibly efficient and thorough. From day one they seamlessly integrated with our ecommerce team and were able to immediately address our core issues and execute on a number of opportunities to drive sales growth.", name: "Lisa Raggiri, Vice President of Digital", company: "Dr. Brandt Skincare" },
  { quote: "Kwontified has been a fantastic partner for our brand. They were able to articulate and execute a commercial and marketing strategy that resulted in double digit growth three years in a row. It is a pleasure to work with a company where the whole team is thoughtful and always eager to listen and support.", name: "Emmanuele Vinciguerra, President of the Americas", company: "Vilebrequin" },
];

function Arrow() {
  return <ui.ArrowRight size={16} weight="regular" className="transition-transform group-hover:translate-x-1" aria-hidden="true" />;
}

export default function HomePage() {
  return (
    <>
      {/* 1 — Hero (full-bleed video on desktop, stacked 16:9 on mobile) */}
      <section className="relative w-full overflow-hidden bg-navy-900">
        {/* Text — overlaid left on desktop, above the video on mobile */}
        <div className="relative z-10 container-kw flex flex-col py-12 md:min-h-[620px] md:justify-center md:py-24">
          <div className="max-w-xl">
            <p className="eyebrow-light">Marketplace management for consumer brands, since 2016</p>
            <h1 className="h-display mt-5 text-[clamp(40px,5vw,76px)] leading-[1.02] text-white">
              Measured growth.<br />Beautiful work.
            </h1>
            <p className="mt-6 max-w-lg text-lead text-white/80">
              One senior team runs your Amazon, Walmart, Target Plus and five more marketplaces as a
              single business: plan, advertising, creative and operations. We report every week and
              answer for your sales, return on ad spend and margin.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button href="/contact" variant="primary" size="lg">Request a marketplace review</Button>
              <Link href="/work" className="group inline-flex items-center gap-2 text-[15px] font-medium text-white underline decoration-white/40 underline-offset-[0.22em] hover:decoration-white">
                Read client case studies <Arrow />
              </Link>
            </div>
          </div>
        </div>
        {/* Video — native 16:9 below text on mobile; full-bleed behind on desktop */}
        <div className="relative aspect-video w-full md:absolute md:inset-0 md:z-0 md:aspect-auto md:h-full">
          <HeroVideo />
          {/* desktop scrim so the white copy stays legible over the left */}
          <div
            className="hidden md:block absolute inset-0"
            style={{ background: "linear-gradient(90deg, #102A4Cf5 0%, #102A4Ce0 32%, #102A4C99 52%, #102A4C2e 72%, transparent 100%)" }}
            aria-hidden="true"
          />
        </div>
      </section>

      {/* 2 — Selected clients */}
      <section className="bg-sky-100">
        <div className="container-kw py-16">
          <p className="eyebrow">Selected clients</p>
          <LogoGrid logos={clientLogos} height={26} className="mt-8" />
          <Link href="/work" className="learn-more mt-10">See our work <Arrow /></Link>
        </div>
      </section>

      {/* 3 — Results */}
      <section className="bg-cream-100">
        <div className="container-kw py-20 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-display max-w-2xl text-h2 text-navy-900">Results across channels and markets.</h2>
            <Link href="/work" className="learn-more">See all case studies <Arrow /></Link>
          </div>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {results.map((r) => (
              <div key={r.stat}>
                <p className="text-[clamp(52px,6vw,88px)] font-normal leading-none tracking-tightish text-navy-900">{r.stat}</p>
                <p className="mt-5 text-body leading-relaxed text-ink">{r.body}</p>
                <Link href={r.href} className="group mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-[0.22em] hover:decoration-navy-900">
                  {r.link} <Arrow />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — One team owns the plan and the work */}
      <section className="bg-sky-100">
        <div className="container-kw py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="h-display text-h2 text-navy-900">One team owns the plan and the work.</h2>
              <p className="mt-5 max-w-xl text-body leading-relaxed text-ink">
                Most brands split advertising, creative and operations across separate agencies, then
                lose margin where those plans disagree: ads that drive shoppers to products about to
                stock out, creative briefed without the search data, promotions with no stock behind
                them. We run all of it as one plan, reviewed against one P&amp;L.
              </p>
            </div>
            <div>
              <p className="text-small font-medium text-navy-900">What one team means for you</p>
              <ul className="mt-4 space-y-3">
                {oneTeamBullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-body text-ink">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold-600" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.k}>
                <div className="relative aspect-square w-full overflow-hidden">
                  <Img id={p.img} sizes="(max-width:768px) 100vw, 33vw" />
                </div>
                <h3 className="h-display mt-5 text-[26px] text-navy-900">{p.k}</h3>
                <p className="mt-3 text-body leading-relaxed text-ink">{p.body}</p>
                <Link href={p.href} className="group mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-[0.22em] hover:decoration-navy-900">
                  {p.link} <Arrow />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Mood band */}
      <section className="relative w-full">
        <div className="relative aspect-[1440/560] max-h-[560px] w-full">
          <Img id="home12-mood" sizes="100vw" position="center" />
        </div>
      </section>

      {/* 6 — Every channel under one plan */}
      <section className="bg-cream-100">
        <div className="container-kw grid gap-14 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <h2 className="h-display max-w-md text-h2 text-navy-900">Every channel you sell in, under one plan.</h2>
            <p className="mt-5 max-w-md text-body leading-relaxed text-ink">
              We manage every marketplace as one business. Spend moves between channels on measured
              return, catalog work is done once and adapted, and reporting shows the whole P&amp;L in
              one view.
            </p>
            <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {channelList.map((c) => {
                const Icon = budgetChannelIcons[c.label];
                return (
                  <Link key={c.label} href={c.href} className="group flex gap-3">
                    {Icon && <Icon size={22} weight="light" className="mt-0.5 shrink-0 text-navy-900" aria-hidden="true" />}
                    <span>
                      <span className="block text-[15px] font-medium text-navy-900 group-hover:text-gold-700">{c.label}</span>
                      <span className="mt-0.5 block text-caption text-ink-muted">{c.sub}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="lg:pl-8">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Img id="home12-channels" sizes="(max-width:1024px) 100vw, 50vw" />
            </div>
            <p className="mt-2 text-caption text-ink-faint">Illustrative data.</p>
            <p className="mt-8 text-[clamp(44px,5vw,72px)] font-normal leading-none tracking-tightish text-navy-900">9 weeks</p>
            <p className="mt-4 max-w-sm text-body text-ink">To take a bedding brand live on Target Plus, with 97% of its items approved first time.</p>
            <Link href="/capabilities/analytics" className="group mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-navy-900 underline decoration-navy-900/30 underline-offset-[0.22em] hover:decoration-navy-900">
              How we report across channels <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* 7 — Creative */}
      <section className="bg-sky-100">
        <div className="container-kw py-20 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-display text-h2 text-navy-900">Creative that sells, still on brand.</h2>
            <Link href="/work/creative" className="learn-more">See the Creative Studio <Arrow /></Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-5">
            {creative.map((c) => (
              <figure key={c.img}>
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Img id={c.img} sizes="(max-width:768px) 50vw, 20vw" />
                </div>
                <figcaption className="mt-3 text-caption leading-snug text-ink">
                  <span className="font-medium text-navy-900">{c.lead}</span>{c.rest}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — Perspectives */}
      <section className="bg-cream-100">
        <div className="container-kw py-20 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-display text-h2 text-navy-900">What we’re seeing in the market.</h2>
            <Link href="/perspectives" className="learn-more">All Perspectives <Arrow /></Link>
          </div>
          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <Link href="/perspectives/holiday-2026-season-starts-in-october" className="group block">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Img id="art-holiday-2026-season-starts-in-october" sizes="(max-width:1024px) 100vw, 50vw" className="transition-transform duration-500 group-hover:scale-[1.02]" />
              </div>
              <p className="mt-4 text-caption text-ink-muted">Event playbooks. All channels. Elaine Kwon. Nov 5, 2026</p>
              <h3 className="h-display mt-2 text-[28px] leading-tight text-navy-900 group-hover:text-gold-700">Holiday 2026: the season now starts in October</h3>
              <p className="mt-2 max-w-lg text-body text-ink-muted">The 2026 holiday season now runs from early October to late December. What the forecasts show, how the season stretched, and how to plan each of its phases.</p>
            </Link>
            <div className="flex flex-col divide-y divide-sand-300 border-t border-sand-300">
              {posts.map((p) => (
                <Link key={p.title} href={`/perspectives/${p.slug}`} className="group flex gap-5 py-5 first:pt-6">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden">
                    <Img id={p.img} sizes="96px" />
                  </div>
                  <div>
                    <p className="text-caption text-ink-muted">{p.meta}</p>
                    <h3 className="mt-1 text-[19px] leading-snug text-navy-900 group-hover:text-gold-700">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9 — Featured in */}
      <section className="bg-sky-100">
        <div className="container-kw py-16">
          <p className="eyebrow">Featured in</p>
          <LogoGrid logos={pressLogos} height={24} className="mt-8" />
          <Link href="/perspectives" className="learn-more mt-10">See all press <Arrow /></Link>
        </div>
      </section>

      {/* 10 — What clients say */}
      <section className="bg-cream-100">
        <div className="container-kw py-20 lg:py-28">
          <h2 className="h-display text-h2 text-navy-900">What clients say</h2>
          <div className="mt-12 grid gap-12 md:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.name}>
                <blockquote className="text-lead leading-relaxed text-ink">“{t.quote}”</blockquote>
                <figcaption className="mt-6 text-small">
                  <span className="block font-medium text-navy-900">{t.name}</span>
                  <span className="block text-ink-muted">{t.company}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — Result finder */}
      <section className="bg-sky-100">
        <div className="container-kw py-20 lg:py-28">
          <ResultFinder />
        </div>
      </section>

      {/* 12 — FAQ */}
      <section className="bg-sky-50">
        <div className="container-kw py-20 lg:py-28">
          <FaqAccordion />
        </div>
      </section>
    </>
  );
}
