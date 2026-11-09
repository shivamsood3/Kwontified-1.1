import Link from "next/link";
import { CtaBand } from "@/components/site/CtaBand";
import { Figure } from "@/components/ui/Figure";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResultFinder } from "@/components/sections/ResultFinder";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { LogoCloud } from "@/components/site/LogoCloud";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const stats = [
  {
    value: "+19%",
    title: "Walmart revenue",
    body: "Combined Walmart revenue for a consumer health brand through a major SKU transition, with supplier ROAS up from 3.0x to 4.2x.",
    link: { href: "/work", label: "Read the Walmart case study" },
    before: 74,
    after: 100,
  },
  {
    value: "$1.4M",
    title: "International revenue",
    body: "International revenue across the UK, EU and Canada for a premium fashion brand that had sold only in the US.",
    link: { href: "/work", label: "Read the international case study" },
    before: 6,
    after: 100,
  },
  {
    value: "$6.2M",
    title: "Amazon business, restored",
    body: "A leading CPG brand’s collapsed $6.2M Amazon business, restored, with annualized revenue up 68%.",
    link: { href: "/work", label: "Read the account health case study" },
    before: 60,
    after: 100,
  },
];

const oneTeam = [
  { k: "Measured", cap: "Retail media", href: "/capabilities/retail-media", desc: "Sponsored ads, DSP, Walmart Connect and Roundel, managed on incremental return and new-to-brand growth, with TACoS held to the plan.", connect: "Budgets ease off before a product stocks out, so ads never send shoppers to an empty listing." },
  { k: "Made", cap: "Creative Studio", href: "/capabilities/creative-studio", desc: "Product photography, image editing, AI image and video, A+ Content and Storefronts, finished to your brand’s own standard.", connect: "Briefs start from the search terms and conversion data the advertising team reads every day." },
  { k: "Run", cap: "Marketplace operations", href: "/capabilities/marketplace-operations", desc: "Catalog, inventory, 1P and 3P operations, promotions and account health, in every market you sell in.", connect: "Promotions are planned with the stock to support them and the advertising to drive them." },
  { k: "Found", cap: "AI commerce", href: "/capabilities/ai-commerce", desc: "Complete, structured product data, so Amazon Rufus, ChatGPT, Google Gemini and Claude can recommend your products accurately.", connect: "Built on the catalog the operations team already maintains, so nothing is written twice." },
  { k: "Reported", cap: "Analytics", href: "/capabilities/analytics", desc: "Dashboards and sales, budget and inventory forecasts in conservative, standard and reach scenarios: one version of the numbers for brand managers and the board.", connect: "Advertising, stock and promotions all plan to the same forecast." },
  { k: "Recovered", cap: "Revenue recovery", href: "/capabilities/revenue-recovery", desc: "Vendor Central shortages, chargebacks and accruals, and Seller Central FBA reimbursements, audited, filed and followed inside Amazon’s claim windows.", connect: "The operations team fixes the causes, so the same losses stop coming back." },
];

const oneTeamBullets = [
  "One named team and one inbox for every channel you sell in.",
  "One plan, with sales, margin, advertising and inventory targets you approve.",
  "A weekly update, plus monthly and quarterly business reviews against that plan.",
  "Senior leaders who stay involved long after onboarding.",
];

const budgetChannels = [
  { label: "Amazon Seller Central", sub: "Advertising, content and FBA for 3P sellers", href: "/channels/amazon" },
  { label: "Amazon Vendor Central", sub: "1P margin, fill rates and shortage recovery", href: "/channels/amazon" },
  { label: "Walmart", sub: "Marketplace sellers and suppliers, with Walmart Connect", href: "/channels/walmart" },
  { label: "Target Plus", sub: "Run to Target’s standards, with Roundel", href: "/channels/target-plus" },
  { label: "International", sub: "Canada, Mexico, the UK and the EU", href: "/channels/international" },
  { label: "Zalando", sub: "Fashion across Europe’s markets and seasons", href: "/channels/zalando" },
  { label: "Mercado Libre", sub: "Latin America, set up country by country", href: "/channels/mercado-libre" },
  { label: "Temu", sub: "On your brand’s terms, with price floors", href: "/channels/temu" },
  { label: "TikTok Shop", sub: "Creators, shoppable video and GMV Max", href: "/channels/tiktok-shop" },
  { label: "Instagram Shop", sub: "Shoppable content and Meta advertising", href: "/channels/instagram-shop" },
  { label: "AI shopping assistants", sub: "Rufus, ChatGPT, Gemini and Claude", href: "/capabilities/ai-commerce" },
];

