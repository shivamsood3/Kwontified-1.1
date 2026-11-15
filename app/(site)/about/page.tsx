import type { Metadata } from "next";
import { CollageHero } from "@/components/blocks/CollageHero";
import { MoodBand } from "@/components/blocks/MoodBand";
import { ImageCard } from "@/components/blocks/ImageCard";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { StatRow } from "@/components/blocks/StatRow";
import { Button } from "@/components/site/Button";
import { LogoGrid } from "@/components/ui/LogoMarquee";
import { clientLogos } from "@/lib/logos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Kwontified is built by marketplace operators — people who have managed marketplace businesses firsthand across platforms, countries and stages of growth.",
  alternates: { canonical: "/about" },
};

const caseCards = [
  { href: "/work/walmart-sku-transition", id: "case-walmart", chip: "Walmart", title: "A clean SKU transition, revenue intact.", excerpt: "Combined revenue up 19% through a major SKU transition." },
  { href: "/work/international-expansion", id: "case-international", chip: "UK · EU · CA", title: "$1.4M international, from a US-only start.", excerpt: "One localized catalog, three new regions." },
  { href: "/work/account-health-restore", id: "case-account-health", chip: "Amazon", title: "A collapsed $6.2M business, restored.", excerpt: "147 listings restored, revenue up 68%." },
];

export default function AboutPage() {
  return (
    <>
      <CollageHero
        eyebrow="About"
        title="Built by marketplace operators."
        intro="Every member of our leadership team has managed marketplace businesses firsthand — across platforms, countries and stages of growth."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        ids={["about-a", "about-b", "about-c", "about-d"]}
      />

      {/* Our mission (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw grid gap-12 py-20 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Our mission</p>
            <h2 className="h-display mt-4 text-h2 text-navy-900">Run your business the way we ran ours.</h2>
          </div>
          <div className="prose-kw space-y-4 text-body">
            <p>
              Our leaders ran Amazon Fashion’s luxury goods P&amp;L across 150+ brands, led an
              Amazon category in North America, ran a $50M+ brand portfolio and built a
              seven-figure brand on Amazon and Walmart.
            </p>
            <p>
              We run your marketplace business the way we ran those — one team, one plan,
              and every decision made from your own account data and held to the standard
              your brand holds itself to.
            </p>
          </div>
        </div>
      </section>

      {/* A quantifiable difference (beige) */}
      <section className="bg-cream-100">
        <div className="container-kw py-20">
          <p className="eyebrow">A quantifiable difference</p>
          <h2 className="h-display mt-4 max-w-2xl text-h2 text-navy-900">
            Operators who have carried the P&amp;L you’re handing us.
          </h2>
          <StatRow
            className="mt-12"
            stats={[
              { value: "150+", label: "Brands run across Amazon Fashion luxury" },
              { value: "$50M+", label: "Brand portfolio managed" },
              { value: "3", label: "Offices, one team" },
            ]}
          />
        </div>
      </section>

      <MoodBand id="about-band" />

      {/* Case studies (white) */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <h2 className="h-display text-h2 text-navy-900">Proof from accounts we run.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {caseCards.map((c) => (
              <ImageCard key={c.href} href={c.href} imageId={c.id} ratio="16/9" chip={c.chip} title={c.title} excerpt={c.excerpt} cta="Read case study" />
            ))}
          </div>
        </div>
      </section>

      {/* Three offices + clients (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <h2 className="h-display text-h2 text-navy-900">Three offices, one team.</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {site.offices.map((o) => (
                <div key={o.label}>
                  <h3 className="h-display text-h3 text-navy-900">{o.label}</h3>
                  {o.note && <p className="text-xs text-gold-700">{o.note}</p>}
                  <div className="mt-2 text-small leading-relaxed text-ink-muted">
                    {o.lines.map((l) => (
                      <span key={l} className="block">{l}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-14">
            <h3 className="h-display text-h3 text-navy-900">Brands we have grown.</h3>
            <LogoGrid logos={clientLogos} boxed className="mt-8" />
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/about/leadership" variant="outline" arrow>Meet the leadership</Button>
            <Button href="/about/careers" variant="outline" arrow>See open roles</Button>
          </div>
        </div>
      </section>

      <PromoBanner imageId="promo-about" />
    </>
  );
}
