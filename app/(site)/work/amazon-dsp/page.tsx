import type { Metadata } from "next";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Quote } from "@/components/ui/Quote";
import { StatRow } from "@/components/blocks/StatRow";
import { ImageCard } from "@/components/blocks/ImageCard";
import { PromoBanner } from "@/components/blocks/PromoBanner";

export const metadata: Metadata = {
  title: "$1.8M from DSP, with search intact",
  description:
    "A national beauty brand added Amazon DSP to a mature search program and returned 9.4x DSP ROAS on $192K of spend, with new-to-brand sales up 28% and search ROAS held.",
  alternates: { canonical: "/work/amazon-dsp" },
};

const meta = [
  { label: "Category", value: "Beauty and personal care" },
  { label: "Channel", value: "Amazon DSP, alongside Sponsored Ads" },
  { label: "Launched", value: "Q3 2025" },
  { label: "Capabilities", value: "Retail Media, Analytics, Creative" },
];

const did = [
  { title: "Built audiences in AMC", body: "Custom queries on the brand’s own purchase and browsing data produced five segments more precise than standard Amazon audiences: repeat buyers overdue for reorder, browsers who viewed three or more products without buying, shoppers switching from competitor ASINs, lapsed Subscribe and Save subscribers, and in-market prospects from cross-category signals." },
  { title: "Matched creative to the funnel", body: "Each segment got its own creative sequence. Lifestyle imagery won click-through for prospecting; product-led creative converted better for retargeting and win-back." },
  { title: "Measured DSP on its own terms", body: "Measurement combined Amazon attribution, AMC path-to-conversion analysis, incremental lift studies and a halo read on organic rank and branded search. Total account revenue grew 19% after DSP launched, and search ROAS did not decline." },
];

const theWork = [
  { id: "creative-beauty", caption: "Prospecting: lifestyle imagery for in-market audiences" },
  { id: "creative-skincare", caption: "Retargeting: product-led creative for high-intent browsers" },
  { id: "creative-accessories", caption: "Win-back: lapsed subscribers and overdue reorders" },
];

const related = [
  { href: "/work/walmart-sku-transition", id: "case-walmart", chip: "Walmart", title: "A clean SKU transition, revenue intact." },
  { href: "/work/account-health-restore", id: "case-account-health", chip: "Amazon", title: "A collapsed $6.2M business, restored." },
  { href: "/perspectives/amazon-dsp-incrementality", id: "post-dsp", chip: "Perspectives", title: "Is your Amazon DSP spend incremental?" },
];

export default function AmazonDspCaseStudy() {
  return (
    <>
      {/* Contained cream hero + image */}
      <section className="border-b border-sand-300 bg-cream-50">
        <div className="container-kw py-12 md:py-16">
          <nav className="mb-5 flex items-center gap-2 text-sm text-ink-muted">
            <Link href="/" className="hover:text-navy-900">Home</Link>
            <span className="text-sand-300">/</span>
            <Link href="/work" className="hover:text-navy-900">Work</Link>
            <span className="text-sand-300">/</span>
            <span className="text-navy-900">Amazon DSP</span>
          </nav>
          <p className="eyebrow">A national beauty brand · Amazon US</p>
          <h1 className="h-display mt-4 max-w-3xl text-h1 text-navy-900">$1.8M from DSP, with search intact.</h1>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <div className="text-[12px] font-medium uppercase tracking-[0.12em] text-gold-700">{m.label}</div>
                <div className="mt-1 text-sm text-navy-900">{m.value}</div>
              </div>
            ))}
          </div>
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
            <Img id="case-amazon-dsp" priority sizes="(max-width: 1312px) 100vw, 1312px" position="center" />
          </div>
        </div>
      </section>

      {/* Results (navy) */}
      <section className="bg-navy-900">
        <div className="container-kw py-16">
          <p className="eyebrow-light">Results</p>
          <StatRow
            className="mt-8"
            tone="navy"
            stats={[
              { value: "$1.8M", label: "DSP-attributed revenue" },
              { value: "9.4x", label: "DSP ROAS on $192K of spend" },
              { value: "+28%", label: "New-to-brand sales" },
              { value: "+19%", label: "Total account revenue, search ROAS held" },
            ]}
          />
          <p className="mt-8 text-sm text-white/55">
            Launched Q3 2025. Measurement: Amazon attribution, AMC path-to-conversion analysis,
            incremental lift studies and a halo analysis on organic rank and branded search.
          </p>
        </div>
      </section>

      {/* Reading column */}
      <section className="bg-white">
        <div className="container-kw py-16">
          <div className="mx-auto max-w-[760px]">
            <h2 className="h-display text-h2 text-navy-900">The situation</h2>
            <p className="mt-4 text-body leading-relaxed text-ink-muted">
              The brand earned $7.5M a year on Amazon with a mature search program at 5.8x ROAS.
              Search was efficient but close to its ceiling. Growth had to come from shoppers who
              were not yet searching for the category.
            </p>
            <h2 className="h-display mt-12 text-h2 text-navy-900">What we did</h2>
            <div className="mt-6 space-y-8">
              {did.map((d, i) => (
                <div key={d.title}>
                  <span className="h-display text-h3 text-gold-700">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-1 text-h3 text-navy-900">{d.title}</h3>
                  <p className="mt-2 text-body leading-relaxed text-ink-muted">{d.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The work — faceless creative tiles */}
          <div className="mt-14">
            <h2 className="h-display text-h2 text-navy-900">The work</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {theWork.map((w) => (
                <figure key={w.id}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Img id={w.id} sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                  <figcaption className="mt-2 text-sm text-ink-muted">{w.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote (navy) — shown without attribution until a name is supplied */}
      <section className="bg-navy-900">
        <div className="container-kw py-20">
          <Quote tone="dark">
            “DSP finally gave us growth we could prove — without quietly eating the search program
            we’d spent years building.”
          </Quote>
        </div>
      </section>

      {/* Related (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-16">
          <h2 className="h-display text-h2 text-navy-900">Related work and thinking</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <ImageCard key={r.href} href={r.href} imageId={r.id} ratio="16/9" chip={r.chip} title={r.title} cta="Read" />
            ))}
          </div>
        </div>
      </section>

      <PromoBanner imageId="promo-work" />
    </>
  );
}
