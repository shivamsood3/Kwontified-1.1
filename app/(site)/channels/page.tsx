import type { Metadata } from "next";
import Link from "next/link";
import { CollageHero } from "@/components/blocks/CollageHero";
import { MoodBand } from "@/components/blocks/MoodBand";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { MarketplaceLogo } from "@/components/ui/MarketplaceLogo";
import { marketplaceLogos } from "@/lib/content/marketplaceLogos";
import { channelIcons } from "@/lib/icons";
import { channelsContent, channelGroups } from "@/lib/content/channels";

export const metadata: Metadata = {
  title: "Channels",
  description:
    "Every marketplace, one business. Amazon, Walmart, Target Plus, international platforms and social commerce — run from one plan and one P&L.",
  alternates: { canonical: "/channels" },
};

export default function ChannelsOverview() {
  return (
    <>
      <CollageHero
        eyebrow="Channels"
        title="Every marketplace, one business."
        intro="One team manages your catalog, content, advertising and inventory across every channel — so Walmart decisions account for Amazon results, and international launches start from a catalog we already know."
        crumbs={[{ label: "Home", href: "/" }, { label: "Channels" }]}
        ids={["ch-amazon-a", "ch-walmart-a", "ch-tiktok-a", "ch-international-a"]}
      />

      {/* Choose a platform — logo tile grid (§5.4) */}
      <section className="bg-cream-50">
        <div className="container-kw space-y-12 py-20">
          <p className="eyebrow">Choose a platform to see our services</p>
          {channelGroups.map((group) => {
            const items = channelsContent.filter((c) => c.group === group);
            return (
              <div key={group}>
                <h2 className="text-[12px] font-medium uppercase tracking-[0.12em] text-gold-700">{group}</h2>
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {items.map((c) => {
                    const Icon = channelIcons[c.slug];
                    return (
                      <Link
                        key={c.slug}
                        href={`/channels/${c.slug}`}
                        className="group flex flex-col items-center rounded-2xl border border-sand-300 bg-white p-7 text-center shadow-card transition-shadow hover:shadow-lift"
                      >
                        <span className="flex h-10 items-center">
                          {marketplaceLogos[c.slug] ? (
                            <MarketplaceLogo slug={c.slug} className="max-h-10 max-w-[120px]" />
                          ) : Icon ? (
                            <Icon size={34} weight="light" className="text-navy-900" />
                          ) : (
                            <span className="h-display text-lg text-navy-900">{c.h1.replace(/\.$/, "")}</span>
                          )}
                        </span>
                        <span className="mt-4 text-caption text-ink-muted">{c.metric.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <MoodBand id="channels-band" />

      <PromoBanner imageId="promo-channels" />
    </>
  );
}
