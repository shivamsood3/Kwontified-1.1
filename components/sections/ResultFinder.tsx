"use client";

import { useState } from "react";
import { Button } from "@/components/site/Button";

const channels = [
  "Amazon Seller Central",
  "Amazon Vendor Central",
  "Walmart",
  "Target Plus",
  "International",
];
const revenues = ["Under $5M", "$5M to $25M", "Over $25M"];

type Result = { stat: string; label: string; body: string; href: string };

const results: Record<string, Result> = {
  "Amazon Seller Central": {
    stat: "9.4x",
    label: "DSP ROAS, Amazon",
    body: "A national beauty brand’s $192K of Amazon DSP returned $1.8M at 9.4x ROAS, with new-to-brand sales up 28% and search ROAS held.",
    href: "/work/amazon-dsp",
  },
  "Amazon Vendor Central": {
    stat: "$14.0M",
    label: "Annual revenue, Vendor Central",
    body: "Annual revenue for a Vendor Central business that was flat at $10.5M before we fixed chargebacks, fill rates and shortage claims.",
    href: "/capabilities/revenue-recovery",
  },
  Walmart: {
    stat: "+19%",
    label: "Walmart revenue",
    body: "Combined Walmart revenue for a consumer health brand through a major SKU transition, with supplier ROAS up from 3.0x to 4.2x.",
    href: "/channels/walmart",
  },
  "Target Plus": {
    stat: "+34%",
    label: "revenue, Target Plus",
    body: "Revenue growth through operational excellence for an apparel brand run to Target’s standards, with Roundel advertising on margin.",
    href: "/channels/target-plus",
  },
  International: {
    stat: "$1.4M",
    label: "International revenue",
    body: "International revenue across the UK, EU and Canada for a premium fashion brand that had sold only in the US.",
    href: "/channels/international",
  },
};

export function ResultFinder() {
  const [channel, setChannel] = useState(channels[1]);
  const [revenue, setRevenue] = useState(revenues[1]);
  const result = results[channel];

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-center">
      <div>
        <h2 className="h-display text-3xl text-ink md:text-4xl">
          Find the result closest to your business.
        </h2>
        <p className="mt-4 max-w-md text-[1.0625rem] text-muted">
          Choose where you sell most and your annual marketplace revenue. We show
          the published case study nearest to you, and the review request carries
          your answers.
        </p>

        <div className="mt-6 space-y-4">
          <Field label="Where you sell most">
            <Select value={channel} onChange={setChannel} options={channels} />
          </Field>
          <Field label="Annual marketplace revenue">
            <Select value={revenue} onChange={setRevenue} options={revenues} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-8 shadow-card">
        <div className="eyebrow">Closest result · {channel}</div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="h-display text-5xl text-brand-600">{result.stat}</span>
          <span className="text-sm font-medium text-muted">{result.label}</span>
        </div>
        <p className="mt-4 text-[0.975rem] leading-relaxed text-slate-600">
          {result.body}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/contact">Request a review for this business</Button>
          <Button href={result.href} variant="outline">
            Read the case study
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}
