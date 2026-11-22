import Link from "next/link";
import type { Crumb } from "@/components/sections/PageHero";
import { InnerHero } from "@/components/blocks/InnerHero";
import { CheckList } from "@/components/blocks/CheckList";
import { FeatureSplit } from "@/components/blocks/FeatureSplit";
import { ImageCard } from "@/components/blocks/ImageCard";
import { DeviceFrame } from "@/components/blocks/DeviceFrame";
import { PromoBanner } from "@/components/blocks/PromoBanner";
import { Quote } from "@/components/ui/Quote";
import { IconTile } from "@/components/ui/IconTile";
import { MarketplaceLogo } from "@/components/ui/MarketplaceLogo";
import { capabilities } from "@/lib/nav";
import { capabilityIcons } from "@/lib/icons";
import { marketplaceLogos } from "@/lib/content/marketplaceLogos";
import { chImage } from "@/lib/content/imageMap";
import type { ChannelProblem } from "@/lib/content/channels";

const caseCards = [
  { href: "/work/walmart-sku-transition", id: "case-walmart", chip: "Walmart", title: "A clean SKU transition.", excerpt: "Combined revenue up 19% through a major SKU transition." },
  { href: "/work/international-expansion", id: "case-international", chip: "UK · EU · CA", title: "$1.4M international revenue.", excerpt: "One localized catalog, three new regions." },
  { href: "/work/account-health-restore", id: "case-account-health", chip: "Amazon", title: "A collapsed $6.2M business, restored.", excerpt: "147 listings restored, revenue up 68%." },
];

export function ChannelTemplate({
  slug,
  eyebrow = "Channel",
  name,
  h1,
  intro,
  metric,
  reviewLabel,
  crumbs,
  accountTypes,
  problems,
  showCapabilities = true,
  related,
}: {
  slug: string;
  eyebrow?: string;
  name: string;
  h1: string;
  intro: string;
  metric: { value: string; label: string };
  reviewLabel: string;
  crumbs: Crumb[];
  accountTypes?: { title: string; body: string }[];
  problems: ChannelProblem[];
  showCapabilities?: boolean;
  related?: { label: string; href: string }[];
}) {
  const stem = chImage(slug) ?? "ch-amazon";
  const hasLogo = !!marketplaceLogos[slug];
  const checkItems = [
    ...(accountTypes ?? []).map((a) => ({ title: a.title, body: a.body })),
    ...problems.map((p) => ({ title: p.problem, body: p.solution })),
  ];

  return (
    <>
      <InnerHero
        eyebrow={eyebrow}
        title={h1}
        intro={intro}
        imageId={`ch12-${slug}-hero`}
        crumbs={crumbs}
        cta={{ href: "/contact", label: reviewLabel }}
      />

      {/* Stat band — navy */}
      <section className="bg-navy-900">
        <div className="container-kw py-14">
          <p className="eyebrow-light">{metric.label}</p>
          <p className="h-display mt-3 text-[clamp(40px,5vw,68px)] text-gold-300">{metric.value}</p>
        </div>
      </section>

      {/* Where we help — check list + DeviceFrame (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw grid items-start gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="eyebrow">Where we help on {name}</p>
            <h2 className="h-display mt-4 text-h2 text-navy-900">Run to this channel’s standard.</h2>
            <CheckList className="mt-8" items={checkItems} />
          </div>
          <div className="lg:sticky lg:top-24">
            <DeviceFrame
              title={`${name} · Account Health`}
              logo={hasLogo ? <MarketplaceLogo slug={slug} tone="white" className="h-5 max-w-[110px]" /> : undefined}
            />
          </div>
        </div>
      </section>

      {/* One team split (beige) */}
      <section className="bg-cream-100">
        <div className="container-kw py-20">
          <FeatureSplit
            reverse
            eyebrow="One team"
            title={`One team runs ${name}.`}
            imageId={`${stem}-b`}
            cta={{ href: "/capabilities", label: "See all capabilities" }}
          >
            <p>
              Advertising, creative, operations and analytics for {name} sit on one team and
              one plan — so decisions here account for your results everywhere else you sell.
            </p>
          </FeatureSplit>
        </div>
      </section>

      {/* Capabilities on this channel (white) */}
      {showCapabilities && (
        <section className="bg-white">
          <div className="container-kw py-20">
            <h2 className="h-display text-h2 text-navy-900">How each capability works on {name}.</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c) => {
                const Icon = capabilityIcons[c.href.split("/").pop() ?? ""];
                return (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="group flex flex-col rounded-2xl border border-sand-300 bg-white p-6 shadow-card transition-shadow hover:shadow-lift"
                  >
                    {Icon && <IconTile icon={Icon} className="mb-4" />}
                    <h3 className="h-display text-h3 text-navy-900">{c.label}</h3>
                    <p className="mt-2 text-small leading-relaxed text-ink-muted">{c.blurb}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonial (navy) */}
      <section className="bg-navy-900">
        <div className="container-kw py-20">
          <Quote tone="dark">
            “They run {name} as part of our whole business, not a silo — and the reporting finally ties out.”
          </Quote>
        </div>
      </section>

      {/* Case studies (white) */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <h2 className="h-display text-h2 text-navy-900">Proof from accounts we run.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {caseCards.map((c) => (
              <ImageCard key={c.href} href={c.href} imageId={c.id} ratio="16/9" chip={c.chip} title={c.title} excerpt={c.excerpt} cta="Read case study" />
            ))}
          </div>
          {related && related.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {related.map((r) => (
                <Link key={r.href} href={r.href} className="learn-more">{r.label} →</Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <PromoBanner imageId="promo-channels" />
    </>
  );
}
