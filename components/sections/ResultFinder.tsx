"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/site/Button";
import { ui } from "@/lib/icons";
import { cn } from "@/lib/cn";

const channels = [
  "Amazon Seller Central",
  "Amazon Vendor Central",
  "Walmart",
  "Target Plus",
  "International",
];
const revenues = ["Under $5M", "$5M to $25M", "Over $25M"];

type Result = { tag: string; stat: string; body: string; moreHref: string; moreLabel: string };

const results: Record<string, Result> = {
  "Amazon Seller Central": {
    tag: "Amazon Luxury Stores",
    stat: "71%",
    body: "Of a cashmere label’s first-season Amazon allocation sold at full price, with no markdowns or coupons.",
    moreHref: "/channels/amazon",
    moreLabel: "See more Amazon results",
  },
  "Amazon Vendor Central": {
    tag: "Vendor Central recovery",
    stat: "$781K",
    body: "Shortage claims recovered for a kitchen appliance vendor, with its shortage rate cut 72%.",
    moreHref: "/capabilities/revenue-recovery",
    moreLabel: "See more recovery results",
  },
  Walmart: {
    tag: "Walmart Connect",
    stat: "6.8x",
    body: "Omnichannel return on Walmart display advertising for a baby food supplier, with 62% of attributed sales made in stores.",
    moreHref: "/channels/walmart",
    moreLabel: "See more Walmart results",
  },
  "Target Plus": {
    tag: "Target Plus launch",
    stat: "9 weeks",
    body: "To take a bedding brand live on Target Plus, with 97% of its items approved first time.",
    moreHref: "/channels/target-plus",
    moreLabel: "See more Target Plus results",
  },
  International: {
    tag: "International expansion",
    stat: "$1.4M",
    body: "International revenue across the UK, EU and Canada for a premium fashion brand that had sold only in the US.",
    moreHref: "/channels/international",
    moreLabel: "See more international results",
  },
};

export function ResultFinder() {
  const [channel, setChannel] = useState(channels[0]);
  const [revenue, setRevenue] = useState(revenues[0]);
  const r = results[channel];
  const contactHref = `/contact?channel=${encodeURIComponent(channel)}&revenue=${encodeURIComponent(revenue)}`;

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div>
        <h2 className="h-display text-h2 text-navy-900">Find the result closest to your business.</h2>
        <p className="mt-4 max-w-md text-body text-ink-muted">
          Choose where you sell most and your annual marketplace revenue. We show the case study
          nearest to you, and the review request carries your answers.
        </p>
        <Fieldset label="Where you sell most" options={channels} value={channel} onChange={setChannel} />
        <Fieldset label="Annual marketplace revenue" options={revenues} value={revenue} onChange={setRevenue} />
      </div>

      <div className="rounded-lg bg-cream-50 p-8 shadow-card md:p-10">
        <p className="text-sm text-ink-muted">{r.tag}</p>
        <p className="mt-2 text-[clamp(44px,5vw,72px)] font-normal leading-none tracking-tightish text-navy-900">{r.stat}</p>
        <p className="mt-4 text-body leading-relaxed text-ink">{r.body}</p>
        <div className="mt-7">
          <Button href={contactHref} variant="primary">Request a review for this business</Button>
        </div>
        <Link href={r.moreHref} className="learn-more mt-5">
          {r.moreLabel}
          <ui.ArrowRight size={15} weight="bold" />
        </Link>
      </div>
    </div>
  );
}

function Fieldset({
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
    <div className="mt-8">
      <p className="text-caption text-ink-muted">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition",
              value === o
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-sand-300 text-ink-muted hover:border-navy-900 hover:text-navy-900",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
