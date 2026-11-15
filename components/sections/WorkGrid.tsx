"use client";

import { useState } from "react";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { caseStudies, workFilters, type CaseStudy } from "@/lib/content/work";
import { cn } from "@/lib/cn";

// Map each case study to a faceless case image. Known slugs map directly; the
// rest cycle through the remaining case images so every card is image-led.
const slugImage: Record<string, string> = {
  "amazon-dsp": "case-amazon-dsp",
  "vendor-central-recovery": "case-vendor-central",
  "account-health-restore": "case-account-health",
  "walmart-sku-transition": "case-walmart",
  "international-expansion": "case-international",
};
const pool = ["case-creative", "case-tula", "case-kipling", "case-divi", "case-alex", "case-walmart-detail"];

function imageFor(c: CaseStudy, i: number): string {
  if (c.slug && slugImage[c.slug]) return slugImage[c.slug];
  return pool[i % pool.length];
}

export function WorkGrid() {
  const [channel, setChannel] = useState("All");
  const filtered = caseStudies.filter((c) => channel === "All" || c.channel === channel);

  return (
    <div>
      {/* One row of channel chips (§4.9) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-sand-300 pb-6">
        {workFilters.channels.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setChannel(o)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition",
              channel === o
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-sand-300 text-ink-muted hover:border-navy-900 hover:text-navy-900",
            )}
          >
            {o}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink-muted">
        {filtered.length} case {filtered.length === 1 ? "study" : "studies"}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c, i) => (
          <CaseTile key={c.title + i} c={c} image={imageFor(c, i)} />
        ))}
      </div>
    </div>
  );
}

function CaseTile({ c, image }: { c: CaseStudy; image: string }) {
  const inner = (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow",
        c.slug && "hover:shadow-lift",
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Img id={image} sizes="(max-width: 768px) 100vw, 33vw" className={c.slug ? "transition-transform duration-500 group-hover:scale-[1.03]" : ""} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full border border-sand-300 px-2.5 py-1 text-[12px] leading-none text-ink-muted">
            {c.channel}
          </span>
          {c.draft && (
            <span className="rounded bg-cream-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-faint">Draft</span>
          )}
        </div>
        <p className="mt-3 text-[12px] text-ink-faint">{c.brand}</p>
        <h3 className="h-display mt-1 text-h3 text-navy-900">{c.title}</h3>
        <div className="mt-auto flex flex-wrap gap-x-8 gap-y-3 pt-5">
          {c.stats.slice(0, 2).map((s) => (
            <div key={s.label}>
              <div className="h-display text-xl text-gold-700">{s.value}</div>
              <div className="text-xs text-ink-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (c.slug) {
    return (
      <Link href={`/work/${c.slug}`} className="group block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
