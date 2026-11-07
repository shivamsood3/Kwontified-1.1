"use client";

import { useState } from "react";
import Link from "next/link";
import { caseStudies, workFilters, type CaseStudy } from "@/lib/content/work";
import { cn } from "@/lib/cn";

export function WorkGrid() {
  const [channel, setChannel] = useState("All");
  const [capability, setCapability] = useState("All");

  const filtered = caseStudies.filter(
    (c) =>
      (channel === "All" || c.channel === channel) &&
      (capability === "All" || c.capability === capability),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-line pb-6">
        <FilterRow
          label="Channel"
          options={workFilters.channels}
          value={channel}
          onChange={setChannel}
        />
        <FilterRow
          label="Capability"
          options={workFilters.capabilities}
          value={capability}
          onChange={setCapability}
        />
      </div>

      <p className="mt-6 text-sm text-muted">
        {filtered.length} case {filtered.length === 1 ? "study" : "studies"}
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c, i) => (
          <Card key={c.title + i} c={c} />
        ))}
      </div>
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 w-20 shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition",
            value === o
              ? "border-ink bg-ink text-white"
              : "border-line text-muted hover:border-brand-300 hover:text-ink",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Card({ c }: { c: CaseStudy }) {
  const inner = (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition",
        c.slug && "group hover:-translate-y-0.5 hover:shadow-card",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted">{c.brand}</span>
        {c.draft && (
          <span className="rounded bg-paper px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-muted">
            Draft
          </span>
        )}
      </div>
      <h3 className="h-display mt-3 text-lg text-ink group-hover:text-brand-700">
        {c.title}
      </h3>
      <div className="mt-auto flex flex-wrap gap-x-8 gap-y-3 pt-5">
        {c.stats.map((s) => (
          <div key={s.label}>
            <div className="h-display text-xl text-brand-600">{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (c.slug) {
    return (
      <Link href={`/work/${c.slug}`} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