const creative = [
  { label: "DSP creative, beauty brand", caption: "National beauty brand, Amazon DSP. +28% new-to-brand sales.", img: "/creative/beauty.jpg", ratio: "4/3" as const, span: "md:col-span-2" },
  { label: "Main image set, accessories brand", caption: "Global accessories, Amazon and Target Plus. 11.1x Amazon ROAS on 17% less spend.", img: "/creative/accessories.jpg", ratio: "1/1" as const, span: "" },
  { label: "Storefront hero, luxury swimwear", caption: "Luxury swimwear, Amazon US, EU and UK. +204% over three years, without discounting.", img: "/creative/swimwear.jpg", ratio: "1/1" as const, span: "" },
  { label: "Lifestyle, men’s outdoor apparel", caption: "Men’s outdoor apparel, Amazon launch. $4.5M in the first nine months.", img: "/creative/outdoor.jpg", ratio: "4/3" as const, span: "md:col-span-2" },
  { label: "Main image test, premium skincare", caption: "Premium skincare, Amazon US. Conversion from 8.2% to 12.1%, worth $4.2M.", img: "/creative/skincare.jpg", ratio: "4/3" as const, span: "md:col-span-2" },
];

const perspectives = [
  { kicker: "Retail media · Amazon · Priyanka Shah", title: "Is your Amazon DSP spend incremental?", body: "Attributed ROAS shows what DSP touched. Lift studies and AMC path analysis show what it caused.", href: "/perspectives/amazon-dsp-incrementality" },
  { kicker: "AI commerce · Amazon · Jordan Taylor", title: "What Rufus reads on a listing, and what it ignores", body: "How shopping assistants parse your detail page — and the fields that decide the answer.", href: "/perspectives" },
  { kicker: "Creative and conversion · Amazon", title: "What moved conversion from 8.2% to 12.1%", body: "The image tests and A+ modules behind a premium skincare brand’s conversion lift.", href: "/perspectives" },
  { kicker: "Operations · Amazon Vendor Central", title: "The five Vendor Central chargeback causes that cost the most", body: "Where 1P deductions come from, and how to stop them at the source.", href: "/perspectives" },
];

