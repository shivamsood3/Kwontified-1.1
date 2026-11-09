import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { ExecFaq } from "@/components/sections/ExecFaq";
import { Stat } from "@/components/ui/Stat";
import { capabilitiesContent } from "@/lib/content/capabilities";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Six capabilities, one team: retail media, creative, operations, analytics, AI commerce and revenue recovery — all sharing one plan and one data set.",
  alternates: { canonical: "/capabilities" },
};

export default function CapabilitiesOverview() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="Six capabilities, one team."
        intro="Each capability is staffed by specialists. All six share one plan, one data set and one account lead — so media, creative and operations never work against each other."
        crumbs={[{ label: "Home", href: "/" }, { label: "Capabilities" }]}
        cta={{ href: "/contact", label: "Request a marketplace review" }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
          <p className="text-xs font-normal text-white/50">
            Every channel judged on incremental return
          </p>
          <div className="mt-6 grid grid-cols-3 gap-6">
            <Stat value="$1.8M" label="DSP revenue" tone="dark" />
            <Stat value="+28%" label="New-to-brand" tone="dark" />
            <Stat value="9.4x" label="DSP ROAS" tone="dark" />
          </div>
        </div>
      </PageHero>

      <section className="bg-white">
        <div className="container-kw py-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilitiesContent.map((c) => (
              <Link
                key={c.slug}
                href={`/capabilities/${c.slug}`}
                className="group flex flex-col rounded-2xl border border-line bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <h2 className="h-display text-xl text-ink group-hover:text-brand-700">
                  {c.name}
                </h2>
                <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-700">
                  {c.intro}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="h-display text-lg text-brand-600">
                    {c.metric.value}
                  </span>
                  <span className="text-xs text-muted">{c.metric.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ExecFaq />

      <CtaBand
        title="Start where the return is highest."
        body="Share your channels and goals. We return a first read on which capability, from retail media to operations, would add the most margin first."
        cta={{ href: "/contact", label: "Request a growth review" }}
      />
    </>
  );
}
