import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { ExecFaq } from "@/components/sections/ExecFaq";
import {
  channelsContent,
  channelGroups,
  brandPrograms,
} from "@/lib/content/channels";

export const metadata: Metadata = {
  title: "Channels",
  description:
    "Every marketplace, one business. Amazon, Walmart, Target Plus, international platforms and social commerce — run from one plan and one P&L.",
  alternates: { canonical: "/channels" },
};

const hubNodes = [
  "Amazon",
  "Walmart",
  "Target Plus",
  "Zalando",
  "Mercado Libre",
  "Temu",
  "TikTok Shop",
  "Instagram Shop",
];

export default function ChannelsOverview() {
  return (
    <>
      <PageHero
        eyebrow="Channels"
        title="Every marketplace, one business."
        intro="One team manages your catalog, content, advertising and inventory across every channel — so Walmart decisions account for Amazon results, and international launches start from a catalog we already know."
        crumbs={[{ label: "Home", href: "/" }, { label: "Channels" }]}
        cta={{ href: "/contact", label: "Request a marketplace review" }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
          <div className="mx-auto mb-6 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-brand-600 text-center">
            <span className="text-sm font-semibold text-white">One plan</span>
            <span className="text-[0.7rem] text-white/70">one P&amp;L</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {hubNodes.map((n) => (
              <span
                key={n}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </PageHero>

      <section className="bg-white">
        <div className="container-kw space-y-14 py-20">
          {channelGroups.map((group) => {
            const items = channelsContent.filter((c) => c.group === group);
            return (
              <div key={group}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                  {group}
                </h2>
                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/channels/${c.slug}`}
                      className="group flex flex-col rounded-2xl border border-line bg-white p-7 transition hover:-translate-y-0.5 hover:shadow-card"
                    >
                      <h3 className="h-display text-lg text-ink group-hover:text-brand-700">
                        {c.h1.replace(/\.$/, "")}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                        {c.intro}
                      </p>
                      <span className="mt-4 text-xs font-medium text-muted">
                        {c.metric.value} · {c.metric.label}
                      </span>
                    </Link>
                  ))}
                  {group === "US marketplaces" && (
                    <Link
                      href="/channels/amazon/brand-programs"
                      className="group flex flex-col rounded-2xl border border-dashed border-line bg-paper p-7 transition hover:border-brand-300"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">
                        Amazon programs
                      </span>
                      <h3 className="h-display mt-2 text-lg text-ink group-hover:text-brand-700">
                        {brandPrograms.h1.replace(/\.$/, "")}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                        {brandPrograms.intro}
                      </p>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ExecFaq />

      <CtaBand />
    </>
  );
}
