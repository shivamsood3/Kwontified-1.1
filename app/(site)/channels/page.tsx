import type { Metadata } from "next";
import Link from "next/link";
import { InnerHero } from "@/components/blocks/InnerHero";
import { MoodBand } from "@/components/blocks/MoodBand";
import { MarketplaceLogo } from "@/components/ui/MarketplaceLogo";
import { marketplaceLogos } from "@/lib/content/marketplaceLogos";
import { channelIcons, type Icon } from "@/lib/icons";
import { channelsContent, channelGroups } from "@/lib/content/channels";

export const metadata: Metadata = {
  title: "Channels",
  description:
    "Every marketplace, one business. Amazon, Walmart, Target Plus, international platforms and social commerce — run from one plan and one P&L.",
  alternates: { canonical: "/channels" },
};

// Hub nodes, clockwise from the top (matches the v1.2 diagram).
const hub: { label: string; icon?: Icon; href: string }[] = [
  { label: "Amazon", icon: channelIcons.amazon, href: "/channels/amazon" },
  { label: "Walmart", icon: channelIcons.walmart, href: "/channels/walmart" },
  { label: "Target Plus", icon: channelIcons["target-plus"], href: "/channels/target-plus" },
  { label: "Temu", icon: channelIcons.temu, href: "/channels/temu" },
  { label: "International", icon: channelIcons.international, href: "/channels/international" },
  { label: "Zalando", icon: channelIcons.zalando, href: "/channels/zalando" },
  { label: "Mercado Libre", icon: channelIcons["mercado-libre"], href: "/channels/mercado-libre" },
  { label: "TikTok Shop", icon: channelIcons["tiktok-shop"], href: "/channels/tiktok-shop" },
  { label: "Instagram Shop", icon: channelIcons["instagram-shop"], href: "/channels/instagram-shop" },
  { label: "Amazon brand programs", icon: channelIcons.amazon, href: "/channels/amazon/brand-programs" },
];

export default function ChannelsOverview() {
  return (
    <>
      <InnerHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Channels" }]}
        title="Every marketplace, one business."
        intro="One team manages your catalog, content, advertising and inventory across every channel, so Walmart decisions account for Amazon results and international launches start from a catalog we already know."
        imageId="ch12-index-hero"
        cta={{ href: "/contact", label: "Request a marketplace review" }}
      />

      {/* One budget — navy + hub diagram */}
      <section className="bg-navy-900">
        <div className="container-kw grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <h2 className="h-display text-h2 text-white">One budget, allocated by marginal return.</h2>
            <p className="mt-5 max-w-md text-body leading-relaxed text-white/75">
              Because one team sees every channel, we put the next advertising dollar where it earns
              most, do catalog and content work once and adapt it per platform, and report total
              performance across every channel.
            </p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[480px]">
            {/* spokes */}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
              {hub.map((_, i) => {
                const a = (i / hub.length) * 2 * Math.PI - Math.PI / 2;
                return <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(a)} y2={50 + 40 * Math.sin(a)} stroke="rgba(255,255,255,0.14)" strokeWidth="0.3" />;
              })}
            </svg>
            {/* center */}
            <div className="absolute left-1/2 top-1/2 flex aspect-square w-[26%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-gold-500 text-center">
              <span className="text-[13px] font-medium text-white">One plan</span>
              <span className="text-[11px] text-white/60">one P&amp;L</span>
            </div>
            {/* nodes */}
            {hub.map((n, i) => {
              const a = (i / hub.length) * 2 * Math.PI - Math.PI / 2;
              const x = 50 + 42 * Math.cos(a);
              const y = 50 + 42 * Math.sin(a);
              const Ico = n.icon;
              return (
                <Link
                  key={n.label}
                  href={n.href}
                  className="group absolute flex w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 text-center"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition group-hover:border-gold-500 group-hover:text-gold-300">
                    {Ico && <Ico size={18} weight="light" />}
                  </span>
                  <span className="text-[11px] leading-tight text-white/70 group-hover:text-white">{n.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Choose a platform — logo tile grid */}
      <section className="bg-sky-100">
        <div className="container-kw space-y-12 py-20 lg:py-28">
          <h2 className="h-display text-h2 text-navy-900">Choose a platform to see our services.</h2>
          {channelGroups.map((group) => {
            const items = channelsContent.filter((c) => c.group === group);
            return (
              <div key={group}>
                <h3 className="text-[13px] font-medium uppercase tracking-[0.1em] text-gold-700">{group}</h3>
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {items.map((c) => {
                    const Icon = channelIcons[c.slug];
                    return (
                      <Link key={c.slug} href={`/channels/${c.slug}`} className="group flex flex-col items-center bg-cream-50 p-7 text-center transition-shadow hover:shadow-card">
                        <span className="flex h-10 items-center">
                          {marketplaceLogos[c.slug] ? (
                            <MarketplaceLogo slug={c.slug} className="max-h-9 max-w-[120px]" />
                          ) : Icon ? (
                            <Icon size={32} weight="light" className="text-navy-900" />
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
    </>
  );
}
