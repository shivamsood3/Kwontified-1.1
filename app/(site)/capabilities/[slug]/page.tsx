import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { ExecFaq } from "@/components/sections/ExecFaq";
import { Button } from "@/components/site/Button";
import { IconTile } from "@/components/ui/IconTile";
import { Stat } from "@/components/ui/Stat";
import { BeforeAfterBars } from "@/components/ui/BeforeAfterBars";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceLd } from "@/lib/seo";
import { capabilityIcons } from "@/lib/icons";
import {
  capabilitiesContent,
  getCapability,
} from "@/lib/content/capabilities";

export function generateStaticParams() {
  return capabilitiesContent.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCapability(slug);
  if (!c) return {};
  return {
    title: c.name,
    description: c.intro,
    alternates: { canonical: `/capabilities/${c.slug}` },
  };
}

export default async function CapabilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCapability(slug);
  if (!c) notFound();

  const others = capabilitiesContent.filter((x) => x.slug !== c.slug);

  // Build a before/after chart from a "A → B" metric (e.g. "8.2% → 12.1%"). (fix 12)
  const num = (s: string) => {
    const m = s.match(/[\d.]+/);
    return m ? parseFloat(m[0]) : null;
  };
  let beforeAfter: {
    before: { label: string; value: string; height: number };
    after: { label: string; value: string; height: number };
  } | null = null;
  if (c.metric.value.includes("→")) {
    const [bStr, aStr] = c.metric.value.split("→").map((s) => s.trim());
    const b = num(bStr);
    const a = num(aStr);
    const bh = b && a ? Math.max(14, Math.round((b / a) * 100)) : 72;
    beforeAfter = {
      before: { label: "Before", value: bStr, height: bh },
      after: { label: "After", value: aStr, height: 100 },
    };
  }

  return (
    <>
      <JsonLd
        data={serviceLd({ name: c.name, description: c.intro, path: `/capabilities/${c.slug}` })}
      />
      <PageHero
        eyebrow="Capability"
        title={c.h1}
        intro={c.intro}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Capabilities", href: "/capabilities" },
          { label: c.name },
        ]}
        cta={{ href: "/contact", label: "Request a marketplace review" }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
          {capabilityIcons[c.slug] && (
            <IconTile icon={capabilityIcons[c.slug]} tone="dark" size="lg" className="mb-6" />
          )}
          <div className="h-display text-5xl text-white md:text-6xl">
            {c.metric.value}
          </div>
          <div className="mt-2 text-sm text-white/70">{c.metric.label}</div>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {c.heroStats.map((s) => (
              <div key={s.label}>
                <div className="h-display text-xl text-white">{s.value}</div>
                <div className="mt-1 text-xs leading-snug text-white/55">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageHero>

      {/* Services */}
      <section className="bg-white">
        <div className="container-kw py-20">
          <h2 className="h-display text-2xl text-ink">What this team runs</h2>
          <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {c.services.map((s) => (
              <div key={s.title}>
                <h3 className="text-base font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-700">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case study callout (fix 12) */}
      <section className="bg-paper">
        <div className="container-kw py-16">
          <div className="grid gap-8 border border-line bg-white p-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="eyebrow">{c.caseStudy.eyebrow}</p>
              <h3 className="h-display mt-2 text-h3 text-ink">{c.caseStudy.title}</h3>
              <div className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-4">
                <Stat value={c.metric.value} label={c.metric.label} tone="light" />
                {!beforeAfter &&
                  c.heroStats
                    .slice(0, 1)
                    .map((s) => <Stat key={s.label} value={s.value} label={s.label} tone="light" />)}
              </div>
              <div className="mt-6">
                <Button href={c.caseStudy.href} variant="outline">
                  Read the case study
                </Button>
              </div>
            </div>
            <div className="md:border-l md:border-line md:pl-8">
              {beforeAfter ? (
                <BeforeAfterBars
                  before={beforeAfter.before}
                  after={beforeAfter.after}
                  tone="light"
                />
              ) : (
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  {c.heroStats.slice(0, 2).map((s) => (
                    <Stat key={s.label} value={s.value} label={s.label} tone="light" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other capabilities */}
      <section className="bg-white">
        <div className="container-kw py-16">
          <h2 className="h-display text-2xl text-ink">The other capabilities</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/capabilities/${o.slug}`}
                className="group border border-line p-5 transition hover:border-brand-600 hover:bg-paper"
              >
                {capabilityIcons[o.slug] && (
                  <IconTile icon={capabilityIcons[o.slug]} className="mb-3" />
                )}
                <div className="text-sm font-semibold text-ink group-hover:text-brand-700">
                  {o.name}
                </div>
                <div className="mt-2 text-xs text-muted">
                  <span className="font-semibold text-brand-600">{o.metric.value}</span>{" "}
                  {o.metric.label}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ExecFaq />

      <CtaBand />
    </>
  );
}