const press = [
  { name: "GeekWire", file: "/press/geekwire.png" },
  { name: "Total Retail", file: "/press/total-retail.png" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero carousel */}
      <HeroCarousel />

      {/* Results across channels and markets */}
      <section className="bg-ink text-white">
        <div className="container-kw border-t border-white/10 py-16">
          <SectionHeading
            tone="dark"
            eyebrow="Results"
            title="Results across channels and markets."
            intro="Every figure comes from an account we run and has a published case study behind it."
            link={{ href: "/work", label: "See all case studies" }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {stats.map((s) => (
              <div key={s.value} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                <div className="h-display text-5xl text-white">{s.value}</div>
                <div className="mt-1 text-sm font-medium text-white/80">{s.title}</div>
                <div className="mt-6 flex items-end gap-3" aria-hidden="true">
                  <Bar h={s.before} label="Before" />
                  <Bar h={s.after} label="After" accent />
                </div>
                <p className="mt-6 text-sm leading-relaxed text-white/60">{s.body}</p>
                <Link href={s.link.href} className="mt-4 inline-flex items-center gap-1 text-sm text-brand-300 transition hover:text-white">
                  {s.link.label}
                  <ArrowRight small />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo cloud */}
      <section className="border-b border-line bg-white">
        <div className="container-kw py-14">
          <LogoCloud heading="Selected clients" />
        </div>
      </section>

      {/* One team owns the plan and the work */}
      <section className="bg-white">
        <div className="container-kw grid gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SectionHeading
              eyebrow="One team"
              title="One team owns the plan and the work."
              intro="Most brands split advertising, creative and operations across separate agencies, then lose margin where those plans disagree: ads that drive shoppers to products about to stock out, creative briefed without the search data, promotions with no stock behind them. We run all of it as one plan, reviewed against one P&L."
            />
            <div className="mt-8">
              <p className="text-xs font-normal text-muted">
                What one team means for you
              </p>
              <ul className="mt-4 space-y-3">
                {oneTeamBullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[0.975rem] text-ink-700">
                    <Check />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="divide-y divide-line border-y border-line">
            {oneTeam.map((r) => (
              <div key={r.k} className="py-7">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="h-display text-xl text-ink">{r.k}</h3>
                  <Link href={r.href} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                    {r.cap}
                  </Link>
                </div>
                <p className="mt-3 text-[0.975rem] leading-relaxed text-ink-700">{r.desc}</p>
                <p className="mt-3 rounded-lg bg-paper px-4 py-2.5 text-sm text-muted">
                  <span className="font-semibold text-ink">How it connects. </span>
                  {r.connect}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Budget goes where it earns most */}
      <section className="bg-paper">
        <div className="container-kw py-20">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
            <div>
              <SectionHeading
                eyebrow="Where we operate"
                title="Budget goes where it earns most."
                intro="We manage every marketplace as one business. Spend moves between channels on measured return, catalog work is done once and adapted, and reporting shows the whole P&L in one view."
              />
              <div className="mt-8 rounded-2xl border border-line bg-white p-6">
                <div className="h-display text-4xl text-brand-600">5.0x to 6.8x</div>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Amazon ROAS for a natural oral care brand after we consolidated
                  reporting across Amazon and Walmart, with Amazon ad spend down 29%.
                </p>
                <Link href="/capabilities/analytics" className="link-underline mt-3 text-sm">
                  How we report across channels
                  <ArrowRight small />
                </Link>
              </div>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {budgetChannels.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="group bg-white px-5 py-4 transition hover:bg-brand-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.95rem] font-semibold text-ink group-hover:text-brand-700">
                      {c.label}
                    </span>
                    <ArrowRight small className="text-line transition group-hover:text-brand-500" />
                  </div>
                  <p className="mt-1 text-xs leading-snug text-muted">{c.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Creative that sells */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <SectionHeading
            eyebrow="Creative Studio"
            title="Creative that sells, still on brand."
            intro="Photography, video, A+ Content and Storefronts built from the conversion data — then measured on what they do to the numbers."
            link={{ href: "/work/creative", label: "See the Creative Studio" }}
          />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
            {creative.map((c) => (
              <div key={c.label} className={c.span}>
                <Figure ratio={c.ratio} src={c.img} alt={c.label} />
                <p className="mt-2 text-sm text-muted">{c.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perspectives */}
      <section className="bg-ink text-white">
        <div className="container-kw py-20">
          <SectionHeading
            tone="dark"
            eyebrow="Perspectives"
            title="What we’re seeing in the market."
            link={{ href: "/perspectives", label: "All Perspectives" }}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {perspectives.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                <span className="text-[0.7rem] font-normal text-brand-300">
                  {p.kicker}
                </span>
                <h3 className="h-display mt-3 text-lg text-white">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{p.body}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-brand-300 transition group-hover:text-white">
                  Read
                  <ArrowRight small />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured in */}
      <section className="border-b border-line bg-white">
        <div className="container-kw py-12">
          <p className="text-center text-sm text-muted">Featured in</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-16 gap-y-6">
            {press.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.name}
                src={p.file}
                alt={p.name}
                className="h-7 w-auto max-w-[190px] object-contain opacity-80 transition hover:opacity-100"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <figure className="mx-auto max-w-3xl text-center">
            <blockquote className="h-display text-2xl leading-snug text-ink md:text-3xl">
              “We finally have one team that owns the plan, the ads and the
              operations, and reports all of it against our margin.”
            </blockquote>
            <figcaption className="mt-6 text-sm text-muted">
              <span className="font-semibold text-ink">VP of Ecommerce</span> ·
              skincare brand
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Result finder */}
      <section className="bg-paper">
        <div className="container-kw py-20">
          <ResultFinder />
        </div>
      </section>

      <CtaBand />
    </>
  );
}

function Bar({ h, label, accent }: { h: number; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <div className="flex h-24 w-full items-end">
        <div
          className={`w-full rounded-t ${accent ? "bg-accent" : "bg-white/20"}`}
          style={{ height: `${h}%` }}
        />
      </div>
      <span className="text-[0.7rem] text-white/50">{label}</span>
    </div>
  );
}

function ArrowRight({ className, small }: { className?: string; small?: boolean }) {
  const s = small ? 13 : 16;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0 text-brand-500" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
