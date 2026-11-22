import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { InnerHero } from "@/components/blocks/InnerHero";
import { StatRow } from "@/components/blocks/StatRow";
import { CheckList } from "@/components/blocks/CheckList";
import { FeatureSplit } from "@/components/blocks/FeatureSplit";
import { ImageCard } from "@/components/blocks/ImageCard";
import { DeviceFrame } from "@/components/blocks/DeviceFrame";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceLd } from "@/lib/seo";
import { capabilitiesContent, getCapability } from "@/lib/content/capabilities";

// v1.2 — exact Figma hero photo + the shared pillar composite per capability.
// Each capability's exact Figma hero photo.
const capHero: Record<string, string> = {
  "retail-media": "cap12-retail-hero",
  "creative-studio": "cap12-creative-hero",
  "marketplace-operations": "cap12-ops-hero",
  analytics: "cap12-analytics-hero",
  "ai-commerce": "cap12-agentic-hero",
  "revenue-recovery": "cap12-revenue-hero",
};
const capPillar: Record<string, string> = {
  "retail-media": "home12-pillar-measured",
  "creative-studio": "home12-pillar-made",
  "marketplace-operations": "home12-pillar-run",
  analytics: "home12-pillar-reported",
  "ai-commerce": "home12-pillar-found",
  "revenue-recovery": "home12-pillar-recovered",
};

export function generateStaticParams() {
  return capabilitiesContent.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCapability(slug);
  if (!c) return {};
  return { title: c.name, description: c.intro, alternates: { canonical: `/capabilities/${c.slug}` } };
}

const caseImageFor: Record<string, string> = {
  "amazon-dsp": "case-amazon-dsp",
  "walmart-sku-transition": "case-walmart",
  "international-expansion": "case-international",
  "account-health-restore": "case-account-health",
  "vendor-central-recovery": "case-vendor-central",
  creative: "case-creative",
};

export default async function CapabilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCapability(slug);
  if (!c) notFound();

  const others = capabilitiesContent.filter((x) => x.slug !== c.slug);
  const caseSlug = c.caseStudy.href.split("/").pop() ?? "";
  const caseImg = caseImageFor[caseSlug] ?? "case-amazon-dsp";

  return (
    <>
      <JsonLd data={serviceLd({ name: c.name, description: c.intro, path: `/capabilities/${c.slug}` })} />

      <InnerHero
        eyebrow="Capability"
        title={c.h1}
        intro={c.intro}
        imageId={capHero[c.slug] ?? "cap12-retail-hero"}
        crumbs={[{ label: "Home", href: "/" }, { label: "Capabilities", href: "/capabilities" }, { label: c.name }]}
        cta={{ href: "/contact", label: "Request a marketplace review" }}
      />

      {/* Stat row — navy */}
      <section className="bg-navy-900">
        <div className="container-kw py-14">
          <p className="eyebrow-light">{c.metric.label}</p>
          <p className="h-display mt-3 text-[clamp(32px,4vw,52px)] text-gold-300">{c.metric.value}</p>
          <StatRow className="mt-10" tone="navy" stats={c.heroStats.map((s) => ({ value: s.value, label: s.label }))} />
        </div>
      </section>

      {/* What this team runs — check list + DeviceFrame (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw grid items-start gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="eyebrow">What this team runs</p>
            <h2 className="h-display mt-4 text-h2 text-navy-900">Everything in one scope.</h2>
            <CheckList className="mt-8" items={c.services.map((s) => ({ title: s.title, body: s.body }))} />
          </div>
          <div className="lg:sticky lg:top-24">
            <DeviceFrame title={c.name} />
          </div>
        </div>
      </section>

      {/* How it connects — FeatureSplit (beige) */}
      <section className="bg-cream-100">
        <div className="container-kw py-20">
          <FeatureSplit
            reverse
            eyebrow="How it connects"
            title="One plan the whole team reads."
            imageId={capPillar[c.slug] ?? "home12-pillar-measured"}
            cta={{ href: "/why-kwontified", label: "Why one team wins" }}
          >
            <p>
              {c.name} doesn’t run in isolation. The forecast, the catalog and the ad plan
              are the same plan, so a change in one is visible to all of them — and the
              numbers reconcile against one P&amp;L.
            </p>
          </FeatureSplit>
        </div>
      </section>

      {/* Related case study (white) */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <p className="eyebrow">{c.caseStudy.eyebrow}</p>
          <h2 className="h-display mt-4 text-h2 text-navy-900">Proof from an account we run.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <ImageCard
              className="md:col-span-1"
              href={c.caseStudy.href}
              imageId={caseImg}
              ratio="16/9"
              chip={c.metric.value}
              title={c.caseStudy.title}
              excerpt={`${c.metric.label}.`}
              cta="Read case study"
            />
          </div>
        </div>
      </section>

      {/* Other capabilities (cream) */}
      <section className="bg-cream-50">
        <div className="container-kw py-20">
          <h2 className="h-display text-h2 text-navy-900">The other capabilities</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <ImageCard
                key={o.slug}
                href={`/capabilities/${o.slug}`}
                imageId={capPillar[o.slug] ?? "home12-pillar-measured"}
                ratio="4/3"
                chip={o.metric.value}
                title={o.name}
                excerpt={o.metric.label}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
