import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/site/CtaBand";
import { Figure } from "@/components/ui/Figure";
import { Stat } from "@/components/ui/Stat";

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
  { label: "Capabilities", value: "Retail Media, Analytics, Creative Studio" },
];

const did = [
  {
    title: "Built audiences in AMC",
    body: "Custom queries on the brand’s own purchase and browsing data produced five segments more precise than standard Amazon audiences: repeat buyers overdue for reorder, browsers who viewed three or more products without buying, shoppers switching from competitor ASINs, lapsed Subscribe and Save subscribers, and in-market prospects from cross-category signals.",
  },
  {
    title: "Matched creative to the funnel",
    body: "Each segment got its own creative sequence. Lifestyle imagery won click-through for prospecting; product-led creative converted better for retargeting and win-back.",
  },
  {
    title: "Measured DSP on its own terms",
    body: "Measurement combined Amazon attribution, AMC path-to-conversion analysis, incremental lift studies and a halo read on organic rank and branded search. Total account revenue grew 19% after DSP launched, and search ROAS did not decline.",
  },
];

const theWork = [
  { label: "Prospecting creative, lifestyle", img: "/work-img/cs-beauty.jpg", caption: "Prospecting: lifestyle imagery for in-market audiences" },
  { label: "Retargeting creative, product-led", img: "/work-img/cs-launch.jpg", caption: "Retargeting: product-led creative for high-intent browsers" },
  { label: "Win-back creative, Subscribe and Save", img: "/work-img/cs-creator.jpg", caption: "Win-back: lapsed subscribers and overdue reorders" },
];

const related = [
  { kicker: "Case study · Amazon", title: "Maintaining 18x ROAS through an organic traffic decline", href: "/work" },
  { kicker: "Case study · Amazon and Target Plus", title: "Growing every channel while diversifying revenue", href: "/work" },
  { kicker: "Perspectives · retail media", title: "Is your Amazon DSP spend incremental?", href: "/perspectives/amazon-dsp-incrementality" },
];

export default function AmazonDspCaseStudy() {
  return (
    <>
      {/* Header */}
      <section className="bg-white">
        <div className="container-kw py-14">
          <nav className="mb-5 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="text-line">/</span>
            <Link href="/work" className="hover:text-ink">Work</Link>
            <span className="text-line">/</span>
            <span className="text-ink">Amazon DSP</span>
          </nav>
          <p className="eyebrow">A national beauty brand · Amazon US</p>
          <h1 className="h-display mt-3 max-w-3xl text-4xl leading-tight text-ink md:text-6xl">
            $1.8M from DSP, with search intact.
          </h1>
          <div className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <div className="text-xs font-normal text-muted">
                  {m.label}
                </div>
                <div className="mt-1 text-sm text-ink">{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-ink text-white">
        <div className="container-kw py-14">
          <p className="eyebrow-light">Results</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Stat value="$1.8M" label="DSP-attributed revenue" tone="dark" />
            <Stat value="9.4x" label="DSP ROAS on $192K of spend" tone="dark" />
            <Stat value="+28%" label="New-to-brand sales" tone="dark" />
            <Stat value="+19%" label="Total account revenue, search ROAS held" tone="dark" />
          </div>
          <p className="mt-8 text-sm text-white/50">
            Launched Q3 2025. Measurement: Amazon attribution, AMC
            path-to-conversion analysis, incremental lift studies and a halo
            analysis on organic rank and branded search.
          </p>
        </div>
      </section>

      {/* The situation */}
      <section className="bg-white">
        <div className="container-kw grid gap-8 py-16 md:grid-cols-[0.8fr_1.2fr]">
          <h2 className="h-display text-3xl text-ink">The situation</h2>
          <p className="prose-kw max-w-2xl text-lg leading-relaxed text-ink-700">
            The brand earned $7.5M a year on Amazon with a mature search program
            at 5.8x ROAS. Search was efficient but close to its ceiling. Growth
            had to come from shoppers who were not yet searching for the
            category.
          </p>
        </div>
      </section>

      {/* What we did */}
      <section className="bg-paper">
        <div className="container-kw py-16">
          <h2 className="h-display text-3xl text-ink">What we did</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {did.map((d) => (
              <div key={d.title} className="rounded-2xl border border-line bg-white p-7">
                <h3 className="text-base font-semibold text-ink">{d.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-700">
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The work */}
      <section className="bg-white">
        <div className="container-kw py-16">
          <h2 className="h-display text-3xl text-ink">The work</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {theWork.map((w) => (
              <div key={w.label}>
                <Figure ratio="4/3" src={w.img} alt={w.label} />
                <p className="mt-2 text-sm text-muted">{w.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-brand-50">
        <div className="container-kw py-16">
          <blockquote className="mx-auto max-w-3xl text-center">
            <p className="h-display text-2xl leading-snug text-ink md:text-3xl">
              “DSP finally gave us growth we could prove — without quietly
              eating the search program we’d spent years building.”
            </p>
            <footer className="mt-5 text-sm text-muted">
              VP of Ecommerce · national beauty brand
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Related */}
      <section className="bg-white">
        <div className="container-kw py-16">
          <h2 className="h-display text-2xl text-ink">Related work and thinking</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.title} href={r.href} className="group">
                <p className="text-xs font-normal text-muted">
                  {r.kicker}
                </p>
                <h3 className="h-display mt-2 text-lg text-ink group-hover:text-brand-700">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
