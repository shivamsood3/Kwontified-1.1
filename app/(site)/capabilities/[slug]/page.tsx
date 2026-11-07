import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { ExecFaq } from "@/components/sections/ExecFaq";
import { Button } from "@/components/site/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceLd } from "@/lib/seo";
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
                <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-600">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case study callout */}
      <section className="bg-paper">
        <div className="container-kw py-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-white p-8 md:flex-row md:items-center">
            <div>
              <p className="eyebrow">{c.caseStudy.eyebrow}</p>
              <h3 className="h-display mt-2 text-2xl text-ink">
                {c.caseStudy.title}
              </h3>
            </div>
            <Button href={c.caseStudy.href} variant="outline">
              Read the case study
            </Button>
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
                className="group rounded-xl border border-line p-5 transition hover:border-brand-300 hover:bg-paper"
              >
                <div className="text-sm font-semibold text-ink group-hover:text-brand-700">
                  {o.name}
                </div>
                <div className="mt-2 text-xs text-muted">{o.metric.value}</div>
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
