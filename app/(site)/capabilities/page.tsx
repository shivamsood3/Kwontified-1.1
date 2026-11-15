import type { Metadata } from "next";
import Link from "next/link";
import { CollageHero } from "@/components/blocks/CollageHero";
import { ImageCard } from "@/components/blocks/ImageCard";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { MarketplaceLogo } from "@/components/ui/MarketplaceLogo";
import { capImage } from "@/lib/content/imageMap";
import { capabilitiesContent } from "@/lib/content/capabilities";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Six capabilities, one team: retail media, creative, operations, analytics, AI commerce and revenue recovery — all sharing one plan and one data set.",
  alternates: { canonical: "/capabilities" },
};

const logoSlugs = ["amazon", "walmart", "target-plus", "zalando", "tiktok-shop", "instagram-shop"];

export default function CapabilitiesOverview() {
  return (
    <>
      <CollageHero
        eyebrow="Capabilities"
        title="Six capabilities, one team."
        intro="Each capability is staffed by specialists. All six share one plan, one data set and one account lead — so media, creative and operations never work against each other."
        crumbs={[{ label: "Home", href: "/" }, { label: "Capabilities" }]}
        ids={["cap-retail-media-a", "cap-creative-a", "cap-ops-a", "cap-analytics-a"]}
      />

      {/* Six capability cards */}
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilitiesContent.map((c) => {
              const stem = capImage(c.slug) ?? "cap-retail-media";
              return (
                <ImageCard
                  key={c.slug}
                  href={`/capabilities/${c.slug}`}
                  imageId={`${stem}-b`}
                  ratio="4/3"
                  chip={c.metric.value}
                  title={c.name}
                  excerpt={c.intro}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Master every marketplace — logo split (§5.4) */}
      <section className="bg-white">
        <div className="container-kw grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow">One team, every channel</p>
            <h2 className="h-display mt-4 text-h2 text-navy-900">Master every marketplace.</h2>
            <p className="prose-kw mt-5 text-body text-ink-muted">
              The same team runs all six capabilities across every marketplace you sell in —
              one catalog, one forecast, one P&amp;L. See the channels we operate.
            </p>
            <Link href="/channels" className="learn-more mt-6">All channels →</Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {logoSlugs.map((s) => (
              <div key={s} className="flex aspect-[5/3] items-center justify-center rounded-2xl border border-sand-300 bg-white p-6 shadow-card">
                <MarketplaceLogo slug={s} className="max-h-9 max-w-[70%]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <PromoBanner
        imageId="promo-capabilities"
        title="Start where the return is highest."
        body="Share your channels and goals. We return a first read on which capability would add the most margin first."
        cta={{ href: "/contact", label: "Request a growth review" }}
      />
    </>
  );
}
