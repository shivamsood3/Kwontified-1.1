import Link from "next/link";
import { Button } from "@/components/site/Button";
import { CtaBand } from "@/components/site/CtaBand";
import { Figure } from "@/components/ui/Figure";
import { Stat } from "@/components/ui/Stat";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResultFinder } from "@/components/sections/ResultFinder";
import { capabilities } from "@/lib/nav";

const stats = [
  { value: "9.4x", label: "DSP ROAS", sub: "National beauty brand, search ROAS held", href: "/work/amazon-dsp" },
  { value: "+47%", label: "New-to-brand sales", sub: "Year-over-year, luxury swimwear on Amazon", href: "/work" },
  { value: "$14.0M", label: "Annual revenue recovered", sub: "Vendor account, PO fill rate up to 92%", href: "/capabilities/revenue-recovery" },
];

const brands = ["Timberland", "Kipling", "TULA", "The Honest Co.", "Verman", "Burt’s Bees"];

const pillars = [
  {
    kicker: "Measured",
    title: "We read the numbers.",
    body: "Retail media and analytics judged on incremental return, not last-click ROAS. One data set connects spend to revenue across every channel.",
    href: "/capabilities/retail-media",
    label: "Retail Media and Analytics",
  },
  {
    kicker: "Made",
    title: "We make the work.",
    body: "Creative strategy, product photography, A+ Content, Storefronts and video for each platform — briefed from the conversion data, on brand.",
    href: "/capabilities/creative-studio",
    label: "Creative Studio",
  },
  {
    kicker: "Run",
    title: "We run the operation.",
    body: "Catalog, inventory, pricing and compliance, 1P and 3P, plus shortage and chargeback recovery — the operations that protect margin.",
    href: "/capabilities/marketplace-operations",
    label: "Marketplace Operations",
  },
];

const budgetChannels = [
  { label: "Amazon Seller Central", href: "/channels/amazon" },
  { label: "Amazon Vendor Central", href: "/channels/amazon" },
  { label: "Walmart", href: "/channels/walmart" },
  { label: "Target Plus", href: "/channels/target-plus" },
  { label: "Zalando", href: "/channels/zalando" },
  { label: "Mercado Libre", href: "/channels/mercado-libre" },
  { label: "Temu", href: "/channels/temu" },
  { label: "TikTok Shop", href: "/channels/tiktok-shop" },
  { label: "Instagram Shop", href: "/channels/instagram-shop" },
  { label: "AI shopping assistants", href: "/capabilities/ai-commerce" },
];

const creative = [
  { label: "Storefront refresh — national beauty brand", ratio: "4/3" as const, span: "md:col-span-2" },
  { label: "A+ comparison modules — electronics", ratio: "1/1" as const, span: "" },
  { label: "Product photography — skincare line", ratio: "1/1" as const, span: "" },
  { label: "DSP video — luxury swimwear", ratio: "4/3" as const, span: "md:col-span-2" },
];

const perspectives = [
  {
    kicker: "Retail media · Amazon",
    title: "Is your Amazon DSP spend incremental?",
    body: "A method for separating incremental revenue from reach you were already getting.",
    href: "/perspectives/amazon-dsp-incrementality",
  },
  {
    kicker: "Operations · Target Plus",
    title: "What Target Plus’ invitation requires — and how to keep it.",
    body: "The standards Target Plus holds sellers to, and how to run to them.",
    href: "/perspectives",
  },
  {
    kicker: "Analytics",
    title: "TACoS or ROAS: which number to run an Amazon business on.",
    body: "Why the metric you optimise decides the business you build.",
    href: "/perspectives",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="hero-texture absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 110% at 78% -5%, rgba(43,148,219,0.30), transparent 55%)",
          }}
          aria-hidden="true"
        />
        <div className="container-kw relative grid gap-12 py-20 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="eyebrow-light">Ecommerce, simplified</p>
            <h1 className="h-display mt-4 text-5xl leading-[1.03] md:text-7xl">
              Measured growth.
              <br />
              Beautiful work.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Kwontified runs Amazon, Walmart, Target Plus and global
              marketplaces for brands — advertising, creative, operations and
              analytics under one team that reads the numbers and makes the work
              that moves them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/contact" variant="light" size="lg">
                Request a marketplace review
              </Button>
              <Button href="/work" variant="outline-light" size="lg">
                See our work
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              What one team runs
            </p>
            <ul className="mt-4 divide-y divide-white/10">
              {capabilities.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="group flex items-center justify-between gap-4 py-3 text-[0.975rem] font-medium text-white/85 transition hover:text-white"
                  >
                    {c.label}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-accent"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Results row */}
        <div className="relative border-t border-white/10">
          <div className="container-kw py-12">
            <p className="eyebrow-light">Results from accounts we run</p>
            <div className="mt-6 grid gap-8 sm:grid-cols-3">
              {stats.map((s) => (
                <Link key={s.label} href={s.href} className="group block">
                  <Stat value={s.value} label={s.label} sub={s.sub} tone="dark" />
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-300 transition group-hover:text-white">
                    Read the case study
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Logo cloud */}
      <section className="border-b border-line bg-white">
        <div className="container-kw py-12">
          <p className="text-center text-sm text-muted">
            Trusted by leading brands for over a decade
          </p>
          <div className="mt-6 grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
            {brands.map((b) => (
              <div
                key={b}
                className="text-center text-base font-semibold tracking-tight text-slate-400"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One team owns the plan and the work */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <SectionHeading
            eyebrow="One team"
            title="One team owns the plan and the work."
            intro="Many brands split ecommerce across agencies and internal teams — advertising in one place, catalog in another, reporting somewhere else. We consolidate all of it under one roof, so media, creative and operations never work against each other."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.kicker}
                className="flex flex-col rounded-2xl border border-line bg-paper p-7 transition hover:shadow-card"
              >
                <span className="eyebrow">{p.kicker}</span>
                <h3 className="h-display mt-3 text-xl text-ink">{p.title}</h3>
                <p className="mt-3 flex-1 text-[0.975rem] leading-relaxed text-slate-600">
                  {p.body}
                </p>
                <Link href={p.href} className="link-underline mt-5 text-sm">
                  {p.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Budget goes where it earns most */}
      <section className="bg-paper">
        <div className="container-kw grid gap-12 py-20 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <SectionHeading
              eyebrow="Where we operate"
              title="Budget goes where it earns most."
              intro="We maintain certified, platform-specific expertise for each marketplace, and move budget across channels based on where the next dollar returns — because the same team manages all of them."
              link={{ href: "/channels", label: "All channels" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {budgetChannels.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="group flex items-center justify-between gap-3 bg-white px-5 py-4 text-[0.95rem] font-medium text-ink transition hover:bg-brand-50"
              >
                {c.label}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-line transition group-hover:text-brand-500" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
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
            link={{ href: "/work/creative", label: "See the Creative Book" }}
          />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
            {creative.map((c) => (
              <div key={c.label} className={c.span}>
                <Figure ratio={c.ratio} label={c.label} />
                <p className="mt-2 text-sm text-muted">{c.label}</p>
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
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {perspectives.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/25 hover:bg-white/[0.06]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">
                  {p.kicker}
                </span>
                <h3 className="h-display mt-3 text-xl text-white">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
                  {p.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-brand-300 transition group-hover:text-white">
                  Read
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
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
              national beauty brand
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
